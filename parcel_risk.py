import sqlite3
import pandas as pd


# ============================================================
# DATABASE
# ============================================================

DB_PATH = "data/land_acquisition.db"


# ============================================================
# 1. CALCULATE PARCEL RISK SCORE
# ============================================================

def calculate_risk_score(parcel):

    score = 0

    # Legal dispute
    if parcel["legal_dispute"] == 1:
        score += 20

    # Ownership conflict
    if parcel["ownership_conflict"] == 1:
        score += 15

    # Compensation
    compensation = parcel["compensation_completion_percent"]

    if compensation < 40:
        score += 20
    elif compensation < 60:
        score += 15
    elif compensation < 80:
        score += 8

    # Possession
    possession = parcel["possession_percent"]

    if possession < 30:
        score += 20
    elif possession < 50:
        score += 15
    elif possession < 70:
        score += 8

    # Documentation
    documentation = parcel["documentation_completion_percent"]

    if documentation < 40:
        score += 15
    elif documentation < 60:
        score += 10
    elif documentation < 80:
        score += 5

    # R&R
    if parcel["rr_required"] == 1:

        rr = parcel["rr_completion_percent"]

        if rr < 40:
            score += 15
        elif rr < 60:
            score += 10
        elif rr < 80:
            score += 5

    # Stakeholder response
    response = parcel["stakeholder_response_rate"]

    if response < 40:
        score += 10
    elif response < 60:
        score += 7
    elif response < 80:
        score += 3

    return min(score, 100)


# ============================================================
# 2. RISK LEVEL
# ============================================================

def get_risk_level(score):

    if score >= 70:
        return "CRITICAL"

    elif score >= 50:
        return "HIGH"

    elif score >= 30:
        return "MEDIUM"

    else:
        return "LOW"


# ============================================================
# 3. RISK REASONS
# ============================================================

def get_risk_reasons(parcel):

    reasons = []

    # Legal
    if parcel["legal_dispute"] == 1:

        reasons.append(
            "Pending legal dispute"
        )

    # Ownership
    if parcel["ownership_conflict"] == 1:

        reasons.append(
            "Ownership conflict"
        )

    # Compensation
    compensation = parcel[
        "compensation_completion_percent"
    ]

    if compensation < 40:

        reasons.append(
            "Compensation completion is critically low"
        )

    elif compensation < 60:

        reasons.append(
            "Compensation is only partially completed"
        )

    # Documentation
    documentation = parcel[
        "documentation_completion_percent"
    ]

    if documentation < 40:

        reasons.append(
            "Documentation is critically incomplete"
        )

    elif documentation < 60:

        reasons.append(
            "Documentation is partially completed"
        )

    # R&R
    if parcel["rr_required"] == 1:

        rr = parcel["rr_completion_percent"]

        if rr < 40:

            reasons.append(
                "R&R progress is critically low"
            )

        elif rr < 60:

            reasons.append(
                "R&R is partially completed"
            )

    # Possession
    possession = parcel["possession_percent"]

    if possession < 30:

        reasons.append(
            "Land possession is significantly incomplete"
        )

    elif possession < 50:

        reasons.append(
            "Land possession is partially incomplete"
        )

    # Stakeholder
    response = parcel[
        "stakeholder_response_rate"
    ]

    if response < 40:

        reasons.append(
            "Very low stakeholder response"
        )

    elif response < 60:

        reasons.append(
            "Moderate stakeholder response"
        )

    return reasons


# ============================================================
# 4. PARCEL RECOMMENDATIONS
# ============================================================

def get_recommendation(parcel):

    recommendations = []

    # Legal
    if parcel["legal_dispute"] == 1:

        recommendations.append(
            "Escalate the pending legal dispute "
            "for priority legal review and establish "
            "a defined resolution timeline."
        )

    # Ownership
    if parcel["ownership_conflict"] == 1:

        recommendations.append(
            "Verify ownership using revenue records, "
            "survey records and registration records "
            "before proceeding with acquisition."
        )

    # Compensation
    if parcel[
        "compensation_completion_percent"
    ] < 60:

        recommendations.append(
            "Review the pending compensation case, "
            "verify eligibility and documentation, "
            "and prioritize the case for payment."
        )

    # Documentation
    if parcel[
        "documentation_completion_percent"
    ] < 60:

        recommendations.append(
            "Conduct a document-gap review, identify "
            "missing documents and assign each pending "
            "document to the responsible officer."
        )

    # R&R
    if (
        parcel["rr_required"] == 1
        and parcel["rr_completion_percent"] < 60
    ):

        recommendations.append(
            "Identify pending rehabilitation and "
            "resettlement requirements and create "
            "a time-bound completion plan."
        )

    # Possession
    if parcel[
        "possession_percent"
    ] < 50:

        recommendations.append(
            "Identify the exact reason for pending "
            "possession and prioritize resolution "
            "after clearing the relevant blocker."
        )

    # Stakeholder
    if parcel[
        "stakeholder_response_rate"
    ] < 60:

        recommendations.append(
            "Conduct targeted stakeholder follow-up, "
            "record unresolved concerns and track "
            "each issue until resolution."
        )

    if not recommendations:

        recommendations.append(
            "No immediate corrective action required."
        )

    return recommendations


