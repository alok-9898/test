import asyncio
from sqlalchemy import text
from database import engine

async def cleanup():
    async with engine.connect() as conn:
        print("\nCleaning up duplicate embeddings...")
        
        # This query finds duplicates and keeps only the one with the highest ID (ostensibly the newest)
        query = """
        DELETE e1 FROM embeddings e1
        INNER JOIN embeddings e2 
        WHERE e1.id < e2.id 
        AND e1.user_id = e2.user_id 
        AND e1.text_source = e2.text_source;
        """
        try:
            result = await conn.execute(text(query))
            await conn.commit()
            print(f"  Done. Rows affected: {result.rowcount}")
        except Exception as e:
            print(f"  Error: {e}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(cleanup())
