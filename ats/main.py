from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from helper_func import input_pdf_setup, get_gemini_response, get_gemini_response_keywords
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 Add this middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


input_prompt1 = """
You are an experienced Technical Human Resource Manager. Your task is to review the provided resume against the job description. 
Please share your professional evaluation on whether the candidate's profile aligns with the role. 
Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.
"""

input_prompt2 = """
As an expert ATS (Applicant Tracking System) scanner with an in-depth understanding of AI and ATS functionality, 
your task is to evaluate a resume against a provided job description. Please identify the specific skills and keywords 
necessary to maximize the impact of the resume and provide response in JSON format as 
{Technical Skills:[], Analytical Skills:[], Soft Skills:[]}.
Note: Please do not make up the answer only answer from job description provided.
"""

input_prompt3 = """
You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality. 
Your task is to evaluate the resume against the provided job description. Give me the percentage of match if the resume matches
the job description. Reply only and only with the percentage score of the resume and nothing else.
"""


@app.post("/analyze-resume")
async def analyze_resume(
    job_description: str = Form(...),
    file: UploadFile = File(...),
):
    content = await file.read()
    pdf_text = input_pdf_setup(content)
    response = get_gemini_response(input_prompt1, pdf_text, job_description)
    return JSONResponse(content={"result": response})


@app.post("/extract-keywords")
async def extract_keywords(
    job_description: str = Form(...),
    file: UploadFile = File(...),
):
    content = await file.read()
    pdf_text = input_pdf_setup(content)
    response = get_gemini_response_keywords(input_prompt2, pdf_text, job_description)

    if response:
        return {
            "Technical Skills": response.get("Technical Skills", []),
            "Analytical Skills": response.get("Analytical Skills", []),
            "Soft Skills": response.get("Soft Skills", []),
        }
    return {"error": "No keywords found or invalid response"}


@app.post("/percentage-match")
async def percentage_match(
    job_description: str = Form(...),
    file: UploadFile = File(...),
):
    content = await file.read()
    pdf_text = input_pdf_setup(content)
    response = get_gemini_response(input_prompt3, pdf_text, job_description)
    return JSONResponse(content={"result": response})

# follow this commands it will work
# ---------------------------------
# .\venv\Scripts\activate
# uvicorn main:app --reload