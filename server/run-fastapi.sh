#!/bin/bash

# Install required packages if not already installed
pip3 install fastapi uvicorn pydantic google-generativeai

# Run the FastAPI server
python3 -m uvicorn fastapi_server:app --host 0.0.0.0 --port 5005 