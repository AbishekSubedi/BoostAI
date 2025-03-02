from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import re
import base64
from io import BytesIO
from google import genai
from huggingface_hub import InferenceClient
import os

# Initialize FastAPI
app = FastAPI()

# Load API keys from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDj1D5SIf4ujX-ENBt8wyIbeF4-99qna7c")
HF_API_KEY = os.getenv("HF_API_KEY", "YOUR_HUGGING_FACE_API_KEY_HERE")

# Initialize Google Gemini AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")  # Latest fast model

# Initialize Hugging Face API
hf_client = InferenceClient(api_key=HF_API_KEY)


# Define Pydantic model for ad request
class AdRequest(BaseModel):
    userId: str
    businessId: str
    description: str
    adPurpose: str
    targetAudience: str


# Function to generate ad options using Google Gemini AI
def generate_ad_options(description: str, ad_purpose: str, target_audience: str):
    prompt = f"""
    Create three distinct advertisement options for the following product or business.

    **Description:** {description} 
    **Advertisement Goals:** {ad_purpose} 
    **Target Audience:** {target_audience} 

    Each option must be structured as follows:

    ## Option 1: 
    Headline: [Provide a short, engaging headline] 
    Image: [Describe the ideal image for this ad] 

    ## Option 2: 
    Headline: [Provide a short, engaging headline] 
    Image: [Describe the ideal image for this ad] 

    ## Option 3: 
    Headline: [Provide a short, engaging headline] 
    Image: [Describe the ideal image for this ad] 
    """

    response = model.generate_content(prompt)
    response_text = response.text()

    # Extract options using regex
    options = re.split(r"## Option \d+:", response_text)
    options = [opt.strip() for opt in options if opt.strip()]

    return options


# Function to generate an image using Hugging Face API
def generate_image(image_description: str):
    try:
        image = hf_client.text_to_image(image_description, model="stabilityai/stable-diffusion-xl-base-1.0")

        # Convert image to Base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")

    except Exception as e:
        print(f"Error generating image: {e}")
        return None


# API Endpoint: Generate ad
@app.post("/generate-ad")
async def generate_ad(request: AdRequest):
    try:
        # Generate ad options
        ad_options = generate_ad_options(request.description, request.adPurpose, request.targetAudience)

        # Extract headline and image description
        options_data = []
        for opt in ad_options:
            lines = opt.split("\n")
            headline = lines[0].replace("Headline:", "").strip() if len(lines) > 0 else "Exciting Ad!"
            image_desc = lines[1].replace("Image:", "").strip() if len(lines) > 1 else "A professional product display."
            options_data.append({"headline": headline, "image": image_desc})

        # Select first valid option
        selected_option = next((opt for opt in options_data if opt["headline"] and opt["image"]), options_data[0])

        # Generate image using Hugging Face
        image_base64 = generate_image(selected_option["image"])

        response = {
            "options": options_data,
            "selectedOption": selected_option,
            "imageBase64": image_base64
        }

        return response

    except Exception as e:
        print(f"Error in generate_ad endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# API Endpoint: Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Ad Generation", "AI": "Google Gemini & Hugging Face"}


# Run the FastAPI server if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
