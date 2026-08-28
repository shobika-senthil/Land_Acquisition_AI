import sqlite3
import pandas as pd


DB_PATH = "data/land_acquisition.db"


# ============================================================
# RISK CALCULATION
# ============================================================

def calculate_risk(row):

    score = 0
    factors = []

    # --------------------------------------------------------
    # LEGAL DISPUTE
    # --------------------------------------------------------

    if row["legal_dispute"] == 1:
        score += 20
        factors.append("Pending legal dispute")

    # --------------------------------------------------------
    # OWNERSHIP CONFLICT
    # --------------------------------------------------------

    if row["ownership_conflict"] == 1:
        score += 15
        factors.append("Ownership conflict")

    # --------------------------------------------------------
    # COMPENSATION
    # --------------------------------------------------------

    if row["compensation_completion_percent"] < 50:

        score += 15
        factors.append("Low compensation completion")

    elif row["compensation_completion_percent"] < 75:

        score += 8
        factors.append("Compensation partially completed")

    # --------------------------------------------------------
    # DOCUMENTATION
    # --------------------------------------------------------

    if row["documentation_completion_percent"] < 50:

        score += 15
        factors.append("Incomplete documentation")

    elif row["documentation_completion_percent"] < 75:

        score += 8
        factors.append("Documentation partially completed")

    # --------------------------------------------------------
    # R&R
    # --------------------------------------------------------

    if row["rr_required"] == 1:

        if row["rr_completion_percent"] < 50:

            score += 15
            factors.append("R&R progress is low")

        elif row["rr_completion_percent"] < 75:

            score += 8
            factors.append("R&R partially completed")

    # --------------------------------------------------------
    # POSSESSION
    # --------------------------------------------------------

    if row["possession_percent"] < 50:

        score += 15
        factors.append(
            "Land possession significantly incomplete"
        )

    elif row["possession_percent"] < 75:

        score += 8
        factors.append(
            "Land possession partially incomplete"
        )

    # --------------------------------------------------------
    # STAKEHOLDER RESPONSE
    # --------------------------------------------------------

    if row["stakeholder_response_rate"] < 50:

        score += 10
        factors.append("Low stakeholder response")

    elif row["stakeholder_response_rate"] < 70:

        score += 5
        factors.append("Moderate stakeholder response")

    # --------------------------------------------------------
    # LIMIT SCORE
    # --------------------------------------------------------

    score = min(score, 100)

    # --------------------------------------------------------
    # RISK LEVEL
    # --------------------------------------------------------

    if score >= 80:

        level = "CRITICAL"

    elif score >= 60:

        level = "HIGH"

    elif score >= 40:

        level = "MEDIUM"

    else:

        level = "LOW"

    return score, level, factors


# ============================================================
# AI-GENERATED CORRECTIVE ACTION PLAN
# ============================================================

