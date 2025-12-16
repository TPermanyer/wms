import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import io
import cv2

import traceback

class InferenceEngine:
    def __init__(self, model_path: str = None):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading model on {self.device}...")
        
        # Load pre-trained model from Hugging Face for now, or local path if provided
        # We use 'microsoft/trocr-small-handwritten' as a base/placeholder
        model_name = "microsoft/trocr-small-handwritten"
        
        try:
            self.processor = TrOCRProcessor.from_pretrained(model_name)
            self.model = VisionEncoderDecoderModel.from_pretrained(model_name).to(self.device)
            # If a local custom model path is provided and exists, load weights
            if model_path:
                print(f"Loading custom weights from {model_path}")
                self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        except Exception as e:
            print(f"Error loading model: {e}")
            traceback.print_exc()
            raise e

    def predict(self, image_bytes: bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return self._predict_pil(image)
        
    def predict_from_array(self, image_array):
        """Converts OpenCV (BGR) array to PIL (RGB) and predicts."""
        image = Image.fromarray(cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB))
        return self._predict_pil(image)

    def _predict_pil(self, image):
        pixel_values = self.processor(images=image, return_tensors="pt").pixel_values.to(self.device)
        generated_ids = self.model.generate(pixel_values)
        generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        return generated_text

# Singleton instance
engine = InferenceEngine()
