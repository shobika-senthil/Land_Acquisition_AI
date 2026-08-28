import sqlite3

DB_PATH = "data/land_acquisition.db"


# ============================================================
# CONNECT TO DATABASE
# ============================================================

connection = sqlite3.connect(DB_PATH)
connection.row_factory = sqlite3.Row

cursor = connection.cursor()


# ============================================================
# GET PROJECT ID
# ============================================================

print("\n==============================================")
print("       AI PROJECT RECOMMENDATION SYSTEM")
print("==============================================")

project_id = input("\nEnter Project ID: ").strip()


# ============================================================
# GET PROJECT
# ============================================================

cursor.execute(
    """
    SELECT *
    FROM projects
    WHERE project_id = ?
    """,
    (project_id,)
)

project = cursor.fetchone()


if project is None:

    print("\nProject not found.")

    connection.close()
    exit()


# ============================================================
# DISPLAY PROJECT
# ============================================================

print("\n==============================================")
print("          PROJECT INFORMATION")
print("==============================================")

print("Project ID:", project["project_id"])
print("Project Type:", project["project_type"])
print("State:", project["state"])
print("District:", project["district"])

print("\nLand Area:",
      project["land_area_hectares"],
      "hectares")

print("Total Parcels:",
      project["total_parcels"])

print("Affected Families:",
      project["affected_families"])


# ============================================================
# CALCULATE IMPORTANT PERCENTAGES
# ============================================================

compensation = project[
    "compensation_completion_percent"
]

documentation = project[
    "documentation_completion_percent"
]

rr = project[
    "rr_completion_percent"
]

possession = project[
    "possession_percent"
]

stakeholder = project[
    "stakeholder_response_rate"
]

pending_approvals = project[
    "pending_approvals"
]

legal_disputes = project[
    "legal_disputes"
]

ownership_conflicts = project[
    "ownership_conflicts"
]


# ============================================================
# DELAY DRIVER ANALYSIS
# ============================================================

drivers = []


# ------------------------------------------------------------
# APPROVALS
# ------------------------------------------------------------

if pending_approvals > 0:

    if pending_approvals >= 3:

        impact = "HIGH"

    else:

        impact = "MEDIUM"

    drivers.append({

        "name": "Pending Approvals",

        "value": pending_approvals,

        "impact": impact,

        "reason":
            "Pending approvals can block subsequent "
            "land acquisition activities."
    })


# ------------------------------------------------------------
# COMPENSATION
# ------------------------------------------------------------

if compensation < 50:

    drivers.append({

        "name": "Compensation",

        "value":
            f"{compensation:.1f}% completed",

        "impact": "HIGH",

        "reason":
            "A large proportion of compensation cases "
            "remain incomplete."
    })

elif compensation < 75:

    drivers.append({

        "name": "Compensation",

        "value":
            f"{compensation:.1f}% completed",

        "impact": "MEDIUM",

        "reason":
            "Compensation is partially completed."
    })


# ------------------------------------------------------------
# LEGAL DISPUTES
# ------------------------------------------------------------

if legal_disputes > 0:

    if legal_disputes >= 3:

        impact = "HIGH"

    else:

        impact = "MEDIUM"

    drivers.append({

        "name": "Legal Disputes",

        "value":
            legal_disputes,

        "impact": impact,

        "reason":
            "Pending legal cases can prevent completion "
            "of individual land acquisition cases."
    })


# ------------------------------------------------------------
# OWNERSHIP CONFLICTS
# ------------------------------------------------------------

if ownership_conflicts > 0:

    drivers.append({

        "name": "Ownership Conflicts",

        "value":
            ownership_conflicts,

        "impact": "HIGH",

        "reason":
            "Conflicting ownership claims may delay "
            "verification and acquisition."
    })


# ------------------------------------------------------------
# DOCUMENTATION
# ------------------------------------------------------------

if documentation < 50:

    impact = "HIGH"

elif documentation < 75:

    impact = "MEDIUM"

