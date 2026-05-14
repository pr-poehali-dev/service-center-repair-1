import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Управление заказами на ремонт и отслеживание статусов."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        params = event.get('queryStringParameters') or {}

        if event.get('httpMethod') == 'GET':
            order_number = params.get('number')
            if order_number:
                cur.execute(
                    "SELECT order_number, client_name, device, problem, status, master, price, created_at, updated_at FROM orders WHERE order_number = %s",
                    (order_number.upper(),)
                )
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Заказ не найден'})}
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'order_number': row[0], 'client_name': row[1], 'device': row[2],
                        'problem': row[3], 'status': row[4], 'master': row[5],
                        'price': row[6], 'created_at': str(row[7]), 'updated_at': str(row[8])
                    })
                }
            cur.execute("SELECT order_number, client_name, device, status, master, created_at FROM orders ORDER BY created_at DESC")
            rows = cur.fetchall()
            data = [
                {'order_number': r[0], 'client_name': r[1], 'device': r[2], 'status': r[3], 'master': r[4], 'created_at': str(r[5])}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(data)}

        if event.get('httpMethod') == 'POST':
            body = json.loads(event.get('body') or '{}')
            cur.execute("SELECT COUNT(*) FROM orders")
            count = cur.fetchone()[0]
            order_number = f"TC-{count + 1001:04d}"
            cur.execute(
                "INSERT INTO orders (order_number, client_name, client_phone, device, problem, master) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (order_number, body.get('client_name', ''), body.get('client_phone', ''), body.get('device', ''), body.get('problem', ''), body.get('master', ''))
            )
            conn.commit()
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'order_number': order_number})}

        if event.get('httpMethod') == 'PUT':
            body = json.loads(event.get('body') or '{}')
            order_number = body.get('order_number', '').upper()
            new_status = body.get('status')
            allowed = ['received', 'diagnosing', 'repairing', 'done']
            if new_status not in allowed:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Недопустимый статус'})}
            cur.execute(
                "UPDATE orders SET status = %s, updated_at = NOW() WHERE order_number = %s RETURNING id",
                (new_status, order_number)
            )
            if not cur.fetchone():
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Заказ не найден'})}
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'message': 'Статус обновлён'})}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
