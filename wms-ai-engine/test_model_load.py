from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import traceback
import torch

try:
    print("Loading processor...")
    processor = TrOCRProcessor.from_pretrained("microsoft/trocr-small-handwritten")
    print("Loading model...")
    model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-small-handwritten")
    print("Success!")
except Exception:
    traceback.print_exc()
