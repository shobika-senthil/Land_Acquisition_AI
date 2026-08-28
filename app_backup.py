from flask import Flask, jsonify
from flask_cors import CORS

import sqlite3
import os
import joblib
import pandas as pd


# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "land_acquisition.db")

MODEL_PATH = os.path.join(BASE_DIR, "data", "land_delay_model.joblib")


# ============================================================
# LOAD AI MODEL
# ============================================================

model = None

try:

    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("AI model loaded successfully.")
    else:
        print("AI model not found at:", MODEL_PATH)

except Exception as e:
    print("AI model loading error:", e)


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():

    connection = sqlite3.connect(DB_PATH)

    connection.row_factory = sqlite3.Row

    return connection


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():

    return jsonify({

        "message":
            "Land Acquisition AI API",

        "status":
            "running",

        "database":
            DB_PATH,

        "ai_model":
            "loaded"
            if model is not None
            else "not loaded"

    })


# ============================================================
# GET PROJECT
# ============================================================

@app.route(
    "/projects/<project_id>",
    methods=["GET"]
)
def get_project(project_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM projects
        WHERE project_id = ?
    """, (project_id,))

    project = cursor.fetchone()

    connection.close()

    if project is None:

        return jsonify({
            "error":
                "Project not found"
        }), 404

    return jsonify(
        dict(project)
    )


# ============================================================
# AI PREDICTION HELPER
# ============================================================

def predict_project(project):

    if model is None:

        return None

    project_data = pd.DataFrame([{

        "Project_Type":
            project["project_type"],

        "State":
            project["state"],

        "District":
            project["district"],

        "Land_Area_Hectares":
            project["land_area_hectares"],

        "Total_Parcels":
            project["total_parcels"],

        "Affected_Families":
            project["affected_families"],

        "Required_Approvals":
            project["required_approvals"],

        "Completed_Approvals":
            project["completed_approvals"],

        "Pending_Approvals":
            project["pending_approvals"],

        "Approval_Delay_Days":
            project["approval_delay_days"],

        "Legal_Disputes":
            project["legal_disputes"],

        "Ownership_Conflicts":
            project["ownership_conflicts"],

        "Total_Compensation_Cases":
            project["total_compensation_cases"],

        "Compensation_Paid_Cases":
            project["compensation_paid_cases"],

        "Compensation_Completion_Percent":
            project[
                "compensation_completion_percent"
            ],

        "Compensation_Delay_Days":
            project["compensation_delay_days"],

        "Documents_Required":
            project["documents_required"],

        "Documents_Completed":
            project["documents_completed"],

        "Documentation_Completion_Percent":
            project[
                "documentation_completion_percent"
            ],

        "Families_Requiring_RR":
            project["families_requiring_rr"],

        "Families_Rehabilitated":
            project["families_rehabilitated"],

        "RR_Completion_Percent":
            project[
                "rr_completion_percent"
            ],

        "Parcels_Required":
            project["parcels_required"],

        "Parcels_Possessed":
            project["parcels_possessed"],

        "Possession_Percent":
            project["possession_percent"],

        "Stakeholder_Response_Rate":
            project[
                "stakeholder_response_rate"
            ],

        "Current_Stage":
            project["current_stage"],

        "Planned_Duration_Days":
            project["planned_duration_days"],

        "Elapsed_Days":
            project["elapsed_days"]

    }])

    probability = model.predict_proba(
        project_data
    )[0][1]

    probability_percent = round(
        probability * 100,
        2
    )

    if probability >= 0.80:

        risk_level = "CRITICAL"

    elif probability >= 0.60:

        risk_level = "HIGH"

    elif probability >= 0.40:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"

    return {

        "delay_probability":
            probability_percent,

        "risk_level":
            risk_level

    }


# ============================================================
# PROJECT AI PREDICTION
# ============================================================

@app.route(
    "/projects/<project_id>/prediction",
    methods=["GET"]
)
def project_prediction(project_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM projects
        WHERE project_id = ?
    """, (project_id,))

    project = cursor.fetchone()

    connection.close()

    if project is None:

        return jsonify({
            "error":
                "Project not found"
        }), 404

    prediction = predict_project(
        project
    )

    return jsonify({

        "project_id":
            project_id,

        "project_type":
            project["project_type"],

        "state":
            project["state"],

        "district":
            project["district"],

        "ai_prediction":
            prediction

    })


