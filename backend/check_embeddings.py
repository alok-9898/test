import asyncio
from sqlalchemy import text
from database import engine

async def check():
    async with engine.connect() as conn:
        print("\nColumns in embeddings:")
        try:
            result = await conn.execute(text("DESCRIBE embeddings"))
            for row in result.fetchall():
                print(f"  {row[0]} ({row[1]})")
        except Exception as e:
            print(f"  Error: {e}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check())
