from flask import Flask, render_template, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/weather": {"origins": "*"}})

# API Key for WeatherAPI
API_KEY = '684c1d19b6914a02ab9172825242409' 
BASE_URL = 'https://api.weatherapi.com/v1/forecast.json'

@app.route('/')
def index():
    return render_template('index.html')

# Route principale pour récupérer la météo par nom de ville
@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    days = request.args.get('days', 5)  
    aqi = request.args.get('aqi', 'no')
    alerts = request.args.get('alerts', 'no')

    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    # Requête API WeatherAPI pour obtenir la météo
    weather_url = f"{BASE_URL}?key={API_KEY}&q={city}&days={days}&aqi={aqi}&alerts={alerts}"
    weather_response = requests.get(weather_url)

    if weather_response.status_code == 200:
        weather_data = weather_response.json()
        return jsonify(weather_data)
    else:
        return jsonify({'error': 'Failed to retrieve weather data'}), weather_response.status_code

if __name__ == '__main__':
    app.run(debug=True)
