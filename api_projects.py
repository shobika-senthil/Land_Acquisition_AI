from flask import jsonify, request
import sqlite3


def register_project_api(app, get_connection):

    @app.route("/api/projects", methods=["GET"])
    def api_get_projects():

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
        risk_level = request.args.get("riskLevel")
        sector = request.args.get("sector")
        status = request.args.get("status")
        search = request.args.get("query")

        if state and state != "All":
            query += " AND LOWER(state) = LOWER(?)"
            params.append(state)

        if district and district != "All":
            query += " AND LOWER(district) = LOWER(?)"
            params.append(district)

        if sector and sector != "All":
            query += " AND LOWER(project_type) = LOWER(?)"
            params.append(sector)

        if status and status != "All":
            query += " AND LOWER(current_stage) = LOWER(?)"
            params.append(status)

        if search:
            query += """
                AND (
                    LOWER(project_id) LIKE LOWER(?)
                    OR LOWER(project_type) LIKE LOWER(?)
                    OR LOWER(state) LIKE LOWER(?)
                    OR LOWER(district) LIKE LOWER(?)
                )
            """

            search_value = f"%{search}%"

            params.extend([
                search_value,
                search_value,
                search_value,
                search_value
            ])

        query += " ORDER BY project_id"

        cursor.execute(query, params)

        rows = cursor.fetchall()

        projects = []

        for row in rows:

            project = dict(row)

            total_parcels = project.get("total_parcels") or 0
            possessed = project.get("parcels_possessed") or 0

            possession_percent = (
                project.get("possession_percent")
                if project.get("possession_percent") is not None
                else (
                    (possessed / total_parcels * 100)
                    if total_parcels > 0
                    else 0
                )
            )

            delay_probability = 0

            if project.get("delayed"):
                delay_probability = 80
            elif project.get("actual_delay_days", 0) > 0:
                delay_probability = 65
            elif project.get("approval_delay_days", 0) > 0:
                delay_probability = 50
            else:
                delay_probability = 25

            if risk_level:
                calculated_risk = get_risk_level(delay_probability)

                if risk_level != calculated_risk:
                    continue

            risk = get_risk_level(delay_probability)

            projects.append({
                "id": project["project_id"],

                "name": (
                    f'{project["project_type"]} '
                    f'Corridor - {project["district"]}'
                ),

                "code": project["project_id"],

                "sector": project["project_type"],

                "state": project["state"],

                "district": project["district"],

                "lengthKm": round(
                    float(project.get("land_area_hectares") or 0),
                    2
                ),

                "totalParcels": total_parcels,

                "acquiredParcels": possessed,

                "riskScore": delay_probability,

                "delayProbability": delay_probability,

                "riskLevel": risk,

                "status": project.get("current_stage")
                    or "Pre-Acquisition",

                "estimatedDelayMonths": round(
                    float(project.get("actual_delay_days") or 0)
                    / 30,
                    1
                ),

                "budgetCr": 0,

                "startDate": None,

                "targetCompletion": None,

                "topDelayDriver": (
                    project.get("primary_delay_reason")
                    or "No major delay driver identified"
                ),

                "coordinates": [0, 0],

                "corridorPath": [],

                "affectedParcelsCount": total_parcels,

                "criticalParcelsCount": (
                    total_parcels - possessed
                ),

                "summary": (
                    f'Land acquisition project in '
                    f'{project["district"]}, '
                    f'{project["state"]}. '
                    f'Land possession is '
                    f'{round(possession_percent, 1)}%.'
                ),

                "timeline": []
            })

        connection.close()

        return jsonify(projects)


    @app.route("/api/projects/<project_id>", methods=["GET"])
    def api_get_project(project_id):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM projects
            WHERE project_id = ?
            """,
            (project_id,)
        )

        row = cursor.fetchone()

        connection.close()

        if row is None:
            return jsonify({
                "error": "Project not found"
            }), 404

        project = dict(row)

        total_parcels = project.get("total_parcels") or 0
        possessed = project.get("parcels_possessed") or 0

        if project.get("delayed"):
            delay_probability = 80
        elif project.get("actual_delay_days", 0) > 0:
            delay_probability = 65
        elif project.get("approval_delay_days", 0) > 0:
            delay_probability = 50
        else:
            delay_probability = 25

        return jsonify({
            "id": project["project_id"],

            "name": (
                f'{project["project_type"]} '
                f'Corridor - {project["district"]}'
            ),

            "code": project["project_id"],

            "sector": project["project_type"],

            "state": project["state"],

            "district": project["district"],

            "lengthKm": round(
                float(project.get("land_area_hectares") or 0),
                2
            ),

            "totalParcels": total_parcels,

            "acquiredParcels": possessed,

            "riskScore": delay_probability,

            "delayProbability": delay_probability,

            "riskLevel": get_risk_level(
                delay_probability
            ),

            "status": project.get("current_stage")
                or "Pre-Acquisition",

            "estimatedDelayMonths": round(
                float(project.get("actual_delay_days") or 0)
                / 30,
                1
            ),

            "budgetCr": 0,

            "startDate": None,

            "targetCompletion": None,

            "topDelayDriver": (
                project.get("primary_delay_reason")
                or "No major delay driver identified"
            ),

            "coordinates": [0, 0],

            "corridorPath": [],

            "affectedParcelsCount": total_parcels,

            "criticalParcelsCount": (
                total_parcels - possessed
            ),

            "summary": (
                f'Land acquisition project in '
                f'{project["district"]}, '
                f'{project["state"]}.'
            ),

            "timeline": []
        })


def get_risk_level(score):

    if score >= 80:
        return "CRITICAL"

    if score >= 65:
        return "HIGH"

    if score >= 40:
        return "MODERATE"

    return "LOW"