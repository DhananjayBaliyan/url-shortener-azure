from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import redis
import string
import random
import os

app = Flask(__name__)
CORS(app) 

redis_host = os.environ.get('REDIS_HOST', 'redis-service')
db = redis.StrictRedis(host=redis_host, port=6379, db=0, decode_responses=True)

def generate_short_code(length=6):
    """Generate a random short code."""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

@app.route('/api/shorten', methods=['POST'])
def shorten_url():
    """Create a new shortened URL."""
    long_url = request.json.get('long_url')
    if not long_url:
        return jsonify({'error': 'URL is required'}), 400

    while True:
        short_code = generate_short_code()
        if not db.exists(short_code):
            break
    
    db.set(short_code, long_url)
    return jsonify({'short_code': short_code})

# THIS IS THE CORRECTED FUNCTION
@app.route('/api/<short_code>')
def get_long_url(short_code):
    """Looks up the short code and returns the long URL as JSON."""
    long_url = db.get(short_code)
    if long_url:
        # Instead of redirecting, return the URL in a JSON object
        return jsonify({'long_url': long_url})
    else:
        return jsonify({'error': 'URL not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
