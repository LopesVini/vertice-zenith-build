import urllib.request
import json

url = "https://vertice-automation.onrender.com/process-quote"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "verticie2026-auto"
}
data = {
    "nome": "Teste",
    "email": "vinicilops@gmail.com",
    "celular": "3199999999",
    "cidade": "BH",
    "tipo": "Projeto",
    "mensagem": "Teste automation"
}

req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Response:", response.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Error Body:", e.read().decode("utf-8"))
except Exception as e:
    print("Error:", str(e))
