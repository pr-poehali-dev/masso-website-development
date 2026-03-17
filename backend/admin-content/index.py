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
    """CRUD для управления контентом (статьи, посты блога)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    conn, cur = get_conn()

    if method == "GET":
        post_id = params.get("id")
        if post_id:
            cur.execute("""
                SELECT cp.*, au.name AS author_name
                FROM content_posts cp
                LEFT JOIN admin_users au ON au.id = cp.author_id
                WHERE cp.id = %s
            """, (int(post_id),))
            post = cur.fetchone()
            cur.close()
            conn.close()
            if not post:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": {"error": "Пост не найден"}}
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"post": dict(post)})}

        page = int(params.get("page", 1))
        per_page = int(params.get("per_page", 20))
        offset = (page - 1) * per_page
        status = params.get("status")
        search = params.get("search", "").strip()

        where = []
        vals = []
        if status:
            where.append("cp.status = %s")
            vals.append(status)
        if search:
            where.append("(cp.title ILIKE %s OR cp.body ILIKE %s)")
            vals.extend([f"%{search}%", f"%{search}%"])

        where_sql = "WHERE " + " AND ".join(where) if where else ""

        cur.execute(f"SELECT COUNT(*) AS cnt FROM content_posts cp {where_sql}", vals)
        total = cur.fetchone()["cnt"]

        cur.execute(f"""
            SELECT cp.id, cp.title, cp.category, cp.status, cp.is_pinned,
                   cp.created_at, cp.updated_at, au.name AS author_name
            FROM content_posts cp
            LEFT JOIN admin_users au ON au.id = cp.author_id
            {where_sql}
            ORDER BY cp.is_pinned DESC, cp.created_at DESC
            LIMIT %s OFFSET %s
        """, vals + [per_page, offset])
        posts = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({
            "posts": posts, "total": total, "page": page, "per_page": per_page
        })}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        title = body.get("title", "").strip()
        text = body.get("body", "").strip()
        category = body.get("category", "").strip()
        status = body.get("status", "draft")
        is_pinned = body.get("is_pinned", False)
        author_id = body.get("author_id")

        if not title:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Заголовок обязателен"}}

        cur.execute(
            """INSERT INTO content_posts (title, body, category, status, is_pinned, author_id)
               VALUES (%s, %s, %s, %s, %s, %s) RETURNING *""",
            (title, text or None, category or None, status, is_pinned, author_id),
        )
        post = dict(cur.fetchone())
        cur.close()
        conn.close()
        return {"statusCode": 201, "headers": CORS_HEADERS, "body": serialize({"post": post})}

    if method == "PUT":
        body = json.loads(event.get("body") or "{}")
        post_id = body.get("id")
        if not post_id:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "ID обязателен"}}

        fields = []
        values = []
        for f in ["title", "body", "category", "status", "is_pinned"]:
            if f in body:
                fields.append(f"{f} = %s")
                values.append(body[f])

        if not fields:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "Нет данных"}}

        fields.append("updated_at = NOW()")
        values.append(int(post_id))
        cur.execute(f"UPDATE content_posts SET {', '.join(fields)} WHERE id = %s RETURNING *", values)
        post = cur.fetchone()
        cur.close()
        conn.close()
        if not post:
            return {"statusCode": 404, "headers": CORS_HEADERS, "body": {"error": "Пост не найден"}}
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": serialize({"post": dict(post)})}

    if method == "DELETE":
        post_id = params.get("id")
        if not post_id:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": {"error": "ID обязателен"}}
        cur.execute("DELETE FROM content_posts WHERE id = %s", (int(post_id),))
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": {"success": True}}

    cur.close()
    conn.close()
    return {"statusCode": 405, "headers": CORS_HEADERS, "body": {"error": "Method not allowed"}}
