import pandas as pd
import random


# Load existing project dataset
projects = pd.read_excel("final_dataset_sih.xlsx")


parcel_data = []

random.seed(42)


for _, project in projects.iterrows():

    project_id = project["Project_ID"]

    # Create 5 parcels for each project
    for number in range(1, 6):

        plot_id = f"{project_id}-PL-{number:03d}"

        survey_number = (
            f"S-{random.randint(10000, 99999)}"
        )

        land_area = round(
            random.uniform(0.5, 10.0), 2
        )

        owner_count = random.randint(1, 4)

        ownership_conflict = random.choice([0, 0, 0, 1])

        legal_dispute = random.choice([0, 0, 0, 1])

        compensation_percent = random.randint(
            20, 100
        )

        documentation_percent = random.randint(
            30, 100
        )

        rr_required = random.choice([0, 0, 1])

        rr_status = (
            random.randint(20, 100)
            if rr_required == 1
            else 100
        )

        possession_percent = random.randint(
            0, 100
        )

        stakeholder_response = random.randint(
            30, 100
        )

        parcel_data.append({

            "Project_ID": project_id,

            "Plot_ID": plot_id,

            "Survey_Number": survey_number,

            "Land_Area_Hectares": land_area,

            "Owner_Count": owner_count,

            "Ownership_Conflict": ownership_conflict,

            "Legal_Dispute": legal_dispute,

            "Compensation_Completion_Percent":
                compensation_percent,

            "Documentation_Completion_Percent":
                documentation_percent,

            "RR_Required": rr_required,

            "RR_Completion_Percent":
                rr_status,

            "Possession_Percent":
                possession_percent,

            "Stakeholder_Response_Rate":
                stakeholder_response
        })


# Convert to DataFrame
parcel_df = pd.DataFrame(parcel_data)


# Save as a new Excel file
with pd.ExcelWriter(
    "land_acquisition_complete_dataset.xlsx",
    engine="openpyxl"
) as writer:

    projects.to_excel(
        writer,
        sheet_name="Project_Data",
        index=False
    )

    parcel_df.to_excel(
        writer,
        sheet_name="Parcel_Data",
        index=False
    )


print("\n========================================")
print("PARCEL DATASET CREATED")
print("========================================")

print(
    "Projects:",
    len(projects)
)

print(
    "Parcels:",
    len(parcel_df)
)

print(
    "\nExcel file created:"
)

print(
    "land_acquisition_complete_dataset.xlsx"
)

print("\nSheets:")

print("1. Project_Data")
print("2. Parcel_Data")
print("\nFirst 10 parcel records:")
print(parcel_df.head(10).to_string(index=False))

print("\nParcel dataset information:")
print(parcel_df.info())