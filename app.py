from flask import Flask, jsonify, request
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

DB_PATH = os.path.join(
    BASE_DIR,
    "data",
    "land_acquisition.db"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "data",
    "land_delay_model.joblib"
)


# ============================================================
# LOAD AI MODEL
# ============================================================

model = None

try:

    if os.path.exists(MODEL_PATH):

        model = joblib.load(MODEL_PATH)

        print("AI model loaded successfully.")

    else:

        print(
            "AI model not found at:",
            MODEL_PATH
        )

except Exception as e:

    print(
        "AI model loading error:",
        e
    )


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():

    connection = sqlite3.connect(
        DB_PATH
    )

    connection.row_factory = sqlite3.Row

    return connection


# ============================================================
# FRONTEND HOME
# ============================================================

@app.route("/")
def home():
    return jsonify({
        "message": "Land Acquisition AI API",
        "status": "running",
        "frontend": "Run the React/Vite frontend separately",
        "api_status": "/api/status",
        "projects_api": "/api/projects"
    })



# ============================================================
# REACT FRONTEND PROJECT API
# ============================================================

def normalize_sector(project_type):
    value = (project_type or "").strip().lower()
    mapping = {
        "highway": "Highway Corridor",
        "highway corridor": "Highway Corridor",
        "road": "Highway Corridor",
        "road project": "Highway Corridor",
        "nhai": "Highway Corridor",
        "rail": "High-Speed Rail",
        "railway": "High-Speed Rail",
        "high speed rail": "High-Speed Rail",
        "industrial": "Industrial Park",
        "industrial park": "Industrial Park",
        "renewable": "Renewable Energy",
        "renewable energy": "Renewable Energy",
        "solar": "Renewable Energy",
        "wind": "Renewable Energy",
        "irrigation": "Water Canal",
        "water": "Water Canal",
        "water canal": "Water Canal",
        "canal": "Water Canal",
        "urban transit": "Urban Transit",
        "metro": "Urban Transit",
        "transit": "Urban Transit",
        "urban": "Urban Transit",
    }
    return mapping.get(value, project_type or "Highway Corridor")


def frontend_status(project):
    if project["delayed"]:
        return "Delayed"

    value = (project["current_stage"] or "").strip().lower()

    mapping = {
        "pre-acquisition": "Pre-Acquisition",
        "pre acquisition": "Pre-Acquisition",
        "survey": "Surveying",
        "surveying": "Surveying",
        "cadastral survey": "Surveying",
        "compensation": "Disbursement",
        "disbursement": "Disbursement",
        "possession": "Possession",
        "land possession": "Possession",
        "completed": "On Track",
        "complete": "On Track",
        "on track": "On Track",
        "in progress": "In Progress",
    }

    return mapping.get(value, "In Progress")


def database_risk_score(project):
    actual_delay = float(project["actual_delay_days"] or 0)
    approval_delay = float(project["approval_delay_days"] or 0)

    if actual_delay >= 60:
        return 85.0
    if actual_delay > 0:
        return 70.0
    if approval_delay >= 30:
        return 65.0
    if approval_delay > 0:
        return 50.0
    return 25.0


