import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Получение и добавление отзывов клиентов."""
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
        if event.get('httpMethod') == 'GET':
            cur.execute(
                "SELECT id, name, device, rating, text, created_at FROM reviews WHERE is_published = TRUE ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            data = [
                {'id': r[0], 'name': r[1], 'device': r[2], 'rating': r[3], 'text': r[4], 'created_at': str(r[5])}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(data)}

        if event.get('httpMethod') == 'POST':
            body = json.loads(event.get('body') or '{}')
            name = body.get('name', '').strip()
            text = body.get('text', '').strip()
            rating = int(body.get('rating', 5))
            device = body.get('device', '').strip()

            if not name or not text:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Имя и текст обязательны'})}
            if rating < 1 or rating > 5:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Рейтинг от 1 до 5'})}

            cur.execute(
                "INSERT INTO reviews (name, device, rating, text) VALUES (%s, %s, %s, %s) RETURNING id",
                (name, device, rating, text)
            )
            conn.commit()
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'message': 'Отзыв отправлен на модерацию'})}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
