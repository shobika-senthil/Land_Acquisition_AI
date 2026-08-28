import pandas as pd
import sqlite3

from database import get_connection, create_tables


# ============================================================
# 1. CREATE DATABASE TABLES
# ============================================================

create_tables()


# ============================================================
# 2. LOAD PROJECT DATA
# ============================================================

projects = pd.read_excel(
    "land_acquisition_complete_dataset.xlsx",
    sheet_name="Project_Data"
)


# ============================================================
# 3. LOAD PARCEL DATA
# ============================================================

parcels = pd.read_excel(
    "parcel_risk_results.xlsx"
)


print("\n========================================")
print("IMPORTING DATA")
print("========================================")

print("\nProjects found:", len(projects))
print("Parcels found:", len(parcels))


# ============================================================
# 4. CONNECT TO DATABASE
# ============================================================

connection = get_connection()


# ============================================================
# 5. IMPORT PROJECTS
# ============================================================

projects.to_sql(
    "projects",
    connection,
    if_exists="append",
    index=False
)


print("\nProjects imported successfully.")


# ============================================================
# 6. IMPORT PARCELS
# ============================================================

parcels.to_sql(
    "parcels",
    connection,
    if_exists="append",
    index=False
)


print("Parcels imported successfully.")


# ============================================================
# 7. CHECK DATABASE
# ============================================================

cursor = connection.cursor()


cursor.execute(
    "SELECT COUNT(*) FROM projects"
)

project_count = cursor.fetchone()[0]


cursor.execute(
    "SELECT COUNT(*) FROM parcels"
)

parcel_count = cursor.fetchone()[0]


connection.close()


# ============================================================
# 8. FINAL RESULT
# ============================================================

print("\n========================================")
print("DATABASE IMPORT COMPLETED")
print("========================================")

print(
    "\nProjects in database:",
    project_count
)

print(
    "Parcels in database:",
    parcel_count
)