def generate_recommendations(
    row,
    risk_score,
    risk_level,
    factors
):

    recommendations = []

    legal = row["legal_dispute"] == 1
    ownership = row["ownership_conflict"] == 1

    compensation = row[
        "compensation_completion_percent"
    ]

    documentation = row[
        "documentation_completion_percent"
    ]

    rr = row[
        "rr_completion_percent"
    ]

    possession = row[
        "possession_percent"
    ]

    stakeholder = row[
        "stakeholder_response_rate"
    ]

    # ========================================================
    # PRIORITY 0
    # OVERALL RISK ESCALATION
    # ========================================================

    if risk_level == "CRITICAL":

        recommendations.append({

            "priority": 0,

            "area": "CRITICAL ESCALATION",

            "action": (
                f"This parcel has a critical risk score of "
                f"{risk_score}/100. Place the parcel under "
                "high-priority monitoring and conduct regular "
                "status reviews until the major risk factors "
                "are resolved."
            ),

            "authority": (
                "Project Monitoring Authority"
            ),

            "objective": (
                "Prevent this parcel from becoming a major "
                "contributor to overall project delay."
            )
        })

    elif risk_level == "HIGH":

        recommendations.append({

            "priority": 0,

            "area": "HIGH-PRIORITY MONITORING",

            "action": (
                f"This parcel has a high risk score of "
                f"{risk_score}/100. Assign the parcel to "
                "priority monitoring and track all identified "
                "blockers until the risk level is reduced."
            ),

            "authority": (
                "Project Monitoring Authority"
            ),

            "objective": (
                "Prevent escalation from high risk to critical risk."
            )
        })

    # ========================================================
    # PRIORITY 1
    # LEGAL + OWNERSHIP
    # ========================================================

    if legal and ownership:

        recommendations.append({

            "priority": 1,

            "area": "LEGAL & OWNERSHIP RESOLUTION",

            "action": (
                "Immediately refer the parcel for joint legal "
                "and ownership verification. Reconcile ownership "
                "claims with the latest survey, land and registration "
                "records. Escalate unresolved ownership disputes "
                "to the appropriate legal authority."
            ),

            "authority": (
                "Land Acquisition / Legal Authority"
            ),

            "objective": (
                "Establish clear ownership and remove the legal "
                "blocker preventing smooth acquisition."
            )
        })

    # ========================================================
    # LEGAL ONLY
    # ========================================================

    elif legal:

        recommendations.append({

            "priority": 1,

            "area": "LEGAL DISPUTE RESOLUTION",

            "action": (
                "Prioritize the pending legal dispute for review. "
                "Identify the exact nature of the dispute, assign "
                "the case to the appropriate legal authority and "
                "track its resolution separately from routine "
                "acquisition activities."
            ),

            "authority": (
                "Legal Authority"
            ),

            "objective": (
                "Resolve the legal obstruction before it creates "
                "additional acquisition delay."
            )
        })

    # ========================================================
    # OWNERSHIP ONLY
    # ========================================================

    elif ownership:

        recommendations.append({

            "priority": 1,

            "area": "OWNERSHIP VERIFICATION",

            "action": (
                "Initiate ownership verification using available "
                "land, survey and registration records. Identify "
                "conflicting claims and complete the required "
                "legal verification before final acquisition "
                "processing."
            ),

            "authority": (
                "Revenue / Land Records Authority"
            ),

            "objective": (
                "Establish clear ownership and reduce the risk "
                "of future legal disputes."
            )
        })

    # ========================================================
    # PRIORITY 2
    # COMPENSATION
    # ========================================================

    if compensation < 40:

        recommendations.append({

            "priority": 2,

            "area": "CRITICAL COMPENSATION DELAY",

            "action": (
                f"Compensation completion is critically low at "
                f"{compensation:.1f}%. Identify every pending "
                "compensation case, verify eligibility and "
                "supporting documentation, and prioritize "
                "eligible payments through a time-bound process."
            ),

            "authority": (
                "Compensation / Land Acquisition Officer"
            ),

            "objective": (
                "Increase compensation completion and remove "
                "one of the major acquisition bottlenecks."
            )
        })

    elif compensation < 60:

        recommendations.append({

            "priority": 2,

            "area": "COMPENSATION ACCELERATION",

            "action": (
                f"Compensation completion is currently "
                f"{compensation:.1f}%. Review all remaining "
                "unpaid cases and establish a time-bound "
                "follow-up schedule for pending payments."
            ),

            "authority": (
                "Compensation / Land Acquisition Officer"
            ),

            "objective": (
                "Accelerate the remaining compensation process."
            )
        })

    elif compensation < 75:

        recommendations.append({

            "priority": 2,

            "area": "COMPENSATION MONITORING",

            "action": (
                f"Compensation is {compensation:.1f}% complete. "
                "Monitor the remaining cases closely and ensure "
                "that eligible pending payments are processed "
                "without unnecessary administrative delay."
            ),

            "authority": (
                "Compensation / Land Acquisition Officer"
            ),

            "objective": (
                "Prevent partially completed compensation "
                "from becoming a future delay driver."
            )
        })

    # ========================================================
    # PRIORITY 3
    # DOCUMENTATION
    # ========================================================

    if documentation < 40:

        recommendations.append({

            "priority": 3,

            "area": "DOCUMENTATION AUDIT",

            "action": (
                f"Documentation completion is critically low at "
                f"{documentation:.1f}%. Perform a document-gap "
                "audit, identify every missing record and assign "
                "each pending document to the responsible officer "
                "with a completion deadline."
            ),

            "authority": (
                "Land Acquisition Documentation Team"
            ),

            "objective": (
                "Complete the documentary requirements needed "
                "for subsequent acquisition stages."
            )
        })

    elif documentation < 60:

        recommendations.append({

            "priority": 3,

            "area": "DOCUMENTATION COMPLETION",

            "action": (
                f"Documentation is {documentation:.1f}% complete. "
                "Identify the remaining missing documents and "
                "establish a deadline for completing the "
                "documentation."
            ),

            "authority": (
                "Land Acquisition Documentation Team"
            ),

            "objective": (
                "Prevent documentation gaps from becoming "
                "future project delays."
            )
        })

    elif documentation < 75:

        recommendations.append({

            "priority": 3,

            "area": "DOCUMENTATION MONITORING",

            "action": (
                f"Documentation is {documentation:.1f}% complete. "
                "Review the remaining documentation requirements "
                "and ensure they are completed before the next "
                "major acquisition stage."
            ),

            "authority": (
                "Land Acquisition Documentation Team"
            ),

            "objective": (
                "Maintain documentation readiness."
            )
        })

    # ========================================================
    # PRIORITY 4
    # REHABILITATION & RESETTLEMENT
    # ========================================================

    if row["rr_required"] == 1:

        if rr < 40:

            recommendations.append({

                "priority": 4,

                "area": "CRITICAL R&R INTERVENTION",

                "action": (
                    f"R&R completion is critically low at "
                    f"{rr:.1f}%. Identify affected families "
                    "whose rehabilitation or resettlement remains "
                    "pending and create a case-wise completion plan."
                ),

                "authority": (
                    "R&R / Rehabilitation Authority"
                ),

                "objective": (
                    "Accelerate rehabilitation and resettlement "
                    "and reduce social-impact-related delays."
                )
            })

        elif rr < 60:

            recommendations.append({

                "priority": 4,

                "area": "R&R ACCELERATION",

                "action": (
                    f"R&R completion is {rr:.1f}%. Review all "
                    "pending rehabilitation cases and prioritize "
                    "families awaiting completion."
                ),

                "authority": (
                    "R&R / Rehabilitation Authority"
                ),

                "objective": (
                    "Complete outstanding R&R obligations."
                )
            })

        elif rr < 75:

            recommendations.append({

                "priority": 4,

                "area": "R&R MONITORING",

                "action": (
                    f"R&R completion is {rr:.1f}%. Monitor "
                    "remaining rehabilitation and resettlement "
                    "cases and ensure timely completion."
                ),

                "authority": (
                    "R&R / Rehabilitation Authority"
                ),

                "objective": (
                    "Prevent R&R obligations from becoming "
                    "a future delay driver."
                )
            })

    # ========================================================
    # PRIORITY 5
    # LAND POSSESSION
    # ========================================================

    if possession < 40:

        recommendations.append({

            "priority": 5,

            "area": "CRITICAL LAND POSSESSION",

            "action": (
                f"Land possession is critically incomplete at "
                f"{possession:.1f}%. Identify the exact obstruction "
                "preventing possession and initiate parcel-level "
                "resolution with the concerned authority."
            ),

            "authority": (
                "Land Acquisition / Revenue Authority"
            ),

            "objective": (
                "Increase physical possession and make the land "
                "available for project implementation."
            )
        })

    elif possession < 60:

        recommendations.append({

            "priority": 5,

            "area": "LAND POSSESSION ACCELERATION",

            "action": (
                f"Land possession is {possession:.1f}% complete. "
                "Prioritize the remaining possession cases and "
                "track each pending parcel separately."
            ),

            "authority": (
                "Land Acquisition / Revenue Authority"
            ),

            "objective": (
                "Accelerate the remaining possession process."
            )
        })

    elif possession < 75:

        recommendations.append({

            "priority": 5,

            "area": "LAND POSSESSION MONITORING",

            "action": (
                f"Land possession is {possession:.1f}% complete. "
                "Monitor the remaining possession requirements "
                "and resolve pending obstacles before they "
                "affect project execution."
            ),

            "authority": (
                "Land Acquisition / Revenue Authority"
            ),

            "objective": (
                "Prevent incomplete possession from affecting "
                "project implementation."
            )
        })

    # ========================================================
    # PRIORITY 6
    # STAKEHOLDER COORDINATION
    # ========================================================

    if stakeholder < 40:

        recommendations.append({

            "priority": 6,

            "area": "STAKEHOLDER ESCALATION",

            "action": (
                f"Stakeholder response is critically low at "
                f"{stakeholder:.1f}%. Initiate direct follow-up "
                "with concerned stakeholders, record unresolved "
                "objections and escalate unresolved issues "
                "through the appropriate administrative channel."
            ),

            "authority": (
                "Project / District Administration"
            ),

            "objective": (
                "Improve stakeholder participation and reduce "
                "communication-related delays."
            )
        })

    elif stakeholder < 60:

        recommendations.append({

            "priority": 6,

            "area": "STAKEHOLDER COORDINATION",

            "action": (
                f"Stakeholder response is {stakeholder:.1f}%. "
                "Strengthen follow-up and communication with "
                "concerned stakeholders and track unresolved "
                "responses."
            ),

            "authority": (
                "Project / District Administration"
            ),

            "objective": (
                "Improve stakeholder response and prevent "
                "unresolved issues from escalating."
            )
        })

    # ========================================================
    # FINAL MONITORING ACTION
    # ========================================================

    recommendations.append({

        "priority": 99,

        "area": "CONTINUOUS MONITORING",

        "action": (
            "Reassess this parcel after the corrective actions "
            "are completed. Update the parcel information and "
            "recalculate the risk score using the latest data."
        ),

        "authority": (
            "Project Monitoring Authority"
        ),

        "objective": (
            "Verify whether the intervention has reduced "
            "the parcel's delay risk."
        )
    })

    return recommendations