def frontend_project(project):
    total_parcels = int(project["total_parcels"] or 0)
    acquired = int(project["parcels_possessed"] or 0)

    possession = project["possession_percent"]
    if possession is None:
        possession = (
            acquired / total_parcels * 100
            if total_parcels else 0
        )

    risk_score = database_risk_score(project)

    if risk_score >= 80:
        risk_level = "CRITICAL"
    elif risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    coordinates = [20.5937, 78.9629]

    return {
        "id": project["project_id"],
        "name": (
            f'{project["project_type"]} Project - '
            f'{project["district"]}'
        ),
        "code": project["project_id"],
        "sector": normalize_sector(project["project_type"]),
        "state": project["state"],
        "district": project["district"],
        "lengthKm": float(project["land_area_hectares"] or 0),
        "totalParcels": total_parcels,
        "acquiredParcels": acquired,
        "riskScore": risk_score,
        "delayProbability": risk_score,
        "riskLevel": risk_level,
        "status": frontend_status(project),
        "estimatedDelayMonths": round(
            float(project["actual_delay_days"] or 0) / 30,
            1
        ),
        "budgetCr": 0,
        "startDate": "",
        "targetCompletion": "",
        "topDelayDriver": (
            project["primary_delay_reason"]
            or "No major delay driver identified"
        ),
        "coordinates": coordinates,
        "corridorPath": [coordinates],
        "timeline": [],
        "affectedParcelsCount": total_parcels,
        "criticalParcelsCount": max(total_parcels - acquired, 0),
        "summary": (
            f'{project["project_type"]} land acquisition project '
            f'in {project["district"]}, {project["state"]}. '
            f'Land possession is {round(float(possession or 0), 1)}%.'
        ),
    }


@app.route("/api/projects", methods=["GET"])
def api_projects():
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT *
        FROM projects
        WHERE 1 = 1
    """
    params = []

    state = request.args.get("state")
    district = request.args.get("district")
    sector = request.args.get("sector")
    status = request.args.get("status")
    risk_level = request.args.get("riskLevel")
    search = request.args.get("query")

    if state and state != "All":
        query += " AND LOWER(state) = LOWER(?)"
        params.append(state)

    if district and district != "All":
        query += " AND LOWER(district) = LOWER(?)"
        params.append(district)

    if sector and sector != "All":
        sector_types = {
            "Highway Corridor": [
                "Highway", "Highway Corridor", "Road",
                "Road Project", "NHAI"
            ],
            "High-Speed Rail": [
                "Rail", "Railway", "High Speed Rail"
            ],
            "Industrial Park": [
                "Industrial", "Industrial Park"
            ],
            "Renewable Energy": [
                "Renewable", "Renewable Energy", "Solar", "Wind"
            ],
            "Water Canal": [
                "Irrigation", "Water", "Water Canal", "Canal"
            ],
            "Urban Transit": [
                "Urban Transit", "Metro", "Transit", "Urban"
            ],
        }

        allowed = sector_types.get(sector)

        if allowed:
            placeholders = ",".join(["?"] * len(allowed))
            query += f" AND project_type IN ({placeholders})"
            params.extend(allowed)
        else:
            query += " AND LOWER(project_type) = LOWER(?)"
            params.append(sector)

    if status and status != "All":
        if status == "Delayed":
            query += " AND delayed = 1"

        elif status == "On Track":
            query += """
                AND delayed = 0
                AND actual_delay_days = 0
            """

        elif status == "In Progress":
            query += """
                AND delayed = 0
                AND LOWER(current_stage) NOT IN (
                    'completed', 'complete'
                )
            """

        else:
            stage_map = {
                "Pre-Acquisition": [
                    "Pre-Acquisition", "Pre Acquisition"
                ],
                "Surveying": [
                    "Survey", "Surveying", "Cadastral Survey"
                ],
                "Disbursement": [
                    "Compensation", "Disbursement"
                ],
                "Possession": [
                    "Possession", "Land Possession"
                ],
            }

            stages = stage_map.get(status)

            if stages:
                placeholders = ",".join(["?"] * len(stages))
                query += f"""
                    AND LOWER(current_stage) IN (
                        {",".join(["LOWER(?)"] * len(stages))}
                    )
                """
                params.extend(stages)

    if search:
        value = f"%{search}%"
        query += """
            AND (
                LOWER(project_id) LIKE LOWER(?)
                OR LOWER(project_type) LIKE LOWER(?)
                OR LOWER(state) LIKE LOWER(?)
                OR LOWER(district) LIKE LOWER(?)
            )
        """
        params.extend([value, value, value, value])

    query += " ORDER BY project_id"

    try:
        cursor.execute(query, params)
        rows = cursor.fetchall()
    finally:
        connection.close()

    projects = [frontend_project(row) for row in rows]

    if risk_level and risk_level != "All":
        projects = [
            p for p in projects
            if p["riskLevel"] == risk_level
        ]

    return jsonify(projects)


@app.route("/api/projects/<project_id>", methods=["GET"])
def api_project_by_id(project_id):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT *
            FROM projects
            WHERE LOWER(project_id) = LOWER(?)
            """,
            (project_id,)
        )
        project = cursor.fetchone()
    finally:
        connection.close()

    if project is None:
        return jsonify({"error": "Project not found"}), 404

    return jsonify(frontend_project(project))



