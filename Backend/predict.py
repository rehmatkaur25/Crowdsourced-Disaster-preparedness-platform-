import joblib
import os

# Get the path to the current directory
base_path = os.path.dirname(os.path.abspath(__file__))

try:
    # Adjusting the path to your new folder
    flood_model = joblib.load(os.path.join(base_path, 'ai_models', 'flood_model_final.pkl'))
    eq_model = joblib.load(os.path.join(base_path, 'ai_models', 'earthquake_model_final.pkl'))
    print("✅ AI Models loaded successfully in VS Code!")
except Exception as e:
    print(f"❌ Error loading models: {e}")