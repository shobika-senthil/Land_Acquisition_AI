import sqlite3
import random

DB_PATH = "data/land_acquisition.db"


def add_parcels(project_id):

    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    # --------------------------------------------------------
    # Get project information
    # --------------------------------------------------------

    cursor.execute("""
        SELECT
            total_parcels,
            compensation_completion_percent,
            documentation_completion_percent,
            rr_completion_percent,
            possession_percent,
            stakeholder_response_rate
        FROM projects
        WHERE project_id = ?
    """, (project_id,))

    project = cursor.fetchone()

    if project is None:
        print("\nProject not found.")
        connection.close()
        return

    (
        total_parcels,
        compensation,
        documentation,
        rr,
        possession,
        stakeholder
    ) = project

    # --------------------------------------------------------
    # Check whether parcels already exist
    # --------------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*)
        FROM parcels
        WHERE project_id = ?
    """, (project_id,))

    existing = cursor.fetchone()[0]

    if existing > 0:

        print("\nParcels already exist for this project.")
        print("Existing parcels:", existing)

        connection.close()
        return

    # --------------------------------------------------------
    # Create parcels
    # --------------------------------------------------------

    print("\nCreating parcels...")
    print("Project:", project_id)
    print("Total parcels:", total_parcels)

    for i in range(1, total_parcels + 1):

        plot_id = f"{project_id}-PL-{i:03d}"

        survey_number = (
            f"S-{random.randint(10000, 99999)}"
        )

        # Different parcel conditions
        # are generated around project-level values.

        parcel_compensation = max(
            0,
            min(
                100,
                round(
                    compensation +
                    random.randint(-25, 20)
                )
            )
        )

        parcel_documentation = max(
            0,
            min(
                100,
                round(
                    documentation +
                    random.randint(-20, 20)
                )
            )
        )

        parcel_rr = max(
            0,
            min(
                100,
                round(
                    rr +
                    random.randint(-20, 20)
                )
            )
        )

        parcel_possession = max(
            0,
            min(
                100,
                round(
                    possession +
                    random.randint(-25, 20)
                )
            )
        )

        parcel_stakeholder = max(
            0,
            min(
                100,
                round(
                    stakeholder +
                    random.randint(-20, 20)
                )
            )
        )

        # ----------------------------------------------------
        # Individual parcel risk conditions
        # ----------------------------------------------------

        ownership_conflict = (
            1 if random.random() < 0.10 else 0
        )

        legal_dispute = (
            1 if random.random() < 0.08 else 0
        )

        rr_required = (
            1 if random.random() < 0.50 else 0
        )

        land_area = round(
            random.uniform(0.5, 8.0),
            2
        )

        owner_count = random.randint(1, 5)

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
            parcel_compensation,
            parcel_documentation,
            rr_required,
            parcel_rr if rr_required else 100,
            parcel_possession,
            parcel_stakeholder

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

    count = cursor.fetchone()[0]

    connection.close()

    print("\n==============================================")
    print("       PARCELS CREATED SUCCESSFULLY")
    print("==============================================")

    print("Project ID:", project_id)
    print("Parcels created:", count)


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print("\n==============================================")
    print("       ADD PARCELS TO PROJECT")
    print("==============================================")

    project_id = input(
        "\nEnter Project ID: "
    ).strip()

    add_parcels(project_id)