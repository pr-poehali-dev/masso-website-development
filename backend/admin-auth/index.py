import json
import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = "t_p44929272_masso_website_develo"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"], options=f"-c search_path={SCHEMA}")
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=RealDictCursor)
    return conn, cur


def handler(event: dict, context) -> dict:
    """Авторизация администратора: проверяет email и пароль, возвращает данные пользователя."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": {"status": "ok"},
        }

    if method != "POST":
        return {
            "statusCode": 405,
            "headers": CORS_HEADERS,
            "body": {"success": False, "error": "Метод не поддерживается"},
        }

    body = json.loads(event.get("body") or "{}")
    email = (body.get("email") or "").strip().lower()
    password = (body.get("password") or "").strip()

    if not email or not password:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": {"success": False, "error": "Email и пароль обязательны"},
        }

    password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

    conn, cur = get_conn()

    cur.execute(
        "SELECT id, email, name, role, password_hash, is_active FROM admin_users WHERE email = %s",
        (email,),
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": {"success": False, "error": "Неверный email или пароль"},
        }

    if not user["is_active"]:
        return {
            "statusCode": 403,
            "headers": CORS_HEADERS,
            "body": {"success": False, "error": "Аккаунт деактивирован"},
        }

    if user["password_hash"] != password_hash:
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": {"success": False, "error": "Неверный email или пароль"},
        }

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": {
            "success": True,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
            },
        },
    }
