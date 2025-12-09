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
    from app.core.storage import storage
    import io

    # S3 Handling
    if file_path.startswith("s3://"):
        if not storage.s3_client:
            raise Exception("S3 Configured but Client failed")
        
        # Parse Bucket/Key
        path_parts = file_path.replace("s3://", "").split("/", 1)
        bucket = path_parts[0]
        key = path_parts[1]
        
        obj = storage.s3_client.get_object(Bucket=bucket, Key=key)
        file_content = obj['Body'].read()
        
        # Determine extension from key (or assume PDF for now)
        if key.endswith(".pdf"):
             # Call the async function synchronously since we are in sync or refactor
             # Actually extract_text_from_pdf is async, but we are calling it from here.
             # Ideally this function should be async.
             # For MVP hack, let's just make extract_text_from_pdf sync or run loop
             return await extract_text_from_pdf(file_content)
             
    # Local Handling
    if file_path.endswith(".pdf"):
        with open(file_path, "rb") as f:
            return await extract_text_from_pdf(f.read())
            
    return ""
