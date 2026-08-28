import sqlite3
import pandas as pd
import random


DB_PATH = "data/land_acquisition.db"


# ============================================================
# ADD PARCELS FOR AN EXISTING PROJECT
# ============================================================

def add_parcels():

    print("\n==============================================")
    print("          ADD PROJECT PARCELS")
    print("==============================================")

    project_id = input("\nEnter Project ID: ").strip()

    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    # --------------------------------------------------------
    # Check project
    # --------------------------------------------------------

    cursor.execute("""
        SELECT project_id, total_parcels
        FROM projects
        WHERE project_id = ?
    """, (project_id,))

    project = cursor.fetchone()

    if project is None:

        print("\nProject not found.")

        connection.close()
        return

    total_parcels = project[1]

    # --------------------------------------------------------
    # Check existing parcels
    # --------------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*)
        FROM parcels
        WHERE project_id = ?
    """, (project_id,))

    existing_parcels = cursor.fetchone()[0]

    print("\nProject:", project_id)
    print("Required parcels:", total_parcels)
    print("Existing parcels:", existing_parcels)

    remaining = total_parcels - existing_parcels

    if remaining <= 0:

        print("\nAll required parcels already exist.")

        connection.close()
        return

    print("Parcels to be created:", remaining)

    # --------------------------------------------------------
    # Generate parcel records
    # --------------------------------------------------------

    for i in range(remaining):

        parcel_number = existing_parcels + i + 1

        plot_id = f"{project_id}-PL-{parcel_number:03d}"

        survey_number = f"S-{random.randint(10000, 99999)}"

        land_area = round(
            random.uniform(0.5, 10.0),
            2
        )

        owner_count = random.randint(1, 4)

        ownership_conflict = random.choice([0, 0, 0, 1])

        legal_dispute = random.choice([0, 0, 0, 1])

        compensation_completion = random.randint(
            20,
            100
        )

        documentation_completion = random.randint(
            20,
            100
        )

        rr_required = random.choice([0, 1])

        if rr_required == 1:

            rr_completion = random.randint(
                10,
                100
            )

        else:

            rr_completion = 100

        possession_percent = random.randint(
            10,
            100
        )

        stakeholder_response = random.randint(
            30,
            100
        )

        # ----------------------------------------------------
        # Insert parcel
        # ----------------------------------------------------

        cursor.execute("""
            INSERT INTO parcels (
                project_id,
                plot_id,
                survey_number,
                land_area_hectares,
                owner_count,
                ownership_conflict,
                legal_dispute,
                compensation_completion_percent,
                documentation_completion_percent,
                rr_required,
                rr_completion_percent,
                possession_percent,
                stakeholder_response_rate
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            project_id,
            plot_id,
            survey_number,
            land_area,
            owner_count,
            ownership_conflict,
            legal_dispute,
            compensation_completion,
            documentation_completion,
            rr_required,
            rr_completion,
            possession_percent,
            stakeholder_response
        ))

    connection.commit()

    # --------------------------------------------------------
    # Verify
    # --------------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*)
        FROM parcels
        WHERE project_id = ?
    """, (project_id,))

    final_count = cursor.fetchone()[0]

    connection.close()

    print("\n==============================================")
    print("        PARCELS ADDED SUCCESSFULLY")
    print("==============================================")

    print("\nProject ID:", project_id)
    print("Required parcels:", total_parcels)
    print("Parcels now in database:", final_count)

    print("\nParcel IDs:")

    print(
        f"{project_id}-PL-{existing_parcels + 1:03d}"
        " to "
        f"{project_id}-PL-{final_count:03d}"
    )

    print("\nThese parcels are now available")
    print("for parcel-level AI risk analysis.")


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    add_parcels()