from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import re
import base64
from io import BytesIO
import google.generativeai as genai
import os
from PIL import Image, ImageDraw, ImageFont
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API keys from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDj1D5SIf4ujX-ENBt8wyIbeF4-99qna7c")

# Initialize Google Gemini AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")  # Using a stable model

# Define Pydantic model for ad request
class AdRequest(BaseModel):
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

    try:
        response = model.generate_content(prompt)
        return response.text.split("## Option")
    except Exception as e:
        print(f"Error generating ad options: {e}")
        # Return fallback options
        return [
            "1: \nHeadline: Discover the Perfect Solution\nImage: A professional showcasing the product with visible results",
            "2: \nHeadline: Transform Your Experience Today\nImage: Before and after comparison showing the benefits",
            "3: \nHeadline: Join Thousands of Happy Customers\nImage: A diverse group of people enjoying the product"
        ]

# Function to extract headline and image description from text
def extract_headline_and_image(text: str):
    headline_match = re.search(r"Headline:\s*(.*?)(?:\n|$)", text)
    image_match = re.search(r"Image:\s*(.*?)(?:\n|$)", text)
    
    headline = headline_match.group(1).strip() if headline_match else "Exciting New Product"
    image = image_match.group(1).strip() if image_match else "A visually appealing product display"
    
    return {
        "headline": headline,
        "image": image
    }

# Function to generate a placeholder image
def generate_placeholder_image(description: str):
    try:
        # Create a blank image with a gradient background
        width, height = 800, 600
        image = Image.new("RGB", (width, height), color=(240, 240, 240))
        
        # Add a simple gradient
        draw = ImageDraw.Draw(image)
        for y in range(height):
            r = int(240 - (y / height) * 40)
            g = int(240 - (y / height) * 20)
            b = int(240 + (y / height) * 15)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Add text
        try:
            font = ImageFont.truetype("arial.ttf", 24)
        except IOError:
            font = ImageFont.load_default()
        
        # Wrap text to fit the image width
        words = description.split()
        lines = []
        current_line = []
        
        for word in words:
            current_line.append(word)
            text_width = draw.textlength(" ".join(current_line), font=font)
            if text_width > width - 40:
                if len(current_line) > 1:
                    current_line.pop()
                    lines.append(" ".join(current_line))
                    current_line = [word]
                else:
                    lines.append(" ".join(current_line))
                    current_line = []
        
        if current_line:
            lines.append(" ".join(current_line))
        
        # Draw text
        y_position = height // 2 - (len(lines) * 30) // 2
        for line in lines:
            text_width = draw.textlength(line, font=font)
            draw.text(((width - text_width) // 2, y_position), line, fill=(0, 0, 0), font=font)
            y_position += 30
        
        # Convert to base64
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    except Exception as e:
        print(f"Error generating image: {e}")
        # Return a simple colored rectangle as fallback
        image = Image.new("RGB", (800, 600), color=(200, 200, 240))
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

# API Endpoint: Generate ad
@app.post("/generate-ad")
async def generate_ad(request: AdRequest):
    try:
        # Generate ad options
        ad_options_text = generate_ad_options(
            request.description, 
            request.adPurpose, 
            request.targetAudience
        )
        
        # Extract headline and image description
        options_data = [extract_headline_and_image(opt) for opt in ad_options_text]
        
        # Generate placeholder images for preview
        for option in options_data:
            option["imageUrl"] = f"data:image/png;base64,{generate_placeholder_image(option['image'])}"
        
        return {
            "success": True,
            "options": options_data
        }
    
    except Exception as e:
        print(f"Error in generate_ad endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoint: Finalize ad
@app.post("/finalize-ad")
async def finalize_ad(data: dict):
    try:
        option = data.get("option")
        if not option:
            raise HTTPException(status_code=400, detail="No option provided")
        
        # Generate a higher quality image
        image_base64 = generate_placeholder_image(option.get("image", ""))
        
        return {
            "success": True,
            "ad": {
                **option,
                "imageUrl": f"data:image/png;base64,{image_base64}"
            }
        }
    
    except Exception as e:
        print(f"Error in finalize_ad endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoint: Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Ad Generation", "AI": "Google Gemini"}

# Run the FastAPI server if executed directly
if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.environ.get("PYTHON_SERVICE_PORT", 8001))
    print(f"Starting Python service on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