else:

    impact = "LOW"


if documentation < 75:

    drivers.append({

        "name": "Documentation",

        "value":
            f"{documentation:.1f}% completed",

        "impact": impact,

        "reason":
            "Incomplete documentation can delay "
            "processing and approval of acquisition cases."
    })


# ------------------------------------------------------------
# R&R
# ------------------------------------------------------------

if rr < 50:

    drivers.append({

        "name": "Rehabilitation & Resettlement",

        "value":
            f"{rr:.1f}% completed",

        "impact": "HIGH",

        "reason":
            "Low R&R completion may create social and "
            "administrative bottlenecks."
    })

elif rr < 75:

    drivers.append({

        "name": "Rehabilitation & Resettlement",

        "value":
            f"{rr:.1f}% completed",

        "impact": "MEDIUM",

        "reason":
            "Some rehabilitation cases remain incomplete."
    })


# ------------------------------------------------------------
# POSSESSION
# ------------------------------------------------------------

if possession < 50:

    drivers.append({

        "name": "Land Possession",

        "value":
            f"{possession:.1f}% completed",

        "impact": "HIGH",

        "reason":
            "Insufficient possession can directly affect "
            "physical project implementation."
    })

elif possession < 75:

    drivers.append({

        "name": "Land Possession",

        "value":
            f"{possession:.1f}% completed",

        "impact": "MEDIUM",

        "reason":
            "A significant portion of land is still "
            "not under possession."
    })


# ------------------------------------------------------------
# STAKEHOLDER RESPONSE
# ------------------------------------------------------------

if stakeholder < 50:

    drivers.append({

        "name": "Stakeholder Response",

        "value":
            f"{stakeholder:.1f}%",

        "impact": "HIGH",

        "reason":
            "Low stakeholder response can lead to "
            "unresolved objections and administrative delays."
    })

elif stakeholder < 70:

    drivers.append({

        "name": "Stakeholder Response",

        "value":
            f"{stakeholder:.1f}%",

        "impact": "MEDIUM",

        "reason":
            "Stakeholder engagement requires improvement."
    })


# ============================================================
# SORT DRIVERS
# ============================================================

priority_order = {

    "HIGH": 1,
    "MEDIUM": 2,
    "LOW": 3
}

drivers.sort(
    key=lambda x: priority_order[x["impact"]]
)


# ============================================================
# DISPLAY DELAY DRIVERS
# ============================================================

print("\n==============================================")
print("           MAJOR DELAY DRIVERS")
print("==============================================")


if not drivers:

    print("\nNo major delay drivers detected.")


for index, driver in enumerate(
    drivers,
    start=1
):

    print(
        f"\n{index}. {driver['name']}"
    )

    print(
        "   Current Status:",
        driver["value"]
    )

    print(
        "   Impact:",
        driver["impact"]
    )

    print(
        "   Why it matters:",
        driver["reason"]
    )


# ============================================================
# GENERATE ACTION PLAN
# ============================================================

recommendations = []


# ============================================================
# APPROVAL RECOMMENDATION
# ============================================================

if pending_approvals > 0:

    recommendations.append({

        "priority": 1,

        "area": "APPROVALS",

        "action":
            f"Review the {pending_approvals} pending "
            "approval cases and identify the exact "
            "authority or document responsible for each "
            "pending approval. Establish a time-bound "
            "clearance schedule and escalate approvals "
            "that exceed the defined processing period.",

        "responsible":
            "Project / Administrative Authority",

        "expected":
            "Reduce approval-related bottlenecks and "
            "prevent downstream acquisition delays."
    })


# ============================================================
# COMPENSATION RECOMMENDATION
# ============================================================

