import json
import os
from datetime import date, datetime
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = "t_p44929272_masso_website_develo"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


def serialize(obj):
    if isinstance(obj, dict):
        return {k: serialize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize(i) for i in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    return obj


def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"], options=f"-c search_path={SCHEMA}")
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=RealDictCursor)
    return conn, cur


def handler(event: dict, context) -> dict:
    """Управление настройками: тарифы, формула рейтинга, пользователи."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    conn, cur = get_conn()
    section = params.get("section", "all")

    if method == "GET":
        result = {}

        if section in ("all", "tariffs"):
            cur.execute("SELECT * FROM tariffs ORDER BY id")
            result["tariffs"] = [dict(r) for r in cur.fetchall()]

        if section in ("all", "rating"):
            cur.execute("SELECT * FROM rating_settings ORDER BY id LIMIT 1")
            row = cur.fetchone()
            result["rating_settings"] = dict(row) if row else None

        if section in ("all", "users"):
            cur.execute("SELECT id, email, name, role, is_active, created_at FROM admin_users ORDER BY id")
            result["users"] = [dict(r) for r in cur.fetchall()]

        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize(result)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action")

        if action == "create_tariff":
            name = body.get("name", "").strip()
            price = body.get("price", 0)
            description = body.get("description", "").strip()
            features = body.get("features", "").strip()
            if not name:
                cur.close()
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Название обязательно"}}
            cur.execute(
                "INSERT INTO tariffs (name, price, description, features) VALUES (%s, %s, %s, %s) RETURNING *",
                (name, price, description or None, features or None),
            )
            tariff = dict(cur.fetchone())
            cur.close()
            conn.close()
            return {"statusCode": 201, "headers": CORS_HEADERS, "body": serialize({"tariff": tariff})}

        cur.close()
        conn.close()
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Неизвестное действие"}}

    if method == "PUT":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action")

        if action == "update_tariff":
            tariff_id = body.get("id")
            if not tariff_id:
                cur.close()
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "ID обязателен"}}
            fields = []
            values = []
            for f in ["name", "price", "description", "features", "is_active"]:
                if f in body:
                    fields.append(f"{f} = %s")
                    values.append(body[f])
            if not fields:
                cur.close()
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Нет данных"}}
            fields.append("updated_at = NOW()")
            values.append(int(tariff_id))
            cur.execute(f"UPDATE tariffs SET {', '.join(fields)} WHERE id = %s RETURNING *", values)
            tariff = cur.fetchone()
            cur.close()
            conn.close()
            if not tariff:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": {"error": "Тариф не найден"}}
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"tariff": dict(tariff)})}

        if action == "update_rating":
            formula = body.get("formula", "").strip()
            if not formula:
                cur.close()
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Формула обязательна"}}
            cur.execute("UPDATE rating_settings SET formula = %s, updated_at = NOW() WHERE id = 1 RETURNING *", (formula,))
            row = cur.fetchone()
            cur.close()
            conn.close()
            if not row:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": {"error": "Настройки не найдены"}}
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"rating_settings": dict(row)})}

        if action == "update_user":
            user_id = body.get("id")
            if not user_id:
                cur.close()
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "ID обязателен"}}
            fields = []
            values = []
            for f in ["name", "email", "role", "is_active"]:
                if f in body:
                    fields.append(f"{f} = %s")
                    values.append(body[f])
            if not fields:
                cur.close()
                conn.close()
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Нет данных"}}
            fields.append("updated_at = NOW()")
            values.append(int(user_id))
            cur.execute(f"UPDATE admin_users SET {', '.join(fields)} WHERE id = %s RETURNING id, email, name, role, is_active", values)
            user = cur.fetchone()
            cur.close()
            conn.close()
            if not user:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": {"error": "Пользователь не найден"}}
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"user": dict(user)})}

        cur.close()
        conn.close()
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Неизвестное действие"}}

    cur.close()
    conn.close()
    return {"statusCode": 405, "headers": CORS_HEADERS, "body": {"error": "Method not allowed"}}
