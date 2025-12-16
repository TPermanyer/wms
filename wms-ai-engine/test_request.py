import requests
import json
import os

# Use the uploaded image path (or a placeholder if I can't access it easily, but I have the path from metadata)
# Image path: C:/Users/tperm/.gemini/antigravity/brain/8852329c-5c20-4bfe-9798-7b99252d7dd3/uploaded_image_1765578416651.png
image_path = "C:/Users/tperm/Desktop/WMS/test/test.png"

url = "http://localhost:8000/predict-table"

if not os.path.exists(image_path):
    print(f"Error: Image not found at {image_path}")
    exit(1)

files = {'file': open(image_path, 'rb')}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, files=files)
    
    if response.status_code == 200:
        print("Success! JSON Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except requests.exceptions.ConnectionError:
    print("Error: Could not connect to the server. Is it running?")
except Exception as e:
    print(f"An error occurred: {e}")