# ============================================================
# 5. LOAD PARCELS FROM DATABASE
# ============================================================

def load_parcels(project_id=None):

    connection = sqlite3.connect(DB_PATH)

    query = """
        SELECT *
        FROM parcels
    """

    params = ()

    if project_id:

        query += """
            WHERE project_id = ?
        """

        params = (project_id,)

    data = pd.read_sql_query(
        query,
        connection,
        params=params
    )

    connection.close()

    return data


# ============================================================
# 6. ANALYZE PARCELS
# ============================================================

def analyze_parcels(project_id=None):

    data = load_parcels(project_id)

    if data.empty:

        print(
            "\nNo parcels found for this project."
        )

        return None

    # Calculate risk score
    data["Parcel_Risk_Score"] = data.apply(
        calculate_risk_score,
        axis=1
    )

    # Risk level
    data["Parcel_Risk_Level"] = (
        data["Parcel_Risk_Score"]
        .apply(get_risk_level)
    )

    # Risk reasons
    data["Risk_Reasons"] = data.apply(
        lambda row:
        " | ".join(
            get_risk_reasons(row)
        ),
        axis=1
    )

    # Recommendations
    data["Recommended_Action"] = data.apply(
        lambda row:
        " | ".join(
            get_recommendation(row)
        ),
        axis=1
    )

    return data


# ============================================================
# 7. DISPLAY ANALYSIS
# ============================================================

def display_analysis(data, project_id):

    print("\n==============================================")
    print("       DYNAMIC PARCEL RISK ANALYSIS")
    print("==============================================")

    print("\nProject ID:", project_id)

    print(
        "Total parcels:",
        len(data)
    )

    # ========================================================
    # RISK DISTRIBUTION
    # ========================================================

    counts = (
        data["Parcel_Risk_Level"]
        .value_counts()
    )

    critical = counts.get("CRITICAL", 0)
    high = counts.get("HIGH", 0)
    medium = counts.get("MEDIUM", 0)
    low = counts.get("LOW", 0)

    print("\n==============================================")
    print("             RISK DISTRIBUTION")
    print("==============================================")

    print("Critical:", critical)
    print("High:", high)
    print("Medium:", medium)
    print("Low:", low)

    # ========================================================
    # IMMEDIATE ATTENTION
    # ========================================================

    immediate = data[
        data["Parcel_Risk_Level"].isin(
            ["CRITICAL", "HIGH"]
        )
    ]

    print("\nImmediate attention required:")

    print(
        len(immediate),
        "parcels"
    )

    # ========================================================
    # TOP 10 HIGH-RISK PARCELS
    # ========================================================

    print("\n==============================================")
    print("        TOP HIGH-RISK PARCELS")
    print("==============================================")

    top_parcels = data.sort_values(
        "Parcel_Risk_Score",
        ascending=False
    ).head(10)

    for _, parcel in top_parcels.iterrows():

        print(
            "\n----------------------------------------------"
        )

        print(
            "Plot:",
            parcel["plot_id"]
        )

        print(
            "Survey Number:",
            parcel["survey_number"]
        )

        print(
            "Risk Score:",
            parcel["Parcel_Risk_Score"]
        )

        print(
            "Risk Level:",
            parcel["Parcel_Risk_Level"]
        )

        print("\nRisk Factors:")

        reasons = get_risk_reasons(parcel)

        for reason in reasons:

            print(
                " -",
                reason
            )

        print("\nRecommended Action:")

        recommendations = get_recommendation(
            parcel
        )

        for recommendation in recommendations:

            print(
                " -",
                recommendation
            )


# ============================================================
# 8. MAIN PROGRAM
# ============================================================

if __name__ == "__main__":

    print("\n==============================================")
    print("       DYNAMIC PARCEL RISK ANALYSIS")
    print("==============================================")

    project_id = input(
        "\nEnter Project ID: "
    ).strip()

    data = analyze_parcels(
        project_id
    )

    if data is not None:

        display_analysis(
            data,
            project_id
        )

        # ====================================================
        # SAVE PROJECT-SPECIFIC RESULT
        # ====================================================

        output_file = (
            f"parcel_risk_{project_id}.xlsx"
        )

        data.to_excel(
            output_file,
            index=False
        )

        print(
            "\n=============================================="
        )

        print(
            "       PARCEL ANALYSIS COMPLETED"
        )

        print(
            "=============================================="
        )

        print(
            "\nResults saved to:"
        )

        print(
            output_file
        )