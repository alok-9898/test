import uvicorn
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    try:
        with open("server_debug.log", "w") as f:
            f.write("Starting server... \n")
            f.flush()
        uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="debug")
    except Exception as e:
        with open("server_debug.log", "a") as f:
            f.write(f"CRITICAL ERROR: {str(e)}\n")
            import traceback
            f.write(traceback.format_exc())
            f.flush()
        print(f"Server crashed: {e}")