if compensation < 50:

    recommendations.append({

        "priority": 2,

        "area": "COMPENSATION",

        "action":
            f"Compensation completion is only "
            f"{compensation:.1f}%. Generate a case-wise "
            "list of pending compensation cases, verify "
            "eligibility and documentation, and prioritize "
            "eligible cases for payment through a "
            "time-bound settlement plan.",

        "responsible":
            "Land Acquisition / Compensation Officer",

        "expected":
            "Increase compensation completion and reduce "
            "financial and acquisition-related delays."
    })

elif compensation < 75:

    recommendations.append({

        "priority": 2,

        "area": "COMPENSATION",

        "action":
            f"Compensation is {compensation:.1f}% complete. "
            "Review all remaining unpaid cases and create "
            "a targeted schedule for completing the "
            "outstanding compensation cases.",

        "responsible":
            "Land Acquisition / Compensation Officer",

        "expected":
            "Prevent incomplete compensation from becoming "
            "a major future delay driver."
    })


# ============================================================
# LEGAL RECOMMENDATION
# ============================================================

if legal_disputes > 0:

    recommendations.append({

        "priority": 3,

        "area": "LEGAL DISPUTES",

        "action":
            f"Prioritize the {legal_disputes} pending legal "
            "dispute(s). Classify each case by its current "
            "legal stage, assign responsibility to the "
            "appropriate legal authority and establish "
            "a review deadline for unresolved cases.",

        "responsible":
            "Legal / Land Acquisition Authority",

        "expected":
            "Resolve legal blockers that may prevent "
            "completion of affected parcels."
    })


# ============================================================
# OWNERSHIP RECOMMENDATION
# ============================================================

if ownership_conflicts > 0:

    recommendations.append({

        "priority": 4,

        "area": "OWNERSHIP VERIFICATION",

        "action":
            f"Review the {ownership_conflicts} ownership "
            "conflict(s) using land records, survey records "
            "and registration information. Identify "
            "conflicting claims and complete ownership "
            "verification before further acquisition "
            "processing.",

        "responsible":
            "Revenue / Land Records Authority",

        "expected":
            "Establish clear ownership and reduce the "
            "probability of future legal disputes."
    })


# ============================================================
# DOCUMENTATION RECOMMENDATION
# ============================================================

if documentation < 75:

    recommendations.append({

        "priority": 5,

        "area": "DOCUMENTATION",

        "action":
            f"Documentation completion is "
            f"{documentation:.1f}%. Conduct a document-gap "
            "audit and generate a list of all missing or "
            "incomplete documents. Assign each pending "
            "document to the responsible officer with "
            "a defined completion deadline.",

        "responsible":
            "Land Acquisition Documentation Team",

        "expected":
            "Improve documentation readiness and prevent "
            "administrative processing delays."
    })


# ============================================================
# R&R RECOMMENDATION
# ============================================================

if rr < 75:

    recommendations.append({

        "priority": 6,

        "area": "REHABILITATION & RESETTLEMENT",

        "action":
            f"R&R completion is {rr:.1f}%. Identify all "
            "families whose rehabilitation or resettlement "
            "remains pending. Prioritize cases based on "
            "urgency and create a family-wise completion "
            "schedule.",

        "responsible":
            "R&R / Rehabilitation Authority",

        "expected":
            "Accelerate R&R completion and reduce "
            "social-impact-related acquisition delays."
    })


# ============================================================
# POSSESSION RECOMMENDATION
# ============================================================

if possession < 75:

    recommendations.append({

        "priority": 7,

        "area": "LAND POSSESSION",

        "action":
            f"Land possession is {possession:.1f}% complete. "
            "Identify every parcel where possession is "
            "pending and classify the reason for non-possession "
            "such as compensation, legal dispute, ownership "
            "issue or administrative clearance. Prioritize "
            "resolvable cases first.",

        "responsible":
            "Land Acquisition / Revenue Authority",

        "expected":
            "Increase physical land possession and "
            "accelerate project execution."
    })


# ============================================================
# STAKEHOLDER RECOMMENDATION
# ============================================================

