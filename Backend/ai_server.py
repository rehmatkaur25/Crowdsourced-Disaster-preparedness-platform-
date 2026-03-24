import os
import requests
import numpy as np
import joblib
from flask import Flask, request, jsonify

app = Flask(__name__)

# --- SETUP ---
# 🛑 PASTE YOUR OPENWEATHERMAP API KEY HERE
WEATHER_API_KEY = "7309e32cfd5f9a1dc4e22ebdbccdf1e6"
NODE_BACKEND_URL = "http://localhost:3000/api/alerts/receive-ai"

# --- LOAD MODELS ---
base_path = os.path.dirname(os.path.abspath(__file__))
flood_model = joblib.load(os.path.join(base_path, 'ai_models', 'flood_model_final.pkl'))
eq_model = joblib.load(os.path.join(base_path, 'ai_models', 'earthquake_model_final.pkl'))

def get_real_time_features(lat, lon):
    """Fetches live weather and maps it to your 20 model features."""
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    try:
        res = requests.get(url)
        data = res.json()

        # Handle API errors (like if the key isn't active yet)
        if res.status_code != 200:
            print(f"⚠️ API Error: {data.get('message')}")
            return np.array([5.0] * 20).reshape(1, -1)
        
        # Extract live rainfall in the last hour (defaults to 0 if no rain)
        rainfall = data.get('rain', {}).get('1h', 0)
        
        # Map rainfall to 'MonsoonIntensity' (your first feature)
        monsoon_intensity = min(rainfall * 2, 20) 
        
        print(f"🌦️ Live Weather for [{lat}, {lon}]: Rainfall = {rainfall}mm")
        
        # Create the 20-feature array. Index 0 is live rainfall, rest are neutral defaults (5.0)
        features = [monsoon_intensity] + [5.0] * 19
        return np.array(features).reshape(1, -1)
        
    except Exception as e:
        print(f"⚠️ Error fetching live weather: {e}")
        return np.array([5.0] * 20).reshape(1, -1)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    lat = data.get('lat')
    lon = data.get('lon')

    print(f"\n📍 Received coordinates: {lat}, {lon}")

    # 1. Fetch live data & predict
    features = get_real_time_features(lat, lon)
    f_prob = float(flood_model.predict(features)[0])
    e_risk = int(eq_model.predict([[lat, lon, 10]])[0])

    print(f"📊 AI Calculated -> Flood Prob: {f_prob*100:.1f}%, EQ Risk: {e_risk}")

    # 2. Check if Risk is HIGH (Threshold > 0.7)
    if f_prob > 0.7 or e_risk == 1:
        disaster_type = "flood" if f_prob > 0.7 else "earthquake"
        
        alert_payload = {
            "disaster_type": disaster_type,
            "risk_level": "HIGH",
            "latitude": lat,
            "longitude": lon,
            "confidence": round(f_prob if disaster_type == "flood" else 0.84, 2),
            "message": f"High {disaster_type} risk detected based on live environmental data."
        }
        
        # 3. Send to Node.js Backend
        try:
            requests.post(NODE_BACKEND_URL, json=alert_payload)
            print("✅ [SUCCESS] Sent HIGH RISK alert to Node.js backend!")
        except requests.exceptions.ConnectionError:
            print("❌ [ERROR] Could not connect to Node.js. Make sure index.js is running on port 3000!")

        return jsonify({"status": "ALERT_GENERATED", "payload": alert_payload})

    return jsonify({"status": "SAFE", "probability": f_prob})

if __name__ == '__main__':
    print("🤖 AI Server is starting on port 5001...")
    app.run(port=5001)