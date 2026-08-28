from database import get_connection
import random


# ============================================================
# ADD NEW PROJECT
# ============================================================

def add_project():

    print("\n==============================================")
    print("          ADD NEW LAND PROJECT")
    print("==============================================")

    connection = get_connection()
    cursor = connection.cursor()

    # ========================================================
    # GENERATE NEW PROJECT ID
    # ========================================================

    cursor.execute("""
        SELECT project_id
        FROM projects
        ORDER BY CAST(SUBSTR(project_id, 2) AS INTEGER) DESC
        LIMIT 1
    """)

    result = cursor.fetchone()

    if result:
        last_id = int(result[0][1:])
        project_id = f"P{last_id + 1:05d}"
    else:
        project_id = "P00001"

    print("\nNew Project ID:", project_id)

    # ========================================================
    # BASIC PROJECT INFORMATION
    # ========================================================

    project_type = input("Project Type: ")
    state = input("State: ")
    district = input("District: ")

    land_area = float(
        input("Land Area (hectares): ")
    )

    total_parcels = int(
        input("Total Parcels: ")
    )

    affected_families = int(
        input("Affected Families: ")
    )

    # ========================================================
    # APPROVAL INFORMATION
    # ========================================================

    required_approvals = int(
        input("Required Approvals: ")
    )

    completed_approvals = int(
        input("Completed Approvals: ")
    )

    pending_approvals = max(
        0,
        required_approvals - completed_approvals
    )

    print(
        "Pending Approvals:",
        pending_approvals
    )

    approval_delay = int(
        input("Approval Delay (days): ")
    )

    # ========================================================
    # LEGAL AND OWNERSHIP
    # ========================================================

    legal_disputes = int(
        input("Legal Disputes: ")
    )

    ownership_conflicts = int(
        input("Ownership Conflicts: ")
    )

    # ========================================================
    # COMPENSATION
    # ========================================================

    total_compensation = int(
        input("Total Compensation Cases: ")
    )

    compensation_paid = int(
        input("Compensation Paid Cases: ")
    )

    if total_compensation > 0:

        compensation_completion = (
            compensation_paid /
            total_compensation
        ) * 100

    else:

        compensation_completion = 100

    print(
        "Compensation Completion:",
        round(compensation_completion, 2),
        "%"
    )

    compensation_delay = int(
        input("Compensation Delay (days): ")
    )

    # ========================================================
    # DOCUMENTATION
    # ========================================================

    documents_required = int(
        input("Documents Required: ")
    )

    documents_completed = int(
        input("Documents Completed: ")
    )

    if documents_required > 0:

        documentation_completion = (
            documents_completed /
            documents_required
        ) * 100

    else:

        documentation_completion = 100

    print(
        "Documentation Completion:",
        round(documentation_completion, 2),
        "%"
    )

    # ========================================================
    # REHABILITATION AND RESETTLEMENT
    # ========================================================

    families_rr = int(
        input("Families Requiring R&R: ")
    )

    families_rehabilitated = int(
        input("Families Rehabilitated: ")
    )

    if families_rr > 0:

        rr_completion = (
            families_rehabilitated /
            families_rr
        ) * 100

    else:

        rr_completion = 100

    print(
        "R&R Completion:",
        round(rr_completion, 2),
        "%"
    )

    # ========================================================
    # LAND POSSESSION
    # ========================================================

    parcels_required = int(
        input("Parcels Required: ")
    )

    parcels_possessed = int(
        input("Parcels Possessed: ")
    )

    if parcels_required > 0:

        possession_percent = (
            parcels_possessed /
            parcels_required
        ) * 100

    else:

        possession_percent = 100

    print(
        "Possession Completion:",
        round(possession_percent, 2),
        "%"
    )

    # ========================================================
    # STAKEHOLDER
    # ========================================================

    stakeholder_response = float(
        input("Stakeholder Response Rate (%): ")
    )

    # ========================================================
    # PROJECT TIMELINE
    # ========================================================

    current_stage = input(
        "Current Stage: "
    )

    planned_duration = int(
        input("Planned Duration (days): ")
    )

    elapsed_days = int(
        input("Elapsed Days: ")
    )

    # ========================================================
    # HISTORICAL DELAY DATA
    # ========================================================

    delayed = None
    actual_delay_days = None
    primary_delay_reason = None

    # ========================================================
    # INSERT PROJECT
    # ========================================================

    cursor.execute("""
        INSERT INTO projects (

            project_id,
            project_type,
            state,
            district,
            land_area_hectares,
            total_parcels,
            affected_families,
            required_approvals,
            completed_approvals,
            pending_approvals,
            approval_delay_days,
            legal_disputes,
            ownership_conflicts,
            total_compensation_cases,
            compensation_paid_cases,
            compensation_completion_percent,
            compensation_delay_days,
            documents_required,
            documents_completed,
            documentation_completion_percent,
            families_requiring_rr,
            families_rehabilitated,
            rr_completion_percent,
            parcels_required,
            parcels_possessed,
            possession_percent,
            stakeholder_response_rate,
            current_stage,
            planned_duration_days,
            elapsed_days,
            delayed,
            actual_delay_days,
            primary_delay_reason

        )

        VALUES (

            :project_id,
            :project_type,
            :state,
            :district,
            :land_area,
            :total_parcels,
            :affected_families,
            :required_approvals,
            :completed_approvals,
            :pending_approvals,
            :approval_delay,
            :legal_disputes,
            :ownership_conflicts,
            :total_compensation,
            :compensation_paid,
            :compensation_completion,
            :compensation_delay,
            :documents_required,
            :documents_completed,
            :documentation_completion,
            :families_rr,
            :families_rehabilitated,
            :rr_completion,
            :parcels_required,
            :parcels_possessed,
            :possession_percent,
            :stakeholder_response,
            :current_stage,
            :planned_duration,
            :elapsed_days,
            :delayed,
            :actual_delay_days,
            :primary_delay_reason

        )
    """, {

        "project_id": project_id,
        "project_type": project_type,
        "state": state,
        "district": district,
        "land_area": land_area,
        "total_parcels": total_parcels,
        "affected_families": affected_families,
        "required_approvals": required_approvals,
        "completed_approvals": completed_approvals,
        "pending_approvals": pending_approvals,
        "approval_delay": approval_delay,
        "legal_disputes": legal_disputes,
        "ownership_conflicts": ownership_conflicts,
        "total_compensation": total_compensation,
        "compensation_paid": compensation_paid,
        "compensation_completion": compensation_completion,
        "compensation_delay": compensation_delay,
        "documents_required": documents_required,
        "documents_completed": documents_completed,
        "documentation_completion": documentation_completion,
        "families_rr": families_rr,
        "families_rehabilitated": families_rehabilitated,
        "rr_completion": rr_completion,
        "parcels_required": parcels_required,
        "parcels_possessed": parcels_possessed,
        "possession_percent": possession_percent,
        "stakeholder_response": stakeholder_response,
        "current_stage": current_stage,
        "planned_duration": planned_duration,
        "elapsed_days": elapsed_days,
        "delayed": delayed,
        "actual_delay_days": actual_delay_days,
        "primary_delay_reason": primary_delay_reason
    })

    # ========================================================
    # AUTOMATICALLY CREATE PARCELS
    # ========================================================

    print("\nCreating parcel records...")

    for i in range(1, total_parcels + 1):

        plot_id = f"{project_id}-PL-{i:03d}"

        survey_number = (
            f"S-{random.randint(10000, 99999)}"
        )

        # ----------------------------------------------------
        # Create realistic parcel-level variation
        # around the project-level values.
        # ----------------------------------------------------

        parcel_compensation = max(
            0,
            min(
                100,
                round(
                    compensation_completion +
                    random.randint(-25, 20)
                )
            )
        )

        parcel_documentation = max(
            0,
            min(
                100,
                round(
                    documentation_completion +
                    random.randint(-20, 20)
                )
            )
        )

        parcel_rr = max(
            0,
            min(
                100,
                round(
                    rr_completion +
                    random.randint(-20, 20)
                )
            )
        )

        parcel_possession = max(
            0,
            min(
                100,
                round(
                    possession_percent +
                    random.randint(-25, 20)
                )
            )
        )

        parcel_stakeholder = max(
            0,
            min(
                100,
                round(
                    stakeholder_response +
                    random.randint(-20, 20)
                )
            )
        )

        # ----------------------------------------------------
        # Individual parcel issues
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

        land_area_parcel = round(
            random.uniform(0.5, 8.0),
            2
        )

        owner_count = random.randint(1, 5)

        # ----------------------------------------------------
        # INSERT PARCEL
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
            land_area_parcel,
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

    # ========================================================
    # SAVE EVERYTHING
    # ========================================================

    connection.commit()

    # ========================================================
    # VERIFY PARCELS
    # ========================================================

    cursor.execute("""
        SELECT COUNT(*)
        FROM parcels
        WHERE project_id = ?
    """, (project_id,))

    parcel_count = cursor.fetchone()[0]

    connection.close()

    # ========================================================
    # SUCCESS
    # ========================================================

    print("\n==============================================")
    print("       PROJECT ADDED SUCCESSFULLY")
    print("==============================================")

    print("\nProject ID:", project_id)
    print("Project Type:", project_type)
    print("State:", state)
    print("District:", district)

    print("\nCalculated Information")
    print("----------------------------------------------")

    print(
        "Pending Approvals:",
        pending_approvals
    )

    print(
        "Compensation Completion:",
        round(compensation_completion, 2),
        "%"
    )

    print(
        "Documentation Completion:",
        round(documentation_completion, 2),
        "%"
    )

    print(
        "R&R Completion:",
        round(rr_completion, 2),
        "%"
    )

    print(
        "Possession Completion:",
        round(possession_percent, 2),
        "%"
    )

    print("\nParcel Information")
    print("----------------------------------------------")

    print(
        "Parcels requested:",
        total_parcels
    )

    print(
        "Parcels created:",
        parcel_count
    )

    print(
        "\nProject and parcels are now stored "
        "in the database."
    )


# ============================================================
# START PROGRAM
# ============================================================

if __name__ == "__main__":
    add_project()