# ============================================================
# PARCEL API
# ============================================================

def parcel_row_to_frontend(row):
    """
    Convert a parcel database row to the field names expected
    by the React frontend.

    If the database does not contain polygon geometry, create a
    small illustrative boundary around the parcel center so the
    GIS frontend can render a visible plot. These generated
    boundaries are NOT real cadastral/legal boundaries.
    """
    data = dict(row)

    def first_value(*names, default=None):
        for name in names:
            if name in data and data[name] is not None:
                return data[name]
        return default

    project_id = first_value("project_id", "projectId", default="")
    parcel_id = first_value("parcel_id", "id", "parcelId", default="")
    plot_id = first_value(
        "plot_id", "plotId", "plot_number", "plotNumber", default=parcel_id
    )
    survey_number = first_value(
        "survey_number", "surveyNumber", "survey_no", "surveyNo", default=""
    )
    village = first_value("village", "village_name", "villageName", default="")
    taluk = first_value("taluk", "taluk_name", "talukName", default="")
    area_acres = first_value("area_acres", "areaAcres", "acres", default=0)
    ownership_type = first_value(
        "ownership_type", "ownershipType", default="Unknown"
    )
    owner_count = first_value("owner_count", "ownerCount", default=0)
    legal_dispute_count = first_value(
        "legal_dispute_count",
        "legalDisputeCount",
        "legal_disputes",
        "legalDisputes",
        default=0,
    )
    risk_score = first_value("risk_score", "riskScore", default=None)
    risk_level = first_value("risk_level", "riskLevel", default=None)

    if risk_level is None:
        if risk_score is not None:
            try:
                score = float(risk_score)
                if score >= 80:
                    risk_level = "CRITICAL"
                elif score >= 65:
                    risk_level = "HIGH"
                elif score >= 40:
                    risk_level = "MODERATE"
                else:
                    risk_level = "LOW"
            except (TypeError, ValueError):
                risk_level = "LOW"
        else:
            risk_level = "LOW"

    latitude = first_value("latitude", "lat", default=20.5937)
    longitude = first_value(
        "longitude", "lng", "lon", default=78.9629
    )

    try:
        latitude = float(latitude)
    except (TypeError, ValueError):
        latitude = 20.5937

    try:
        longitude = float(longitude)
    except (TypeError, ValueError):
        longitude = 78.9629

    try:
        area_acres = float(area_acres or 0)
    except (TypeError, ValueError):
        area_acres = 0

    try:
        owner_count = int(owner_count or 0)
    except (TypeError, ValueError):
        owner_count = 0

    try:
        legal_dispute_count = int(legal_dispute_count or 0)
    except (TypeError, ValueError):
        legal_dispute_count = 0

    # Use real geometry if the database already has it.
    boundary_polygon = first_value(
        "boundary_polygon",
        "boundaryPolygon",
        "polygon",
        "geometry",
        default=None,
    )

    # Otherwise create a small illustrative plot around the center.
    # This is only for visualization and is not a legal parcel boundary.
    if not boundary_polygon:
        size = 0.0015
        boundary_polygon = [
            [latitude - size, longitude - size],
            [latitude - size, longitude + size],
            [latitude + size, longitude + size],
            [latitude + size, longitude - size],
            [latitude - size, longitude - size],
        ]

    result = {
        "id": str(parcel_id),
        "projectId": str(project_id),
        "plotId": str(plot_id),
        "surveyNumber": str(survey_number),
        "village": str(village),
        "taluk": str(taluk),
        "areaAcres": area_acres,
        "ownershipType": str(ownership_type),
        "ownerCount": owner_count,
        "legalDisputeCount": legal_dispute_count,
        "riskLevel": str(risk_level).upper(),
        "coordinates": [latitude, longitude],
        "boundaryPolygon": boundary_polygon,
    }

    if risk_score is not None:
        try:
            result["riskScore"] = float(risk_score)
        except (TypeError, ValueError):
            pass

    return result