# ============================================================
# EXPLAINABLE AI - DELAY DRIVERS
# ============================================================

@app.route(
    "/projects/<project_id>/explanation",
    methods=["GET"]
)
def explain_project(project_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM projects
        WHERE project_id = ?
    """, (project_id,))

    project = cursor.fetchone()

    connection.close()

    if project is None:

        return jsonify({
            "error":
                "Project not found"
        }), 404

    drivers = []

    # --------------------------------------------------------
    # APPROVALS
    # --------------------------------------------------------

    if project["pending_approvals"] > 0:

        impact = "HIGH"

        if project["pending_approvals"] >= 4:
            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Pending Approvals",

            "current_status":
                project[
                    "pending_approvals"
                ],

            "impact":
                impact,

            "reason":
                "Pending approvals can block subsequent land acquisition activities."

        })

    # --------------------------------------------------------
    # APPROVAL DELAY
    # --------------------------------------------------------

    if project["approval_delay_days"] > 0:

        impact = "MEDIUM"

        if project[
            "approval_delay_days"
        ] >= 30:

            impact = "HIGH"

        drivers.append({

            "factor":
                "Approval Delay",

            "current_status":
                project[
                    "approval_delay_days"
                ],

            "unit":
                "days",

            "impact":
                impact,

            "reason":
                "Delayed approvals can postpone dependent acquisition activities."

        })

    # --------------------------------------------------------
    # COMPENSATION
    # --------------------------------------------------------

    compensation = project[
        "compensation_completion_percent"
    ]

    if compensation < 80:

        impact = "MEDIUM"

        if compensation < 60:
            impact = "HIGH"

        if compensation < 40:
            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Compensation",

            "current_status":
                compensation,

            "unit":
                "percent completed",

            "impact":
                impact,

            "reason":
                "Incomplete compensation can prevent acquisition cases from being closed."

        })

    # --------------------------------------------------------
    # LEGAL DISPUTES
    # --------------------------------------------------------

    if project["legal_disputes"] > 0:

        impact = "HIGH"

        if project[
            "legal_disputes"
        ] >= 3:

            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Legal Disputes",

            "current_status":
                project[
                    "legal_disputes"
                ],

            "impact":
                impact,

            "reason":
                "Pending legal disputes can prevent completion of affected land acquisition cases."

        })

    # --------------------------------------------------------
    # OWNERSHIP CONFLICTS
    # --------------------------------------------------------

    if project[
        "ownership_conflicts"
    ] > 0:

        drivers.append({

            "factor":
                "Ownership Conflicts",

            "current_status":
                project[
                    "ownership_conflicts"
                ],

            "impact":
                "HIGH",

            "reason":
                "Conflicting ownership claims can delay verification and acquisition."

        })

    # --------------------------------------------------------
    # DOCUMENTATION
    # --------------------------------------------------------

    documentation = project[
        "documentation_completion_percent"
    ]

    if documentation < 80:

        impact = "MEDIUM"

        if documentation < 60:
            impact = "HIGH"

        if documentation < 40:
            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Documentation",

            "current_status":
                documentation,

            "unit":
                "percent completed",

            "impact":
                impact,

            "reason":
                "Incomplete documentation can delay verification, processing and approvals."

        })

    # --------------------------------------------------------
    # R&R
    # --------------------------------------------------------

    rr = project[
        "rr_completion_percent"
    ]

    if rr < 80:

        impact = "MEDIUM"

        if rr < 60:
            impact = "HIGH"

        if rr < 40:
            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Rehabilitation & Resettlement",

            "current_status":
                rr,

            "unit":
                "percent completed",

            "impact":
                impact,

            "reason":
                "Low R&R completion can create social and administrative bottlenecks."

        })

    # --------------------------------------------------------
    # LAND POSSESSION
    # --------------------------------------------------------

    possession = project[
        "possession_percent"
    ]

    if possession < 80:

        impact = "MEDIUM"

        if possession < 50:
            impact = "HIGH"

        if possession < 30:
            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Land Possession",

            "current_status":
                possession,

            "unit":
                "percent completed",

            "impact":
                impact,

            "reason":
                "Insufficient land possession can directly affect physical project implementation."

        })

    # --------------------------------------------------------
    # STAKEHOLDER RESPONSE
    # --------------------------------------------------------

    response = project[
        "stakeholder_response_rate"
    ]

    if response < 80:

        impact = "MEDIUM"

        if response < 60:
            impact = "HIGH"

        if response < 40:
            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Stakeholder Response",

            "current_status":
                response,

            "unit":
                "percent",

            "impact":
                impact,

            "reason":
                "Low stakeholder response can increase communication and resolution delays."

        })

    # --------------------------------------------------------
    # SORT BY IMPACT
    # --------------------------------------------------------

    impact_order = {

        "VERY HIGH": 4,
        "HIGH": 3,
        "MEDIUM": 2,
        "LOW": 1

    }

    drivers.sort(

        key=lambda x:
            impact_order.get(
                x["impact"],
                0
            ),

        reverse=True

    )

    # --------------------------------------------------------
    # AI PREDICTION
    # --------------------------------------------------------

    prediction = predict_project(
        project
    )

    return jsonify({

        "project_id":
            project_id,

        "project_type":
            project["project_type"],

        "state":
            project["state"],

        "district":
            project["district"],

        "ai_prediction":
            prediction,

        "delay_drivers_count":
            len(drivers),

        "delay_drivers":
            drivers

    })


# ============================================================
# STATE-WISE ANALYTICS
# ============================================================

@app.route(
    "/analytics/state/<state>",
    methods=["GET"]
)
def state_analytics(state):

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------------------------
    # PROJECT COUNT
    # --------------------------------------------------------

    cursor.execute("""
        SELECT
            COUNT(*) AS total_projects
        FROM projects
        WHERE LOWER(state) = LOWER(?)
    """, (state,))

    result = cursor.fetchone()

    total_projects = (
        result["total_projects"]
        or 0
    )

    # --------------------------------------------------------
    # DELAYED PROJECTS
    # --------------------------------------------------------

    cursor.execute("""
        SELECT
            COUNT(*) AS delayed_projects
        FROM projects
        WHERE LOWER(state) = LOWER(?)
        AND delayed = 1
    """, (state,))

    result = cursor.fetchone()

    delayed_projects = (
        result["delayed_projects"]
        or 0
    )

    # --------------------------------------------------------
    # DISTRICT BREAKDOWN
    # --------------------------------------------------------

    cursor.execute("""
        SELECT
            district,
            COUNT(*) AS project_count
        FROM projects
        WHERE LOWER(state) = LOWER(?)
        GROUP BY district
        ORDER BY project_count DESC
    """, (state,))

    districts = cursor.fetchall()

    connection.close()

    return jsonify({

        "state":
            state,

        "total_projects":
            total_projects,

        "delayed_projects":
            delayed_projects,

        "districts": [

            {

                "district":
                    row["district"],

                "project_count":
                    row["project_count"]

            }

            for row in districts

        ]

    })


# ============================================================
# DISTRICT-WISE ANALYTICS
# ============================================================

@app.route(
    "/analytics/district/<state>/<district>",
    methods=["GET"]
)
def district_analytics(
    state,
    district
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            COUNT(*) AS total_projects
        FROM projects
        WHERE LOWER(state) = LOWER(?)
        AND LOWER(district) = LOWER(?)
    """, (
        state,
        district
    ))

    result = cursor.fetchone()

    total_projects = (
        result["total_projects"]
        or 0
    )

    # --------------------------------------------------------
    # DELAYED PROJECTS
    # --------------------------------------------------------

    cursor.execute("""
        SELECT
            COUNT(*) AS delayed_projects
        FROM projects
        WHERE LOWER(state) = LOWER(?)
        AND LOWER(district) = LOWER(?)
        AND delayed = 1
    """, (
        state,
        district
    ))

    result = cursor.fetchone()

    delayed_projects = (
        result["delayed_projects"]
        or 0
    )

    # --------------------------------------------------------
    # PROJECT LIST
    # --------------------------------------------------------

    cursor.execute("""
        SELECT
            project_id,
            project_type,
            current_stage
        FROM projects
        WHERE LOWER(state) = LOWER(?)
        AND LOWER(district) = LOWER(?)
        ORDER BY project_id
    """, (
        state,
        district
    ))

    projects = cursor.fetchall()

    connection.close()

    return jsonify({

        "state":
            state,

        "district":
            district,

        "total_projects":
            total_projects,

        "delayed_projects":
            delayed_projects,

        "projects": [

            {

                "project_id":
                    row["project_id"],

                "project_type":
                    row["project_type"],

                "current_stage":
                    row["current_stage"]

            }

            for row in projects

        ]

    })


