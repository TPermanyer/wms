import cv2
import numpy as np

def sort_contours(cnts, method="left-to-right"):
    reverse = False
    i = 0
    if method == "right-to-left" or method == "bottom-to-top":
        reverse = True
    if method == "top-to-bottom" or method == "bottom-to-top":
        i = 1
    
    boundingBoxes = [cv2.boundingRect(c) for c in cnts]
    (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes),
                                        key=lambda b: b[1][i], reverse=reverse))
    return (cnts, boundingBoxes)

def extract_table_cells(image_bytes: bytes):
    """
    Detects table structure and returns a list of rows, 
    where each row is a list of cell images (bytes or numpy arrays).
    """
    # 1. Decode image
    nparr = np.frombuffer(image_bytes, np.uint8)
    print(f"DEBUG: nparr size: {nparr.size}")
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        print("DEBUG: cv2.imdecode returned None")
        raise ValueError("Could not decode image")
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 2. Thresholding
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 11, 2)
    
    # 3. Detect Horizontal Lines
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
    detect_horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)
    
    # 4. Detect Vertical Lines
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
    detect_vertical = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, vertical_kernel, iterations=2)
    
    # 5. Combine to get grid
    mask = detect_horizontal + detect_vertical
    
    # 6. Find Contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours that are likely cells (area > threshold)
    cell_contours = []
    min_area = 500
    for c in contours:
        area = cv2.contourArea(c)
        if area > min_area:
            cell_contours.append(c)
            
    if not cell_contours:
        return []

    # 7. Sort Cells
    # Sorting a grid is tricky. We typically sort top-to-bottom, then group by Y to find rows, then sort those by X.
    
    # First sort Top-to-Bottom
    (contours, boundingBoxes) = sort_contours(cell_contours, method="top-to-bottom")
    
    rows = []
    current_row = []
    last_y = boundingBoxes[0][1]
    last_h = boundingBoxes[0][3]
    row_threshold = last_h * 0.5 # Tolerance for row alignment
    
    for (c, bbox) in zip(contours, boundingBoxes):
        x, y, w, h = bbox
        
        # Check if this cell belongs to the current row (similar Y)
        if abs(y - last_y) < row_threshold:
            current_row.append((c, bbox))
        else:
            # Sort the completed row left-to-right
            if current_row:
                current_row.sort(key=lambda b: b[1][0]) # Sort by X
                rows.append([item[1] for item in current_row])
            
            # Start new row
            current_row = [(c, bbox)]
            last_y = y
            last_h = h
            
    # Append last row
    if current_row:
        current_row.sort(key=lambda b: b[1][0])
        rows.append([item[1] for item in current_row])
        
    # 8. Extract ROI for each cell
    extracted_rows = []
    for row_bboxes in rows:
        row_images = []
        for (x, y, w, h) in row_bboxes:
            # Crop with a small margin removal if needed
            crop = img[y+2:y+h-2, x+2:x+w-2]
            
            # Encode back to bytes or return array
            # For simplicity let's convert to formatted bytes directly for inference
            # But the inference engine might want PIL images. Let's return numpy arrays.
            row_images.append(crop)
        extracted_rows.append(row_images)
        
    return extracted_rows