def get_parcel_table(cursor):
    """
    Find an existing parcel table in the database.
    """
    cursor.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        ORDER BY name
    """)

    tables = [
        row["name"]
        for row in cursor.fetchall()
    ]

    preferred = [
        "parcels",
        "parcel",
        "land_parcels",
        "land_parcel",
        "cadastral_parcels"
    ]

    for table in preferred:
        if table in tables:
            return table

    for table in tables:
        if "parcel" in table.lower():
            return table

    return None


@app.route("/api/parcels", methods=["GET"])
def api_parcels():
    """
    Return parcels from the existing database.

    Optional filters:
      /api/parcels?projectId=P00001
      /api/parcels?project_id=P00001
    """
    connection = get_connection()
    cursor = connection.cursor()

    try:
        table = get_parcel_table(cursor)

        if table is None:
            return jsonify({
                "success": True,
                "count": 0,
                "parcels": [],
                "message": "No parcel table found in database."
            })

        # SQLite table names cannot be parameterized, so quote the
        # discovered table identifier safely.
        quoted_table = '"' + table.replace('"', '""') + '"'

        project_id = (
            request.args.get("projectId")
            or request.args.get("project_id")
        )

        if project_id:
            cursor.execute(
                f"SELECT * FROM {quoted_table}"
            )
            rows = cursor.fetchall()

            parcels = [
                parcel_row_to_frontend(row)
                for row in rows
                if str(
                    dict(row).get("project_id", "")
                ).lower() == str(project_id).lower()
            ]
        else:
            cursor.execute(
                f"SELECT * FROM {quoted_table}"
            )
            rows = cursor.fetchall()

            parcels = [
                parcel_row_to_frontend(row)
                for row in rows
            ]

        return jsonify({
            "success": True,
            "count": len(parcels),
            "parcels": parcels
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "count": 0,
            "parcels": []
        }), 500

    finally:
        connection.close()


@app.route(
    "/api/parcels/project/<project_id>",
    methods=["GET"]
)
def api_parcels_by_project(project_id):
    """
    Return parcels belonging to one project.
    """
    connection = get_connection()
    cursor = connection.cursor()

    try:
        table = get_parcel_table(cursor)

        if table is None:
            return jsonify({
                "success": True,
                "count": 0,
                "parcels": [],
                "message": "No parcel table found in database."
            })

        quoted_table = '"' + table.replace('"', '""') + '"'

        cursor.execute(
            f"SELECT * FROM {quoted_table}"
        )

        rows = cursor.fetchall()

        parcels = []

        for row in rows:
            data = dict(row)

            row_project_id = (
                data.get("project_id")
                or data.get("projectId")
            )

            if (
                row_project_id is not None
                and str(row_project_id).lower()
                == str(project_id).lower()
            ):
                parcels.append(
                    parcel_row_to_frontend(row)
                )

        return jsonify({
            "success": True,
            "project_id": project_id,
            "count": len(parcels),
            "parcels": parcels
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "project_id": project_id,
            "error": str(e),
            "count": 0,
            "parcels": []
        }), 500

    finally:
        connection.close()


@app.route(
    "/api/parcels/<parcel_id>",
    methods=["GET"]
)
def api_parcel_by_id(parcel_id):
    """
    Return one parcel by ID, plot ID, or survey number.
    """
    connection = get_connection()
    cursor = connection.cursor()

    try:
        table = get_parcel_table(cursor)

        if table is None:
            return jsonify({
                "error": "No parcel table found in database."
            }), 404

        quoted_table = '"' + table.replace('"', '""') + '"'

        cursor.execute(
            f"SELECT * FROM {quoted_table}"
        )

        rows = cursor.fetchall()

        for row in rows:
            data = dict(row)

            possible_ids = [
                data.get("parcel_id"),
                data.get("id"),
                data.get("parcelId"),
                data.get("plot_id"),
                data.get("plotId"),
                data.get("survey_number"),
                data.get("surveyNumber"),
                data.get("survey_no"),
                data.get("surveyNo")
            ]

            if any(
                value is not None
                and str(value).lower()
                == str(parcel_id).lower()
                for value in possible_ids
            ):
                return jsonify(
                    parcel_row_to_frontend(row)
                )

        return jsonify({
            "error": "Parcel not found"
        }), 404

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        connection.close()


# ============================================================
# API STATUS
# ============================================================

@app.route("/api/status")
def api_status():

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
                project["pending_approvals"],

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

        if project["approval_delay_days"] >= 30:

            impact = "HIGH"

        drivers.append({

            "factor":
                "Approval Delay",

            "current_status":
                project["approval_delay_days"],

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

        if project["legal_disputes"] >= 3:

            impact = "VERY HIGH"

        drivers.append({

            "factor":
                "Legal Disputes",

            "current_status":
                project["legal_disputes"],

            "impact":
                impact,

            "reason":
                "Pending legal disputes can prevent completion of affected land acquisition cases."

        })

    # --------------------------------------------------------
    # OWNERSHIP CONFLICTS
    # --------------------------------------------------------

    if project["ownership_conflicts"] > 0:

        drivers.append({

            "factor":
                "Ownership Conflicts",

            "current_status":
                project["ownership_conflicts"],

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
# GIS PROJECT DATA
# ============================================================

@app.route(
    "/gis/projects",
    methods=["GET"]
)
def gis_projects():

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------------------------
    # OPTIONAL FILTERS
    # --------------------------------------------------------

    state = request.args.get("state")
    district = request.args.get("district")
    project_type = request.args.get("project_type")

    query = """
        SELECT *
        FROM projects
        WHERE 1 = 1
    """

    params = []

    if state:
        query += """
            AND LOWER(state) = LOWER(?)
        """
        params.append(state)

    if district:
        query += """
            AND LOWER(district) = LOWER(?)
        """
        params.append(district)

    if project_type:
        query += """
            AND LOWER(project_type) = LOWER(?)
        """
        params.append(project_type)

    query += """
        ORDER BY project_id
    """

    cursor.execute(
        query,
        params
    )

    rows = cursor.fetchall()

    connection.close()

    projects = []

    for row in rows:

        # ----------------------------------------------------
        # AI RISK
        # ----------------------------------------------------

        prediction = predict_project(row)

        if prediction is None:
            delay_probability = None
            risk_level = "UNKNOWN"

        else:
            delay_probability = prediction[
                "delay_probability"
            ]

            risk_level = prediction[
                "risk_level"
            ]

        # ----------------------------------------------------
        # GIS RESPONSE OBJECT
        # ----------------------------------------------------

        projects.append({

            "project_id":
                row["project_id"],

            "project_type":
                row["project_type"],

            "state":
                row["state"],

            "district":
                row["district"],

            "land_area_hectares":
                row["land_area_hectares"],

            "total_parcels":
                row["total_parcels"],

            "affected_families":
                row["affected_families"],

            "current_stage":
                row["current_stage"],

            "delayed":
                row["delayed"],

            "actual_delay_days":
                row["actual_delay_days"],

            "primary_delay_reason":
                row["primary_delay_reason"],

            "legal_disputes":
                row["legal_disputes"],

            "ownership_conflicts":
                row["ownership_conflicts"],

            "compensation_completion_percent":
                row[
                    "compensation_completion_percent"
                ],

            "documentation_completion_percent":
                row[
                    "documentation_completion_percent"
                ],

            "rr_completion_percent":
                row[
                    "rr_completion_percent"
                ],

            "possession_percent":
                row[
                    "possession_percent"
                ],

            "stakeholder_response_rate":
                row[
                    "stakeholder_response_rate"
                ],

            "delay_probability":
                delay_probability,

            "risk_level":
                risk_level
        })

    return jsonify({

        "success": True,

        "count":
            len(projects),

        "projects":
            projects
    })


# ============================================================
# GIS SUMMARY
# ============================================================

@app.route(
    "/gis/summary",
    methods=["GET"]
)
def gis_summary():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            COUNT(*) AS total_projects,

            SUM(
                CASE
                    WHEN delayed = 1
                    THEN 1
                    ELSE 0
                END
            ) AS delayed_projects,

            COUNT(
                DISTINCT state
            ) AS total_states,

            COUNT(
                DISTINCT district
            ) AS total_districts,

            SUM(
                total_parcels
            ) AS total_parcels,

            SUM(
                affected_families
            ) AS affected_families,

            SUM(
                legal_disputes
            ) AS legal_disputes,

            SUM(
                ownership_conflicts
            ) AS ownership_conflicts

        FROM projects
    """)

    row = cursor.fetchone()

    connection.close()

    return jsonify({

        "success": True,

        "total_projects":
            row["total_projects"] or 0,

        "delayed_projects":
            row["delayed_projects"] or 0,

        "total_states":
            row["total_states"] or 0,

        "total_districts":
            row["total_districts"] or 0,

        "total_parcels":
            row["total_parcels"] or 0,

        "affected_families":
            row["affected_families"] or 0,

        "legal_disputes":
            row["legal_disputes"] or 0,

        "ownership_conflicts":
            row["ownership_conflicts"] or 0
    })