# ============================================================
# ALL STATES ANALYTICS
# ============================================================

@app.route(
    "/analytics/states",
    methods=["GET"]
)
def all_states():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            state,
            COUNT(*) AS total_projects,

            SUM(
                CASE
                    WHEN delayed = 1
                    THEN 1
                    ELSE 0
                END
            ) AS delayed_projects

        FROM projects

        GROUP BY state

        ORDER BY total_projects DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    return jsonify({

        "states": [

            {

                "state":
                    row["state"],

                "total_projects":
                    row["total_projects"],

                "delayed_projects":
                    row["delayed_projects"]
                    or 0

            }

            for row in rows

        ]

    })


# ============================================================
# ALL DISTRICTS ANALYTICS
# ============================================================

@app.route(
    "/analytics/districts",
    methods=["GET"]
)
def all_districts():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            state,
            district,
            COUNT(*) AS total_projects,

            SUM(
                CASE
                    WHEN delayed = 1
                    THEN 1
                    ELSE 0
                END
            ) AS delayed_projects

        FROM projects

        GROUP BY state, district

        ORDER BY total_projects DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    return jsonify({

        "districts": [

            {

                "state":
                    row["state"],

                "district":
                    row["district"],

                "total_projects":
                    row["total_projects"],

                "delayed_projects":
                    row["delayed_projects"]
                    or 0

            }

            for row in rows

        ]

    })


