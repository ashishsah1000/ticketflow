import csv
import os
import sqlite3

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'ecdataset.csv')
    db_path = os.path.join(os.path.dirname(script_dir), 'store.db')

    print(f"Reading CSV from: {csv_path}")
    print(f"Connecting to Database at: {db_path}")

    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return

    # Connect to SQLite
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create companies table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    ''''')
    conn.commit()

    # Clear existing companies to prevent duplication issues
    print("Clearing existing companies...")
    cursor.execute('DELETE FROM companies')
    conn.commit()

    # Extract unique companies from CSV
    print("Extracting company names from product_name.split(' ')[0]...")
    unique_companies = set()
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            product_name = row.get('product_name', '')
            if product_name:
                company_name = product_name.split(" ")[0]
                if company_name:
                    unique_companies.add(company_name)

    print(f"Found {len(unique_companies)} unique companies.")

    # Insert companies into the database
    inserted_companies = 0
    for company in sorted(unique_companies):
        try:
            cursor.execute('INSERT INTO companies (name) VALUES (?)', (company,))
            inserted_companies += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    print(f"Seeded {inserted_companies} companies.")

    # Map company names to their newly generated IDs
    cursor.execute('SELECT id, name FROM companies')
    company_map = {name: cid for cid, name in cursor.fetchall()}

    # Ensure companyId column exists in the products table
    cursor.execute("PRAGMA table_info(products)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'companyId' not in columns:
        print("Adding companyId column to products table...")
        cursor.execute("ALTER TABLE products ADD COLUMN companyId INTEGER REFERENCES companies(id) ON DELETE SET NULL")
        conn.commit()

    # Link products to companies
    print("Linking products to their respective company IDs...")
    cursor.execute('SELECT id, name FROM products')
    products = cursor.fetchall()

    updates = []
    for pid, pname in products:
        company_name = pname.split(" ")[0]
        company_id = company_map.get(company_name)
        if company_id is not None:
            updates.append((company_id, pid))

    # Perform updates in a batch
    if updates:
        cursor.executemany('UPDATE products SET companyId = ? WHERE id = ?', updates)
        conn.commit()
        print(f"Successfully linked {len(updates)} products to their companies.")
    else:
        print("No products found to link.")

    conn.close()
    print("Seeding and linking completed successfully!")

if __name__ == '__main__':
    main()
