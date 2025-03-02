from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import google.generativeai as genai
import json
import os
from datetime import datetime

# Initialize FastAPI
from fastapi import FastAPI
from pydantic import BaseModel
import re
import base64
from io import BytesIO
from google import genai
from huggingface_hub import InferenceClient


# Initialize FastAPI
app = FastAPI()


# Initialize Gemini AI client
client = genai.Client(api_key="AIzaSyBl9Mw4wHrhQE6obGw1rJ7_um7vkqdAnnI")


# Initialize Hugging Face API client
hf_client = InferenceClient(
   provider="hf-inference",
   api_key="hf_"  # Replace with your actual Hugging Face API key
)


# Request model for input
class AdRequest(BaseModel):
   ad_format: str  # "text", "image", or "video" (video not implemented)
   description: str
   advertisement_goals: str
   target_audience: str


# Function to extract headline and image
def extract_headline_and_image(option_text):
   """Extracts headline and image description from generated ad text."""
   # Split the text into sentences
   sentences = option_text.split("\n")
  
   # Extract headline (First sentence with more than 3 words)
   headline = sentences[0].strip()
  
   # Identify image description (Search for keywords or take the second sentence)
    image = None
   for sentence in sentences[1:]:
       if any(keyword in sentence.lower() for keyword in ["image:", "visual:", "picture:"]):
           image = sentence.split(":", 1)[-1].strip()  # Extract after "Image:"
           break
   if not image and len(sentences) > 1:
       image = sentences[1].strip()  # Default to second sentence if no explicit keyword found


   return {"headline": headline, "image": image}


# Function to generate ad options
def generate_ad_options(ad_format, description, advertisement_goals, target_audience):
   """Generates three advertisement options based on the given inputs."""


   prompt = f"""
   Create three distinct advertisement options for the following product or business.


   **Description:** {description} 
   **Advertisement Goals:** {advertisement_goals} 
   **Target Audience:** {target_audience} 


   Ensure the ads align with the given goals and target audience. 


   Each option must be structured as follows: 


   ## Option 1: 
   Headline: [Provide a short, engaging headline] 
   Image: [Describe the ideal image or visual representation] 


   ## Option 2: 
   Headline: [Provide a short, engaging headline] 
   Image: [Describe the ideal image or visual representation] 


   ## Option 3: 
   Headline: [Provide a short, engaging headline] 
    Image: [Describe the ideal image or visual representation] 
   """


   response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)


   # Extracting options using regex
   options = re.split(r'## Option \d+:', response.text)
   options = [opt.strip() for opt in options if opt.strip()]  # Remove empty spaces


   # Extract only headline & image
   extracted_options = [extract_headline_and_image(opt) for opt in options]


   return {"options": extracted_options}  # Return JSON with headlines & images


# Function to pick an option with a non-empty image & headline
def select_valid_option(options):
   """Selects the first option where both headline and image are not empty."""
   for option in options:
       if option["headline"] and option["image"]:  # Ensure both fields are filled
           return option
   return None


# Function to generate an image from text
def generate_image(prompt):
   """Generates an image from the given text prompt using Hugging Face."""
   image = hf_client.text_to_image(prompt, model="black-forest-labs/FLUX.1-dev")


   # Convert image to Base64 string
   buffered = BytesIO()
   image.save(buffered, format="PNG")
   return base64.b64encode(buffered.getvalue()).decode("utf-8")


# API Endpoint to generate ads
@app.post("/generate-ads")
def get_ad_options(request: AdRequest):
   # Generate ad options
   ad_options = generate_ad_options(
       request.ad_format, request.description, request.advertisement_goals, request.target_audience
   )


   # Select a valid ad option with a non-empty headline & image
   selected_option = select_valid_option(ad_options["options"])
   if not selected_option:
       return {"error": "No valid ad option found."}


   # Generate image based on the selected description
   image_base64 = generate_image(selected_option["image"])


   # Return the selected headline and image (Base64)
   return {
       "headline": selected_option["headline"],
       "image_base64": image_base64
   }






  



# API Endpoint to generate ads
@app.post("/generate-ads")
def get_ad_options(request: AdRequest):
   # Call function with frontend input
   ad_options = generate_ad_options(
       request.ad_format, request.description, request.advertisement_goals, request.target_audience
   )
   
   # Save the response to file
   save_response(
       "anonymous",  # Default user ID
       request.ad_format,
       request.description,
       request.advertisement_goals,
       request.target_audience,
       ad_options["options"]
   )
   
   return ad_options


# Ensure data directory exists
data_dir = os.path.join(os.path.dirname(__file__), "data", "fastapi-responses")
os.makedirs(data_dir, exist_ok=True)

# Save response to file
def save_response(user_id, ad_format, description, advertisement_goals, target_audience, options):
    file_path = os.path.join(data_dir, f"{user_id}.json")
    
    # Load existing responses if file exists
    responses = []
    if os.path.exists(file_path):
        try:
            with open(file_path, "r") as f:
                responses = json.load(f)
        except json.JSONDecodeError:
            # If file is corrupted, start with empty list
            responses = []
    
    # Add new response
    responses.append({
        "id": str(datetime.now().timestamp()),
        "timestamp": datetime.now().isoformat(),
        "ad_format": ad_format,
        "description": description,
        "advertisement_goals": advertisement_goals,
        "target_audience": target_audience,
        "options": options
    })
    
    # Save to file
    with open(file_path, "w") as f:
        json.dump(responses, f, indent=2)


@app.get("/api/ads/responses/{user_id}")
def get_responses(user_id: str):
    file_path = os.path.join(data_dir, f"{user_id}.json")
    
    if not os.path.exists(file_path):
        return {"success": True, "responses": []}
    
    try:
        with open(file_path, "r") as f:
            responses = json.load(f)
        return {"success": True, "responses": responses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting responses: {str(e)}")

# API endpoint to save responses
@app.post("/api/ads/responses/{user_id}")
def save_responses(user_id: str, responses: dict):
    file_path = os.path.join(data_dir, f"{user_id}.json")
    
    try:
        with open(file_path, "w") as f:
            json.dump(responses.get("responses", []), f, indent=2)
        return {"success": True, "message": "Responses saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving responses: {str(e)}")

# Run with: uvicorn fastapi_server:app --host 0.0.0.0 --port 5005
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5005)