# WMS AI Engine

This is the Python microservice for performing OCR on warehouse sheets. It uses FastAPI and HuggingFace Transformers (TrOCR).

## Setup

1.  **Install Python 3.9+**
2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *Note: This includes `torch`, `transformers`, `fastapi`, `uvicorn`, `opencv-python`, and `sentencepiece`.*

## Running the Server

To start the API server (available at `http://localhost:8000`):

```bash
python main.py
```

The server will reload automatically if you make code changes.

## Testing

There is a included script `test_request.py` formatted to send a request to the `/predict-table` endpoint.

1.  **Edit `test_request.py`** to point to your target image file.
2.  **Run the test**:
    ```bash
    python test_request.py
    ```

## Endpoints

-   `POST /predict`: Standard OCR for a single image, returns raw text.
-   `POST /predict-table`: Splits the image into a 7-column grid (Entrada, Salida, Ubicacion, etc.) and performs OCR on each cell. Returns a JSON list of rows.

## Custom Model

To use your own fine-tuned model:
1.  Train your TrOCR model.
2.  Save the weights as `custom_model.pt`.
3.  Update `inference.py` to load this path instead of downloading `microsoft/trocr-small-handwritten`.
