import os
import shutil
import boto3
from fastapi import UploadFile
from botocore.exceptions import NoCredentialsError

class StorageService:
    def __init__(self):
        self.local_storage_path = "uploads"
        os.makedirs(self.local_storage_path, exist_ok=True)
        
        self.s3_bucket = os.getenv("S3_BUCKET_NAME")
        self.aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region = os.getenv("AWS_REGION", "us-east-1")
        
        self.s3_client = None
        if self.s3_bucket and self.aws_access_key:
            try:
                self.s3_client = boto3.client(
                    's3',
                    aws_access_key_id=self.aws_access_key,
                    aws_secret_access_key=self.aws_secret_key,
                    region_name=self.aws_region
                )
            except Exception as e:
                print(f"Failed to init S3: {e}")

    async def save_file(self, file: UploadFile, filename: str) -> str:
        # S3 Mode
        if self.s3_client:
            try:
                self.s3_client.upload_fileobj(
                    file.file,
                    self.s3_bucket,
                    filename,
                    ExtraArgs={"ContentType": file.content_type}
                )
                return f"s3://{self.s3_bucket}/{filename}"
            except Exception as e:
                print(f"S3 Upload Error: {e}")
                # Fallback to local? Or raise? For now raise or return None
                raise e

        # Local Mode
        full_path = os.path.join(self.local_storage_path, filename)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return full_path

    def get_file_url(self, file_path_or_key: str) -> str:
        if not file_path_or_key: return ""
        
        if file_path_or_key.startswith("s3://"):
            # Generate Presigned URL
            if not self.s3_client: return ""
            key = file_path_or_key.replace(f"s3://{self.s3_bucket}/", "")
            try:
                url = self.s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.s3_bucket, 'Key': key},
                    ExpiresIn=3600
                )
                return url
            except Exception as e:
                print(f"Presign Error: {e}")
                return ""
        
        # Local file
        # In prod, serve via Nginx or similar. For MVP/Local:
        # We can't easily generate a URL for local files without a static mount
        # Just return the path for internal use
        return file_path_or_key

storage = StorageService()
