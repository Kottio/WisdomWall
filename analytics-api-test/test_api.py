# test_api.py
import requests
import json

# Load environment variables
API_URL = 'http://localhost:3000/api/events'
API_KEY = 'wqjhdfiou2weqwddjikshdoiu'

def test_api_connection():
    """Test basic API connectivity"""
    print("🧪 Testing API connection...")
    
    try:
        # Simple request to check if API is up
        response = requests.get(
            API_URL,
            headers={'x-api-key': API_KEY}, timeout=10
        )
        
        print(f"✅ Status Code: {response.status_code}")
        data = response.json()
        events = data.get('events', [])  # Fixed: 'events' not 'event'
        print(f"Events received: {json.dumps(events, indent=2)}")  # Fixed: added closing )
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_api_connection()
