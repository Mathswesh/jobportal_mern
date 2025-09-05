# importing libraries
import google.generativeai as genai
import pdf2image
import os
import io
import json
from dotenv import load_dotenv
import base64

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("your_api_key"))

# Generate Gemini response for general evaluation or percentage match
def get_gemini_response(input_prompt, pdf_content, job_description):
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content([input_prompt, pdf_content[0], job_description])
    return response.text

# Generate Gemini response and extract keyword skills in JSON
def get_gemini_response_keywords(input_prompt, pdf_content, job_description):
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content([input_prompt, pdf_content[0], job_description])
    
    try:
        parsed_response = json.loads(response.text)
        return parsed_response
    except json.JSONDecodeError:
        # Optional: fallback parsing logic if response contains markdown or code formatting
        try:
            cleaned = response.text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned)
        except Exception as e:
            return {"error": f"Failed to parse response: {str(e)}"}

# Convert uploaded PDF bytes to base64-encoded image parts for Gemini input
def input_pdf_setup(file_bytes):
    if file_bytes:
        # Convert PDF bytes to images (one image per page)
        images = pdf2image.convert_from_bytes(file_bytes)

        # Take first page only (as your original logic)
        first_page = images[0]

        # Convert image to bytes
        img_byte_arr = io.BytesIO()
        first_page.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()

        # Prepare as Gemini-compatible input
        pdf_parts = [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()
            }
        ]
        return pdf_parts
    else:
        raise FileNotFoundError("No file data provided")


# # importing libraries
# import google.generativeai as genai
# import pdf2image
# import os
# import io
# import json
# from dotenv import load_dotenv

# load_dotenv()
# import base64

# genai.configure(api_key=os.getenv("your_api_key"))

# def get_gemini_response(input,pdf_content,prompt):
#     model=genai.GenerativeModel('gemini-1.5-flash')
#     response=model.generate_content([input,pdf_content[0],prompt])
#     return response.text

# def get_gemini_response_keywords(input,pdf_content,prompt):
#     model=genai.GenerativeModel('gemini-1.5-flash')
#     response=model.generate_content([input,pdf_content[0],prompt])
#     return json.loads(response.text[8:-4])

# def input_pdf_setup(uploaded_file):
#     if uploaded_file is not None:
#         ## Convert the PDF to image
#         images=pdf2image.convert_from_bytes(uploaded_file.read())

#         first_page=images[0]

#         # Convert to bytes
#         img_byte_arr = io.BytesIO()
#         first_page.save(img_byte_arr, format='JPEG')
#         img_byte_arr = img_byte_arr.getvalue()

#         pdf_parts = [
#             {
#                 "mime_type": "image/jpeg",
#                 "data": base64.b64encode(img_byte_arr).decode()  # encode to base64
#             }
#         ]
#         return pdf_parts
#     else:
#         raise FileNotFoundError("No file uploaded")
