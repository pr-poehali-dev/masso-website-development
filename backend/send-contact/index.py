import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с контактной формы на почту massopro@mail.ru"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    contact = body.get("contact", "").strip()
    message = body.get("message", "").strip()

    if not name or not contact:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": {"error": "Имя и контакт обязательны"},
        }

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    sender = "massopro@mail.ru"
    recipient = "massopro@mail.ru"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая заявка с сайта МассоПРО от {name}"
    msg["From"] = sender
    msg["To"] = recipient

    html = f"""
    <h2>Новая заявка с сайта МассоПРО</h2>
    <p><b>Имя:</b> {name}</p>
    <p><b>Контакт:</b> {contact}</p>
    <p><b>Сообщение:</b> {message or '—'}</p>
    """
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        "statusCode": 200,
        "headers": headers,
        "body": {"ok": True},
    }