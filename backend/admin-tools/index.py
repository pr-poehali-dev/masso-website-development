import json
import os
from datetime import date, datetime
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = "t_p44929272_masso_website_develo"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    """CRUD для управления инструментами салонов (калькулятор, диагностика, тесты)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    conn, cur = get_conn()

    if method == "GET":
        tool_id = params.get("id")
        if tool_id:
            cur.execute("SELECT * FROM tools WHERE id = %s", (int(tool_id),))
            tool = cur.fetchone()
            cur.close()
            conn.close()
            if not tool:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": {"error": "Инструмент не найден"}}
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"tool": dict(tool)})}

        cur.execute("SELECT * FROM tools ORDER BY id")
        tools = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"tools": tools})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        name = body.get("name", "").strip()
        slug = body.get("slug", "").strip()
        description = body.get("description", "").strip()
        hints = body.get("hints", "").strip()
        formula = body.get("formula", "").strip()

        if not name or not slug:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Название и slug обязательны"}}

        cur.execute(
            "INSERT INTO tools (name, slug, description, hints, formula) VALUES (%s, %s, %s, %s, %s) RETURNING *",
            (name, slug, description or None, hints or None, formula or None),
        )
        tool = dict(cur.fetchone())
        cur.close()
        conn.close()
        return {"statusCode": 201, "headers": CORS_HEADERS, "body": serialize({"tool": tool})}

    if method == "PUT":
        body = json.loads(event.get("body") or "{}")
        tool_id = body.get("id")
        if not tool_id:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "ID обязателен"}}

        fields = []
        values = []
        for f in ["name", "slug", "description", "hints", "formula", "is_enabled"]:
            if f in body:
                fields.append(f"{f} = %s")
                values.append(body[f])

        if not fields:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Нет данных для обновления"}}

        fields.append("updated_at = NOW()")
        values.append(int(tool_id))
        cur.execute(f"UPDATE tools SET {', '.join(fields)} WHERE id = %s RETURNING *", values)
        tool = cur.fetchone()
        cur.close()
        conn.close()
        if not tool:
            return {"statusCode": 404, "headers": CORS_HEADERS, "body": {"error": "Инструмент не найден"}}
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"tool": dict(tool)})}

    if method == "DELETE":
        tool_id = params.get("id")
        if not tool_id:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "ID обязателен"}}
        cur.execute("DELETE FROM tools WHERE id = %s", (int(tool_id),))
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": {"success": True}}

    cur.close()
    conn.close()
    return {"statusCode": 405, "headers": CORS_HEADERS, "body": {"error": "Method not allowed"}}
