from dotenv import load_dotenv
load_dotenv()  # must run before tool imports so os.getenv() calls in tools resolve correctly

import json
import os
import datetime
from fastapi import FastAPI, Request, HTTPException
from tools.generate_response import generate_response
from tools.send_client_email import send_client_email
from tools.log_to_sheets import log_to_sheets
from tools.notify_team_email import notify_team_email

app = FastAPI()

WEBHOOK_SECRET = os.getenv("SUPABASE_WEBHOOK_SECRET")


@app.post("/webhook/supabase")
async def handle_webhook(request: Request):
    secret = request.headers.get("x-webhook-secret")
    if secret != WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    os.makedirs(".tmp", exist_ok=True)
    with open(".tmp/last_payload.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    if payload.get("type") != "INSERT":
        return {"status": "ignored"}

    record = payload.get("record", {})

    email_body = generate_response(record)
    send_client_email(record, email_body)
    log_to_sheets(record)
    notify_team_email(record)

    _log(f"Lead processado: {record.get('nome')} — {record.get('email')}")
    return {"status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.datetime.now().isoformat()}


def _log(msg: str):
    os.makedirs(".tmp", exist_ok=True)
    with open(".tmp/errors.log", "a", encoding="utf-8") as f:
        f.write(f"[{datetime.datetime.now()}] {msg}\n")
