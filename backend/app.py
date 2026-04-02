from flask import Flask, request, jsonify
from flask_cors import CORS
from scanner import scan_target
import logging
import os

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

@app.route('/scan', methods=['POST'])
def scan_endpoint():
    data = request.json
    target = data.get('target', '')
    if not target:
        return jsonify({"error": "No target provided"}), 400
    
    try:
        report = scan_target(target)
        return jsonify(report), 200
    except Exception as e:
        app.logger.error(f"Scan error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify({"history": []})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
