import sqlite3
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier


# ============================================================
# SETTINGS
# ============================================================

DB_PATH = "data/land_acquisition.db"
DATASET_PATH = "final_dataset_sih.xlsx"


# ============================================================
# 1. LOAD ORIGINAL DATASET
# ============================================================

data = pd.read_excel(DATASET_PATH)


# ============================================================
# 2. PREPARE TRAINING DATA
# ============================================================

X = data.drop(columns=[
    "Project_ID",
    "Delayed",
    "Actual_Delay_Days",
    "Primary_Delay_Reason"
])

y = data["Delayed"]


# ============================================================
# 3. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ============================================================
# 4. CATEGORICAL COLUMNS
# ============================================================

categorical_columns = [
    "Project_Type",
    "State",
    "District",
    "Current_Stage"
]


# ============================================================
# 5. PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_columns
        )
    ],
    remainder="passthrough"
)


# ============================================================
# 6. PROCESS TRAINING DATA
# ============================================================

X_train_processed = preprocessor.fit_transform(X_train)


# ============================================================
# 7. TRAIN AI MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train_processed, y_train)


# ============================================================
# 8. GET PROJECT ID
# ============================================================

print("\n==============================================")
print("       LAND ACQUISITION AI PREDICTION")
print("==============================================")

project_id = input("\nEnter Project ID: ").strip()


# ============================================================
# 9. CONNECT TO DATABASE
# ============================================================

connection = sqlite3.connect(DB_PATH)


# ============================================================
# 10. FETCH PROJECT
# ============================================================

query = """
SELECT *
FROM projects
WHERE project_id = ?
"""

project = pd.read_sql_query(
    query,
    connection,
    params=(project_id,)
)

connection.close()


# ============================================================
# 11. CHECK PROJECT
# ============================================================

if project.empty:

    print("\nProject not found in database.")
    print("Please check the Project ID.")

    exit()


# ============================================================
# 12. DISPLAY PROJECT INFORMATION
# ============================================================

print("\n==============================================")
print("             PROJECT FOUND")
print("==============================================")

print("Project ID:", project_id)
print("Project Type:", project.loc[0, "project_type"])
print("State:", project.loc[0, "state"])
print("District:", project.loc[0, "district"])


# ============================================================
# 13. CONVERT DATABASE COLUMNS
#     TO MODEL COLUMN NAMES
# ============================================================

new_project = pd.DataFrame([{

    "Project_Type":
        project.loc[0, "project_type"],

    "State":
        project.loc[0, "state"],

    "District":
        project.loc[0, "district"],

    "Land_Area_Hectares":
        project.loc[0, "land_area_hectares"],

    "Total_Parcels":
        project.loc[0, "total_parcels"],

    "Affected_Families":
        project.loc[0, "affected_families"],

    "Required_Approvals":
        project.loc[0, "required_approvals"],

    "Completed_Approvals":
        project.loc[0, "completed_approvals"],

    "Pending_Approvals":
        project.loc[0, "pending_approvals"],

    "Approval_Delay_Days":
        project.loc[0, "approval_delay_days"],

    "Legal_Disputes":
        project.loc[0, "legal_disputes"],

    "Ownership_Conflicts":
        project.loc[0, "ownership_conflicts"],

    "Total_Compensation_Cases":
        project.loc[0, "total_compensation_cases"],

    "Compensation_Paid_Cases":
        project.loc[0, "compensation_paid_cases"],

    "Compensation_Completion_Percent":
        project.loc[0, "compensation_completion_percent"],

    "Compensation_Delay_Days":
        project.loc[0, "compensation_delay_days"],

    "Documents_Required":
        project.loc[0, "documents_required"],

    "Documents_Completed":
        project.loc[0, "documents_completed"],

    "Documentation_Completion_Percent":
        project.loc[0, "documentation_completion_percent"],

    "Families_Requiring_RR":
        project.loc[0, "families_requiring_rr"],

    "Families_Rehabilitated":
        project.loc[0, "families_rehabilitated"],

    "RR_Completion_Percent":
        project.loc[0, "rr_completion_percent"],

    "Parcels_Required":
        project.loc[0, "parcels_required"],

    "Parcels_Possessed":
        project.loc[0, "parcels_possessed"],

    "Possession_Percent":
        project.loc[0, "possession_percent"],

    "Stakeholder_Response_Rate":
        project.loc[0, "stakeholder_response_rate"],

    "Current_Stage":
        project.loc[0, "current_stage"],

    "Planned_Duration_Days":
        project.loc[0, "planned_duration_days"],

    "Elapsed_Days":
        project.loc[0, "elapsed_days"]
}])


# ============================================================
# 14. PREPROCESS PROJECT
# ============================================================

new_project_processed = preprocessor.transform(
    new_project
)


# ============================================================
# 15. AI PREDICTION
# ============================================================

delay_probability = model.predict_proba(
    new_project_processed
)[0][1]


# ============================================================
# 16. RISK LEVEL
# ============================================================

if delay_probability >= 0.80:

    risk_level = "CRITICAL"

elif delay_probability >= 0.60:

    risk_level = "HIGH"

elif delay_probability >= 0.40:

    risk_level = "MEDIUM"

else:

    risk_level = "LOW"


# ============================================================
# 17. DISPLAY AI RESULT
# ============================================================

print("\n==============================================")
print("          AI PREDICTION RESULT")
print("==============================================")

print("\nPROJECT")
print("----------------------------------------------")

print("Project ID:", project_id)
print("Project Type:", project.loc[0, "project_type"])
print("State:", project.loc[0, "state"])
print("District:", project.loc[0, "district"])

print("\nAI RISK ASSESSMENT")
print("----------------------------------------------")

print(
    "Delay Probability:",
    round(delay_probability * 100, 2),
    "%"
)

print("Risk Level:", risk_level)

print("\n==============================================")