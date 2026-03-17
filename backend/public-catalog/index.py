import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = "t_p44929272_masso_website_develo"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"], options=f"-c search_path={SCHEMA}")
    conn.autocommit = True
    return conn, conn.cursor(cursor_factory=RealDictCursor)


def handler(event: dict, context) -> dict:
    """Публичный каталог: последние 3 салона и поиск по названию/городу."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}
    query = (params.get("q") or "").strip()

    conn, cur = get_conn()

    if query:
        like = f"%{query}%"
        cur.execute(
            """
            SELECT id, name, city, techniques, rating, is_published, website, created_at
            FROM salons
            WHERE (name ILIKE %s OR city ILIKE %s)
            ORDER BY created_at DESC
            LIMIT 20
            """,
            (like, like),
        )
    else:
        cur.execute(
            """
            SELECT id, name, city, techniques, rating, is_published, website, created_at
            FROM salons
            ORDER BY created_at DESC
            LIMIT 3
            """
        )

    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        if r.get("created_at"):
            r["created_at"] = r["created_at"].isoformat()
        if r.get("rating") is not None:
            r["rating"] = float(r["rating"])

    conn.close()

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"salons": rows, "query": query}, ensure_ascii=False),
    }