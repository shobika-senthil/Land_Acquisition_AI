import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline


# ============================================================
# 1. LOAD DATASET
# ============================================================

print("\n==============================================")
print("        TRAINING LAND ACQUISITION AI")
print("==============================================")

print("\nLoading dataset...")

data = pd.read_excel("final_dataset_sih.xlsx")

print("Projects loaded:", len(data))


# ============================================================
# 2. PREPARE FEATURES AND TARGET
# ============================================================

X = data.drop(columns=[
    "Project_ID",
    "Delayed",
    "Actual_Delay_Days",
    "Primary_Delay_Reason"
])

y = data["Delayed"]


# ============================================================
# 3. CATEGORICAL COLUMNS
# ============================================================

categorical_columns = [
    "Project_Type",
    "State",
    "District",
    "Current_Stage"
]


# ============================================================
# 4. PREPROCESSOR
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_columns
        )
    ],
    remainder="passthrough"
)


# ============================================================
# 5. RANDOM FOREST MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)


# ============================================================
# 6. CREATE PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ============================================================
# 7. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ============================================================
# 8. TRAIN
# ============================================================

print("\nTraining Random Forest model...")

pipeline.fit(
    X_train,
    y_train
)


# ============================================================
# 9. ACCURACY
# ============================================================

accuracy = pipeline.score(
    X_test,
    y_test
)

print(
    "\nModel Accuracy:",
    round(accuracy * 100, 2),
    "%"
)


# ============================================================
# 10. SAVE MODEL
# ============================================================

MODEL_PATH = "data/land_delay_model.joblib"

joblib.dump(
    pipeline,
    MODEL_PATH
)


# ============================================================
# 11. COMPLETED
# ============================================================

print("\n==============================================")
print("       MODEL TRAINING COMPLETED")
print("==============================================")

print("\nModel saved successfully:")
print(MODEL_PATH)

print("\nThe API can now load this model.")