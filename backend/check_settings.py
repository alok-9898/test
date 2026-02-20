from config import settings
import os

print(f"USE_MOCK_DATA: {settings.USE_MOCK_DATA}")
print(f"SECRET_KEY: {settings.SECRET_KEY[:5]}...")
print(f"ALGORITHM: {settings.ALGORITHM}")
print(f"DATABASE_URL: {settings.DATABASE_URL}")
print(f"ENV SECRET_KEY: {os.getenv('SECRET_KEY', 'NOT SET')[:5]}...")
