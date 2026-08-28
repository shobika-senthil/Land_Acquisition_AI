import sqlite3
import os


# ============================================================
# DATABASE LOCATION
# ============================================================

DATABASE_FOLDER = "data"
DATABASE_FILE = os.path.join(
    DATABASE_FOLDER,
    "land_acquisition.db"
)


# Create data folder if it doesn't exist
os.makedirs(DATABASE_FOLDER, exist_ok=True)


# ============================================================
# CONNECT TO DATABASE
# ============================================================

def get_connection():

    return sqlite3.connect(DATABASE_FILE)


# ============================================================
# CREATE TABLES
# ============================================================

def create_tables():

    connection = get_connection()

    cursor = connection.cursor()


    # --------------------------------------------------------
    # PROJECT TABLE
    # --------------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (

            project_id TEXT PRIMARY KEY,

            project_type TEXT,

            state TEXT,

            district TEXT,

            land_area_hectares REAL,

            total_parcels INTEGER,

            affected_families INTEGER,

            required_approvals INTEGER,

            completed_approvals INTEGER,

            pending_approvals INTEGER,

            approval_delay_days INTEGER,

            legal_disputes INTEGER,

            ownership_conflicts INTEGER,

            total_compensation_cases INTEGER,

            compensation_paid_cases INTEGER,

            compensation_completion_percent REAL,

            compensation_delay_days INTEGER,

            documents_required INTEGER,

            documents_completed INTEGER,

            documentation_completion_percent REAL,

            families_requiring_rr INTEGER,

            families_rehabilitated INTEGER,

            rr_completion_percent REAL,

            parcels_required INTEGER,

            parcels_possessed INTEGER,

            possession_percent REAL,

            stakeholder_response_rate REAL,

            current_stage TEXT,

            planned_duration_days INTEGER,

            elapsed_days INTEGER,
            
            delayed INTEGER,

            actual_delay_days INTEGER,

            primary_delay_reason TEXT
        )
    """)


    # --------------------------------------------------------
    # PARCEL TABLE
    # --------------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parcels (

            plot_id TEXT PRIMARY KEY,

            project_id TEXT,

            survey_number TEXT,

            land_area_hectares REAL,

            owner_count INTEGER,

            ownership_conflict INTEGER,

            legal_dispute INTEGER,

            compensation_completion_percent REAL,

            documentation_completion_percent REAL,

            rr_required INTEGER,

            rr_completion_percent REAL,

            possession_percent REAL,

            stakeholder_response_rate REAL,

            parcel_risk_score REAL,

            parcel_risk_level TEXT,

            FOREIGN KEY(project_id)
                REFERENCES projects(project_id)
        )
    """)


    connection.commit()

    connection.close()


# ============================================================
# INITIALIZE DATABASE
# ============================================================

if __name__ == "__main__":

    create_tables()

    print("\n========================================")
    print("DATABASE CREATED SUCCESSFULLY")
    print("========================================")

    print(
        "\nDatabase location:"
    )

    print(
        DATABASE_FILE
    )

    print("\nTables created:")

    print("1. projects")
    print("2. parcels")