import csv
import os
import sqlite3

def clean_price(price_str):
    if not price_str:
        return 0.0
    # Strip "Rs", spaces, commas
    cleaned = ''.join(c for c in price_str if c.isdigit() or c == '.')
    try:
        return float(cleaned) if cleaned else 0.0
    except ValueError:
        return 0.0

def clean_ratings(ratings_str):
    if not ratings_str:
        return 0.0
    try:
        return float(ratings_str)
    except ValueError:
        return 0.0

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'ecdataset.csv')
    # store.db is at the backend root (parent of seed dir)
    db_path = os.path.join(os.path.dirname(script_dir), 'store.db')

    print(f"Reading CSV from: {csv_path}")
    print(f"Connecting to Database at: {db_path}")

    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return

    # Connect to SQLite
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create table if not exists (matching TypeORM structure)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL,
            priceOriginal TEXT,
            image TEXT,
            link TEXT,
            store TEXT,
            category TEXT,
            ratings REAL,
            ratingCount TEXT,
            description TEXT,
            date TEXT
        )
    ''')
    conn.commit()

    # Clear existing products to avoid duplicates when seeding
    print("Clearing existing products...")
    cursor.execute('DELETE FROM products')
    conn.commit()

    inserted_count = 0
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        # Batch insert for performance
        batch = []
        batch_size = 100
        
        for row in reader:
            name = row.get('product_name', '')
            if not name:
                continue
                
            raw_price = row.get('product_price', '')
            price = clean_price(raw_price)
            image = row.get('product_image', '')
            link = row.get('product_link', '')
            store = row.get('product_store', '')
            category = row.get('product_category', '')
            ratings = clean_ratings(row.get('product_ratings', ''))
            rating_count = row.get('rating_count', '')
            description = row.get('description', '')
            date = row.get('date', '')

            batch.append((
                name,
                price,
                raw_price,  # priceOriginal
                image,
                link,
                store,
                category,
                ratings,
                rating_count,
                description,
                date
            ))

            if len(batch) >= batch_size:
                cursor.executemany('''
                    INSERT INTO products (
                        name, price, priceOriginal, image, link, store,
                        category, ratings, ratingCount, description, date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', batch)
                inserted_count += len(batch)
                batch = []

        # Insert remaining
        if batch:
            cursor.executemany('''
                INSERT INTO products (
                    name, price, priceOriginal, image, link, store,
                    category, ratings, ratingCount, description, date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', batch)
            inserted_count += len(batch)

    conn.commit()
    conn.close()
    print(f"Seeding completed successfully! Inserted {inserted_count} products.")

if __name__ == '__main__':
    main()