# ============================================================
# GET PROJECT ID
# ============================================================

print("\n==============================================")
print("       DYNAMIC PARCEL AI ANALYSIS")
print("==============================================")

project_id = input("\nEnter Project ID: ").strip()


# ============================================================
# CONNECT DATABASE
# ============================================================

connection = sqlite3.connect(DB_PATH)


# ============================================================
# CHECK PROJECT
# ============================================================

project = pd.read_sql_query(
    """
    SELECT
        project_id,
        project_type,
        state,
        district
    FROM projects
    WHERE project_id = ?
    """,
    connection,
    params=(project_id,)
)


if project.empty:

    print("\nProject not found.")

    connection.close()
    exit()


# ============================================================
# GET PARCELS
# ============================================================

parcels = pd.read_sql_query(
    """
    SELECT *
    FROM parcels
    WHERE project_id = ?
    """,
    connection,
    params=(project_id,)
)

connection.close()


# ============================================================
# CHECK PARCELS
# ============================================================

if parcels.empty:

    print("\nNo parcels found for this project.")
    exit()


# ============================================================
# PROJECT INFORMATION
# ============================================================

print("\n==============================================")
print("             PROJECT INFORMATION")
print("==============================================")

print(
    "Project ID:",
    project_id
)

print(
    "Project Type:",
    project.loc[0, "project_type"]
)

