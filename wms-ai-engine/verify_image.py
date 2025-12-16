import cv2
import numpy as np
import os

image_path = "C:/Users/tperm/.gemini/antigravity/brain/8852329c-5c20-4bfe-9798-7b99252d7dd3/uploaded_image_1765578416651.png"

if not os.path.exists(image_path):
    print("File does not exist")
    exit(1)

print(f"File size: {os.path.getsize(image_path)} bytes")

# Test 1: Read as bytes and decode (matching server logic)
with open(image_path, "rb") as f:
    data = f.read()

nparr = np.frombuffer(data, np.uint8)
img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

if img is None:
    print("FAIL: cv2.imdecode returned None")
else:
    print(f"SUCCESS: cv2.imdecode shape: {img.shape}")

# Test 2: Read directly
img2 = cv2.imread(image_path)
if img2 is None:
    print("FAIL: cv2.imread returned None")
else:
    print(f"SUCCESS: cv2.imread shape: {img2.shape}")
