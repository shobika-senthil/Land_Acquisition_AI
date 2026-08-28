import pandas as pd


# Load dataset
data = pd.read_excel("final_dataset_sih.xlsx")


def generate_recommendations(project):

    recommendations = []

    # Compensation
    if project["Compensation_Completion_Percent"] < 60:
        recommendations.append(
            "Prioritize pending compensation cases."
        )

    # Approvals
    if project["Pending_Approvals"] > 0:
        recommendations.append(
            "Expedite pending administrative approvals."
        )

    # Legal disputes
    if project["Legal_Disputes"] > 0:
        recommendations.append(
            "Prioritize resolution of pending legal disputes."
        )

    # Ownership conflicts
    if project["Ownership_Conflicts"] > 0:
        recommendations.append(
            "Resolve land ownership conflicts through verification and legal review."
        )

    # Documentation
    if project["Documentation_Completion_Percent"] < 70:
        recommendations.append(
            "Complete pending land acquisition documentation."
        )

    # R&R
    if project["RR_Completion_Percent"] < 70:
        recommendations.append(
            "Accelerate rehabilitation and resettlement activities."
        )

    # Possession
    if project["Possession_Percent"] < 70:
        recommendations.append(
            "Prioritize pending land possession procedures."
        )

    # Stakeholder response
    if project["Stakeholder_Response_Rate"] < 60:
        recommendations.append(
            "Improve stakeholder coordination and response follow-up."
        )

    return recommendations


# Test recommendation system on first 5 projects

print("\n======================================")
print("AI RECOMMENDATION SYSTEM")
print("======================================")

for index in range(5):

    project = data.iloc[index]

    print("\nProject:", project["Project_ID"])

    recommendations = generate_recommendations(project)

    if recommendations:

        print("Recommended Actions:")

        for number, recommendation in enumerate(
            recommendations, start=1
        ):
            print(f"{number}. {recommendation}")

    else:

        print("No major corrective actions identified.")