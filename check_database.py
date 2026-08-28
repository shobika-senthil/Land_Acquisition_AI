import sqlite3

DB_PATH = "data/land_acquisition.db"

connection = sqlite3.connect(DB_PATH)
cursor = connection.cursor()

print("\n========================================")
print("       DATABASE PROJECT CHECK")
print("========================================")

cursor.execute("""
    SELECT COUNT(*)
    FROM projects
""")

project_count = cursor.fetchone()[0]

print("\nTotal projects:", project_count)

cursor.execute("""
    SELECT project_id, project_type, state, district
    FROM projects
    ORDER BY CAST(SUBSTR(project_id, 2) AS INTEGER) DESC
    LIMIT 5
""")

print("\nLatest projects:")
print("----------------------------------------")

for row in cursor.fetchall():
    print(
        f"Project: {row[0]} | "
        f"Type: {row[1]} | "
        f"State: {row[2]} | "
        f"District: {row[3]}"
    )

connection.close()