print(
    "State:",
    project.loc[0, "state"]
)

print(
    "District:",
    project.loc[0, "district"]
)

print(
    "\nTotal parcels:",
    len(parcels)
)


# ============================================================
# ANALYZE EVERY PARCEL
# ============================================================

results = []


for _, row in parcels.iterrows():

    score, level, factors = calculate_risk(row)

    recommendations = generate_recommendations(
        row,
        score,
        level,
        factors
    )

    results.append({

        "Project_ID":
            row["project_id"],

        "Plot_ID":
            row["plot_id"],

        "Survey_Number":
            row["survey_number"],

        "Risk_Score":
            score,

        "Risk_Level":
            level,

        "Risk_Factors":
            factors,

        "Recommendations":
            recommendations

    })


# ============================================================
# SORT BY RISK
# ============================================================

results.sort(
    key=lambda x: x["Risk_Score"],
    reverse=True
)


# ============================================================
# RISK DISTRIBUTION
# ============================================================

risk_counts = {

    "CRITICAL": 0,
    "HIGH": 0,
    "MEDIUM": 0,
    "LOW": 0
}


for result in results:

    risk_counts[
        result["Risk_Level"]
    ] += 1


print("\n==============================================")
print("             RISK DISTRIBUTION")
print("==============================================")

print(
    "Critical:",
    risk_counts["CRITICAL"]
)

print(
    "High:",
    risk_counts["HIGH"]
)

print(
    "Medium:",
    risk_counts["MEDIUM"]
)

print(
    "Low:",
    risk_counts["LOW"]
)


# ============================================================
# TOP 10 HIGH-RISK PARCELS
# ============================================================

print("\n==============================================")
print("        TOP HIGH-RISK PARCELS")
print("==============================================")


for result in results[:10]:

    print("\n----------------------------------------------")

    print(
        "Plot:",
        result["Plot_ID"]
    )

    print(
        "Survey Number:",
        result["Survey_Number"]
    )

    print(
        "Risk Score:",
        result["Risk_Score"]
    )

    print(
        "Risk Level:",
        result["Risk_Level"]
    )

    # --------------------------------------------------------
    # RISK FACTORS
    # --------------------------------------------------------

    print("\nRisk Factors:")

    if result["Risk_Factors"]:

        for factor in result["Risk_Factors"]:

            print(
                " -",
                factor
            )

    else:

        print(
            " - No major risk factors"
        )

    # --------------------------------------------------------
    # CORRECTIVE ACTION PLAN
    # --------------------------------------------------------

    print(
        "\nAI-GENERATED CORRECTIVE ACTION PLAN"
    )

    for recommendation in result[
        "Recommendations"
    ]:

        priority = recommendation[
            "priority"
        ]

        if priority == 99:

            print(
                "\nPriority: MONITORING"
            )

        else:

            print(
                f"\nPriority {priority}: "
                f"{recommendation['area']}"
            )

        print(
            "Action:"
        )

        print(
            " ",
            recommendation["action"]
        )

        print(
            "Responsible Authority:"
        )

        print(
            " ",
            recommendation["authority"]
        )

        print(
            "Expected Objective:"
        )

        print(
            " ",
            recommendation["objective"]
        )


# ============================================================
# COMPLETION
# ============================================================

print("\n==============================================")
print("       PARCEL AI ANALYSIS COMPLETED")
print("==============================================")