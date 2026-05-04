import os
import json
import datetime
import gspread
from google.oauth2.service_account import Credentials
from tools.utils import log_error, SHEETS_SCOPES

SHEET_ID = os.getenv("GOOGLE_SHEET_ID", "").strip()

HEADERS = ["Data", "Nome", "E-mail", "WhatsApp", "Cidade", "Tipo", "Área", "Fase", "Mensagem"]


def _get_credentials() -> Credentials:
    """
    Suporta duas formas de autenticação:
    1. GOOGLE_CREDENTIALS_JSON — variável de ambiente com o JSON completo (produção/Render)
    2. GOOGLE_SHEETS_CREDENTIALS_PATH — caminho para o arquivo .json (dev local)
    """
    creds_json = os.getenv("GOOGLE_CREDENTIALS_JSON", "").strip()
    if creds_json:
        info = json.loads(creds_json)
        return Credentials.from_service_account_info(info, scopes=SHEETS_SCOPES)

    path = os.getenv("GOOGLE_SHEETS_CREDENTIALS_PATH", "./google-credentials.json")
    return Credentials.from_service_account_file(path, scopes=SHEETS_SCOPES)


def log_to_sheets(record: dict):
    try:
        creds = _get_credentials()
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
