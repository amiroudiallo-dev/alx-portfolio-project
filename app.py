#!/usr/bin/python3
# app.py

from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# API Key and base URL for OpenWeatherMap
API_KEY = '2efb1ed6682e4844926192513240709'  # Replace with the API Key
BASE_URL = 'https://app.swaggerhub.com/apis-docs/WeatherAPI.com/WeatherAPI/1.0.2#/APIs/'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400
    
    full_url = f"{BASE_URL}?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(full_url)
    
    if response.status_code == 200:
        data = response.json()
        weather_data = {
            'city': data['name'],
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'wind_speed': data['wind']['speed'],
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon']
        }
        return jsonify(weather_data)
    elif response.status_code == 404:
        return jsonify({'error': 'City not found'}), 404
    else:
        return jsonify({'error': 'Failed to retrieve data from API'}), 500

if __name__ == '__main__':
    app.run(debug=True)
