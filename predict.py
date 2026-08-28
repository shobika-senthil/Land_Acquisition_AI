import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier


# ============================================================
# 1. LOAD DATASET
# ============================================================

data = pd.read_excel("final_dataset_sih.xlsx")


# ============================================================
# 2. SAVE PROJECT IDs
# ============================================================

project_ids = data["Project_ID"]


# ============================================================
# 3. PREPARE INPUT AND TARGET
# ============================================================

X = data.drop(columns=[
    "Project_ID",
    "Delayed",
    "Actual_Delay_Days",
    "Primary_Delay_Reason"
])

y = data["Delayed"]


# ============================================================
# 4. SPLIT DATA
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ============================================================
# 5. CATEGORICAL COLUMNS
# ============================================================

categorical_columns = [
    "Project_Type",
    "State",
    "District",
    "Current_Stage"
]


# ============================================================
# 6. PREPROCESSING
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
# 7. TRANSFORM DATA
# ============================================================

X_train_processed = preprocessor.fit_transform(X_train)


# ============================================================
# 8. TRAIN RANDOM FOREST MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train_processed, y_train)


# ============================================================
# 9. RISK LEVEL FUNCTION
# ============================================================

def get_risk_level(probability):

    if probability >= 0.80:
        return "CRITICAL"

    elif probability >= 0.60:
        return "HIGH"

    elif probability >= 0.40:
        return "MEDIUM"

    else:
        return "LOW"


# ============================================================
# 10. RECOMMENDATION ENGINE
# ============================================================

def generate_recommendations(project):

    recommendations = []

    if project["Compensation_Completion_Percent"] < 60:
        recommendations.append(
            "Prioritize pending compensation cases."
        )

    if project["Pending_Approvals"] > 0:
        recommendations.append(
            "Expedite pending administrative approvals."
        )

    if project["Legal_Disputes"] > 0:
        recommendations.append(
            "Prioritize resolution of pending legal disputes."
        )

    if project["Ownership_Conflicts"] > 0:
        recommendations.append(
            "Resolve land ownership conflicts through verification and legal review."
        )

    if project["Documentation_Completion_Percent"] < 70:
        recommendations.append(
            "Complete pending land acquisition documentation."
        )

    if project["RR_Completion_Percent"] < 70:
        recommendations.append(
            "Accelerate rehabilitation and resettlement activities."
        )

    if project["Possession_Percent"] < 70:
        recommendations.append(
            "Prioritize pending land possession procedures."
        )

    if project["Stakeholder_Response_Rate"] < 60:
        recommendations.append(
            "Improve stakeholder coordination and response follow-up."
        )

    return recommendations


# ============================================================
# 11. PREDICT ONE EXISTING PROJECT
# ============================================================

project_number = 0

project = data.iloc[project_number]

project_id = project["Project_ID"]


# Remove columns that aren't model inputs
project_input = project.drop([
    "Project_ID",
    "Delayed",
    "Actual_Delay_Days",
    "Primary_Delay_Reason"
])


# Convert Series into DataFrame
project_input = pd.DataFrame(
    [project_input]
)


# Transform project
project_processed = preprocessor.transform(
    project_input
)


# Get delay probability
delay_probability = model.predict_proba(
    project_processed
)[0][1]


# Determine risk
risk_level = get_risk_level(
    delay_probability
)


# Generate recommendations
recommendations = generate_recommendations(
    project
)


# ============================================================
# 12. DISPLAY FINAL RESULT
# ============================================================

print("\n")
print("================================================")
print("       LAND ACQUISITION AI SYSTEM")
print("================================================")

print("\nPROJECT INFORMATION")
print("-----------------------------------------------")

print("Project ID:", project_id)
print("Project Type:", project["Project_Type"])
print("State:", project["State"])
print("District:", project["District"])


print("\nAI RISK ASSESSMENT")
print("-----------------------------------------------")

print(
    "Delay Probability:",
    round(delay_probability * 100, 2),
    "%"
)

print("Risk Level:", risk_level)


print("\nRECOMMENDED ACTIONS")
print("-----------------------------------------------")

if recommendations:

    for number, recommendation in enumerate(
        recommendations,
        start=1
    ):
        print(
            f"{number}. {recommendation}"
        )

else:

    print(
        "No major corrective actions identified."
    )


print("\n================================================")