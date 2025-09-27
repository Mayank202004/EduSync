from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from pdf2image import convert_from_path
import easyocr
import re
import tempfile
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://10.56.247.63:5173"}})
reader = easyocr.Reader(['en'])

# ----------------------
# Utility: crop & warp
# ----------------------
def crop_document_debug(img, gray):
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    edges = cv2.Canny(blur, 75, 200)
    kernel = np.ones((5,5), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return img

    cnt = max(contours, key=cv2.contourArea)
    peri = cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)

    if len(approx) == 4:
        pts = approx.reshape(4, 2)
    else:
        rect = cv2.minAreaRect(cnt)
        box = cv2.boxPoints(rect)
        pts = box.astype(int)

    def order_points(pts):
        rect = np.zeros((4, 2), dtype="float32")
        s = pts.sum(axis=1)
        rect[0] = pts[np.argmin(s)]
        rect[2] = pts[np.argmax(s)]
        diff = np.diff(pts, axis=1)
        rect[1] = pts[np.argmin(diff)]
        rect[3] = pts[np.argmax(diff)]
        return rect

    rect = order_points(pts)
    (tl, tr, br, bl) = rect
    width = int(max(np.linalg.norm(br - bl), np.linalg.norm(tr - tl)))
    height = int(max(np.linalg.norm(tr - br), np.linalg.norm(tl - bl)))

    dst = np.array([[0,0],[width-1,0],[width-1,height-1],[0,height-1]], dtype="float32")
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(img, M, (width, height))

    return warped

# ----------------------
# PDF → stitched image
# ----------------------
def pdf_to_cropped_pages(pdf_path, dpi=200):
    pages = convert_from_path(pdf_path, dpi=dpi)
    cropped_pages = []
    for page in pages:
        img = np.array(page)
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        warped = crop_document_debug(img, gray)
        cropped_pages.append(warped)
    return cropped_pages

def stitch_cropped_pages(cropped_pages):
    widths = [p.shape[1] for p in cropped_pages]
    max_w = max(widths)
    resized = []
    for p in cropped_pages:
        new_h = int(p.shape[0] * max_w / p.shape[1])
        resized_page = cv2.resize(p, (max_w, new_h))
        resized.append(resized_page)
    stitched = np.vstack(resized)
    return stitched

# ----------------------
# OCR + Regex extraction (Improved)
# ----------------------
def extract_data_from_img(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    results = reader.readtext(thresh)
    
    extracted_data = []
    student_id = full_name = marks = None

    # Regex patterns
    student_id_pattern = re.compile(r'^[A-Za-z0-9]{10,}$')   # IDs like 68c46251338e13d53c797d6a
    full_name_pattern = re.compile(r'^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$')  # Proper names (2–4 words)
    marks_pattern = re.compile(r'^\d{1,3}$')  # Marks 1–3 digits

    # Ignore headers or noise
    ignore_words = {
        "student", "id", "student id", "full name", "marks",
        "marks obtained", "class", "sheet", "obtained", "name", "1-a", "1a"
    }

    for bbox, text, prob in results:
        text_clean = text.strip().lower()
        if text_clean in ignore_words:
            continue

        # Match patterns
        if student_id is None and student_id_pattern.match(text):
            student_id = text
            continue
        elif full_name is None and full_name_pattern.match(text):
            full_name = text
            continue
        elif marks is None and marks_pattern.match(text):
            marks = text

        # Once all three are found, store and reset
        if student_id and full_name and marks:
            extracted_data.append({
                "_id": student_id,
                "fullName": full_name,
                "marks": marks
            })
            student_id = full_name = marks = None

    return extracted_data

# ----------------------
# Flask route
# ----------------------
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    tmp_path = os.path.join(tempfile.gettempdir(), file.filename)
    file.save(tmp_path)

    try:
        if file.filename.lower().endswith('.pdf'):
            cropped_pages = pdf_to_cropped_pages(tmp_path)
            stitched_img = stitch_cropped_pages(cropped_pages)
            data = extract_data_from_img(stitched_img)
        else:
            img = cv2.imread(tmp_path)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            warped = crop_document_debug(img, gray)
            data = extract_data_from_img(warped)
    finally:
        os.remove(tmp_path)

    return jsonify(data)

# ----------------------
# Run server
# ----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
