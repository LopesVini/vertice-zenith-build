import os
import datetime
import gspread
from google.oauth2.service_account import Credentials
from tools.utils import log_error, SHEETS_SCOPES

CREDENTIALS_PATH = os.getenv("GOOGLE_SHEETS_CREDENTIALS_PATH", "./google-credentials.json")
SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

HEADERS = ["Data", "Nome", "E-mail", "WhatsApp", "Cidade", "Tipo", "Área", "Fase", "Mensagem"]


def log_to_sheets(record: dict):
    try:
        creds = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=SHEETS_SCOPES)
        client = gspread.authorize(creds)
        sheet = client.open_by_key(SHEET_ID).sheet1

        if sheet.cell(1, 1).value != "Data":
            sheet.insert_row(HEADERS, index=1)

        sheet.append_row([
            datetime.datetime.now().strftime("%d/%m/%Y %H:%M"),
            record.get("nome", ""),
            record.get("email", ""),
            record.get("celular", ""),
            record.get("cidade", ""),
            record.get("tipo", ""),
            record.get("area", ""),
            record.get("fase", ""),
            record.get("mensagem", ""),
        ])
    except Exception as e:
        log_error(f"log_to_sheets falhou: {e}")
