import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Приём и получение заявок с формы сайта."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if event.get('httpMethod') == 'POST':
            body = json.loads(event.get('body') or '{}')
            name = body.get('name', '').strip()
            phone = body.get('phone', '').strip()
            device = body.get('device', '').strip()
            comment = body.get('comment', '').strip()

            if not name or not phone:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Имя и телефон обязательны'})}

            cur.execute(
                "INSERT INTO applications (name, phone, device, comment) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                (name, phone, device, comment)
            )
            row = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'id': row[0], 'message': 'Заявка принята'})
            }

        if event.get('httpMethod') == 'GET':
            cur.execute("SELECT id, name, phone, device, comment, status, created_at FROM applications ORDER BY created_at DESC")
            rows = cur.fetchall()
            data = [
                {'id': r[0], 'name': r[1], 'phone': r[2], 'device': r[3], 'comment': r[4], 'status': r[5], 'created_at': str(r[6])}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(data)}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
