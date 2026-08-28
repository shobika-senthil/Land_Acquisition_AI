import sqlite3

DB_PATH = "data/land_acquisition.db"


def view_project():

    project_id = input("Enter Project ID: ").strip()

    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM projects
        WHERE project_id = ?
    """, (project_id,))

    project = cursor.fetchone()

    if project is None:
        print("\nProject not found.")
        connection.close()
        return

    columns = [description[0] for description in cursor.description]

    print("\n==============================================")
    print("             PROJECT INFORMATION")
    print("==============================================")

    for column, value in zip(columns, project):
        print(f"{column}: {value}")

    connection.close()


if __name__ == "__main__":
    view_project()