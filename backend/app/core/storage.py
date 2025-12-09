import boto3
import os
import shutil
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile

class StorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION", "us-east-1")
        )
        self.bucket_name = os.getenv("S3_BUCKET_NAME", "resume-platform-uploads")
        self.local_storage_path = "uploads"
        
        if not os.path.exists(self.local_storage_path):
            os.makedirs(self.local_storage_path)

    async def upload_file(self, file: UploadFile, filename: str) -> str:
        """
        Uploads file to S3 or Local Storage fallback.
        Returns the key/path.
        """
        if os.getenv("USE_S3", "false").lower() == "true":
            try:
                self.s3_client.upload_fileobj(file.file, self.bucket_name, filename)
                return f"s3://{self.bucket_name}/{filename}"
            except NoCredentialsError:
                print("AWS Credentials not found, falling back to local storage")
                # Fallback implementation below
        
        # Local Storage
        file_path = os.path.join(self.local_storage_path, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return file_path

storage = StorageService()
