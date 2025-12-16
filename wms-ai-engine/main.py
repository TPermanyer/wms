from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from inference import engine
from table_extractor import extract_table_cells
from typing import List, Dict, Any
import uvicorn

app = FastAPI(title="WMS AI Engine", version="1.0.0")

class OcrResponse(BaseModel):
    text: str

class TableRow(BaseModel):
    entrada: str
    salida: str
    ubicacion: str
    referencia: str
    descripcion: str
    cantidad: str
    lote: str

@app.get("/")
def read_root():
    return {"status": "online", "service": "WMS AI Engine"}

@app.post("/predict", response_model=OcrResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    try:
        contents = await file.read()
        text = engine.predict(contents)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-table", response_model=List[TableRow])
async def predict_table(file: UploadFile = File(...)):
    """
    Extracts table from image and maps columns to:
    [Entrada, Salida, Ubicacion, Referencia, Descripcion, Cantidad, Lote]
    Assuming strict 7-column structure.
    """
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        print(f"DEBUG: Received file size: {len(contents)} bytes")
        rows_images = extract_table_cells(contents)
        
        results = []
        for row_imgs in rows_images:
            # We expect roughly 7 columns. 
            # If noise is detected, we might get more or fewer.
            # For this simplified version, we'll try to map the first 7 detected cells.
            
            # Skip header row if needed (heuristic: if 'ubicacion' is detected in text)
            # For now, just process everything.
            
            row_data = [""] * 7
            for i, cell_img in enumerate(row_imgs):
                if i >= 7: break
                text = engine.predict_from_array(cell_img)
                row_data[i] = text
            
            # Map to object
            # Columns: Entrada (0), Salida (1), Ubicacion (2), Referencia (3), Desc (4), Cant (5), Lote (6)
            table_row = TableRow(
                entrada=row_data[0],
                salida=row_data[1],
                ubicacion=row_data[2],
                referencia=row_data[3],
                descripcion=row_data[4],
                cantidad=row_data[5],
                lote=row_data[6]
            )
            results.append(table_row)
            
        return results

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
