import PyPDF2
# import docx  # python-docx
from fastapi import UploadFile
import io

async def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

# async def extract_text_from_docx(file_bytes: bytes) -> str:
#    doc = docx.Document(io.BytesIO(file_bytes))
#    full_text = []
#    for para in doc.paragraphs:
#        full_text.append(para.text)
#    return '\n'.join(full_text)

async def extract_text(file_path: str) -> str:
    """
    Extracts text from a local file path.
    """
    if file_path.endswith(".pdf"):
        with open(file_path, "rb") as f:
            return await extract_text_from_pdf(f.read())
    # elif file_path.endswith(".docx"):
         # Implement docx
    #    pass
    return ""