# ============================================================
# GIS STATE DATA
# ============================================================

@app.route(
    "/gis/states",
    methods=["GET"]
)
def gis_states():

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
            ) AS delayed_projects,

            SUM(total_parcels)
                AS total_parcels,

            SUM(affected_families)
                AS affected_families,

            AVG(
                stakeholder_response_rate
            ) AS stakeholder_response_rate

        FROM projects

        GROUP BY state

        ORDER BY total_projects DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    states = []

    for row in rows:

        states.append({

            "state":
                row["state"],

            "total_projects":
                row["total_projects"] or 0,

            "delayed_projects":
                row["delayed_projects"] or 0,

            "total_parcels":
                row["total_parcels"] or 0,

            "affected_families":
                row["affected_families"] or 0,

            "stakeholder_response_rate":
                round(
                    row[
                        "stakeholder_response_rate"
                    ] or 0,
                    2
                )
        })

    return jsonify({

        "success": True,

        "states":
            states
    })


# ============================================================
# GIS DISTRICT DATA
# ============================================================

@app.route(
    "/gis/districts",
    methods=["GET"]
)
def gis_districts():

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
            ) AS delayed_projects,

            SUM(total_parcels)
                AS total_parcels,

            SUM(affected_families)
                AS affected_families,

            SUM(legal_disputes)
                AS legal_disputes,

            SUM(ownership_conflicts)
                AS ownership_conflicts

        FROM projects

        GROUP BY
            state,
            district

        ORDER BY
            total_projects DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    districts = []

    for row in rows:

        districts.append({

            "state":
                row["state"],

            "district":
                row["district"],

            "total_projects":
                row["total_projects"] or 0,

            "delayed_projects":
                row["delayed_projects"] or 0,

            "total_parcels":
                row["total_parcels"] or 0,

            "affected_families":
                row["affected_families"] or 0,

            "legal_disputes":
                row["legal_disputes"] or 0,

            "ownership_conflicts":
                row["ownership_conflicts"] or 0
        })

    return jsonify({

        "success": True,

        "districts":
            districts
    })

# ============================================================
# PROJECT COUNT / SUMMARY
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
    