if stakeholder < 70:

    recommendations.append({

        "priority": 8,

        "area": "STAKEHOLDER ENGAGEMENT",

        "action":
            f"Stakeholder response is {stakeholder:.1f}%. "
            "Identify stakeholders who have not responded "
            "or have unresolved concerns. Schedule targeted "
            "follow-ups and record the resolution status "
            "of each issue.",

        "responsible":
            "Project / District Administration",

        "expected":
            "Improve stakeholder participation and reduce "
            "communication-related delays."
    })


# ============================================================
# FINAL MONITORING
# ============================================================

recommendations.append({

    "priority": 99,

    "area": "CONTINUOUS MONITORING",

    "action":
        "After corrective actions are completed, update "
        "the project data and run the AI prediction again. "
        "Compare the new delay probability and risk level "
        "with the previous assessment.",

    "responsible":
        "Project Monitoring Authority",

    "expected":
        "Measure whether interventions have actually "
        "reduced the project's delay risk."
})


# ============================================================
# DISPLAY ACTION PLAN
# ============================================================

print("\n==============================================")
print("          PRIORITY ACTION PLAN")
print("==============================================")


for recommendation in recommendations:

    if recommendation["priority"] == 99:

        print(
            "\nPRIORITY: CONTINUOUS MONITORING"
        )

    else:

        print(
            f"\nPRIORITY {recommendation['priority']} "
            f"— {recommendation['area']}"
        )

    print("\nAction:")

    print(
        recommendation["action"]
    )

    print("\nResponsible Authority:")

    print(
        recommendation["responsible"]
    )

    print("\nExpected Outcome:")

    print(
        recommendation["expected"]
    )


# ============================================================
# PARCEL SUMMARY
# ============================================================

cursor.execute(
    """
    SELECT
        COUNT(*) AS total,
        SUM(
            CASE
                WHEN legal_dispute = 1
                OR ownership_conflict = 1
                OR compensation_completion_percent < 50
                OR documentation_completion_percent < 50
                OR possession_percent < 50
                THEN 1
                ELSE 0
            END
        ) AS high_attention
    FROM parcels
    WHERE project_id = ?
    """,
    (project_id,)
)

parcel_summary = cursor.fetchone()


print("\n==============================================")
print("          PARCEL-LEVEL WARNING")
print("==============================================")

print(
    "Total parcels:",
    parcel_summary["total"]
)

print(
    "Parcels requiring immediate attention:",
    parcel_summary["high_attention"]
)


# ============================================================
# TOP RISK PARCELS
# ============================================================

cursor.execute(
    """
    SELECT
        plot_id,
        survey_number,
        compensation_completion_percent,
        documentation_completion_percent,
        possession_percent,
        legal_dispute,
        ownership_conflict
    FROM parcels
    WHERE project_id = ?
    """,
    (project_id,)
)

parcel_rows = cursor.fetchall()

parcel_risks = []


for parcel in parcel_rows:

    score = 0

    if parcel["legal_dispute"] == 1:
        score += 20

    if parcel["ownership_conflict"] == 1:
        score += 15

    if parcel[
        "compensation_completion_percent"
    ] < 50:
        score += 15

    if parcel[
        "documentation_completion_percent"
    ] < 50:
        score += 15

    if parcel[
        "possession_percent"
    ] < 50:
        score += 15

    parcel_risks.append({

        "plot_id":
            parcel["plot_id"],

        "survey_number":
            parcel["survey_number"],

        "score":
            score
    })


parcel_risks.sort(
    key=lambda x: x["score"],
    reverse=True
)


print("\nTop 5 parcels requiring attention:")

for parcel in parcel_risks[:5]:

    print(
        f"\nPlot: {parcel['plot_id']}"
    )

    print(
        f"Survey Number: {parcel['survey_number']}"
    )

    print(
        f"Attention Score: {parcel['score']}/80"
    )


# ============================================================
# CLOSE DATABASE
# ============================================================

connection.close()


print("\n==============================================")
print("       PROJECT ANALYSIS COMPLETED")
print("==============================================")