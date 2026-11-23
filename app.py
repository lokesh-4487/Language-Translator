import os

import requests
from flask import Flask, jsonify, render_template, request


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(
    __name__,
    template_folder=os.path.join(FRONTEND_DIR, "templates"),
    static_folder=os.path.join(FRONTEND_DIR, "static")
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()

    text = data.get("text", "").strip()
    source_language = data.get("source", "en")
    target_language = data.get("target", "hi")

    if not text:
        return jsonify({
            "error": "Please enter some text to translate."
        }), 400

    if source_language == target_language:
        return jsonify({"translation": text})

    try:
        url = "https://api.mymemory.translated.net/get"

        params = {
            "q": text,
            "langpair": f"{source_language}|{target_language}"
        }

        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()

        result = response.json()
        translated_text = result["responseData"]["translatedText"]

        return jsonify({"translation": translated_text})

    except requests.exceptions.RequestException:
        return jsonify({
            "error": "Unable to connect to the translation service. Please try again."
        }), 503

    except (KeyError, ValueError):
        return jsonify({
            "error": "The translation service returned an unexpected response."
        }), 502


if __name__ == "__main__":
    app.run(debug=True)