# ============================================================
# PROJECT COUNT
# ============================================================

@app.route(
    "/analytics/summary",
    methods=["GET"]
)
def analytics_summary():

    connection = get_connection()
    cursor = connection.cursor()

    # Total projects

    cursor.execute("""
        SELECT COUNT(*) AS count
        FROM projects
    """)

    total_projects = (
        cursor.fetchone()["count"]
    )

    # Total delayed projects

    cursor.execute("""
        SELECT COUNT(*) AS count
        FROM projects
        WHERE delayed = 1
    """)

    delayed_projects = (
        cursor.fetchone()["count"]
    )

    # Total states

    cursor.execute("""
        SELECT COUNT(
            DISTINCT state
        ) AS count
        FROM projects
    """)

    total_states = (
        cursor.fetchone()["count"]
    )

    # Total districts

    cursor.execute("""
        SELECT COUNT(
            DISTINCT district
        ) AS count
        FROM projects
    """)

    total_districts = (
        cursor.fetchone()["count"]
    )

    connection.close()

    return jsonify({

        "total_projects":
            total_projects,

        "delayed_projects":
            delayed_projects,

        "total_states":
            total_states,

        "total_districts":
            total_districts

    })


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    print("\n==============================================")
    print("       LAND ACQUISITION AI API")
    print("==============================================")

    print(
        "\nDatabase:",
        DB_PATH
    )

    print(
        "AI Model:",
        "Loaded"
        if model is not None
        else "Not Loaded"
    )

    print("\nServer:")
    print(
        "http://127.0.0.1:5000"
    )

    print("\n==============================================")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )