import sqlite3
import os

DATABASE = 'db/course_management.db'

# Ensure the db directory exists
os.makedirs(os.path.dirname(DATABASE), exist_ok=True)

# Reset and seed the database
def reset_db():
    conn = sqlite3.connect(DATABASE)
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()

    # Drop tables if they exist
    cursor.executescript('''
    DROP TABLE IF EXISTS Section;
    DROP TABLE IF EXISTS Course;
    DROP TABLE IF EXISTS Student;
    DROP TABLE IF EXISTS Rubrics;
    ''')

    # Recreate tables in correct order
    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS Rubrics (
        rubric_id TEXT PRIMARY KEY,
        rubric_description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Student (
        student_id INTEGER PRIMARY KEY,
        student_name TEXT NOT NULL,
        student_address TEXT,
        section_id_1 TEXT,
        section_id_2 TEXT,
        section_id_3 TEXT,
        section_id_4 TEXT,
        section_id_5 TEXT
    );
    CREATE TABLE IF NOT EXISTS Course (
        course_id INTEGER PRIMARY KEY,
        course_name TEXT NOT NULL,
        course_credits INTEGER NOT NULL,
        course_number INTEGER,
        rubric_id TEXT, 
        FOREIGN KEY (rubric_id) REFERENCES Rubrics (rubric_id)
    );

    CREATE TABLE IF NOT EXISTS Section (
        section_id INTEGER PRIMARY KEY,
        course_Id INTEGER,
        section_semester INTEGER NOT NULL,
        section_year INTEGER NOT NULL,
        FOREIGN KEY (course_Id) REFERENCES Course (course_Id)
    );
    ''')

    # Seed sample rubrics
    cursor.execute("INSERT INTO Rubrics (rubric_id, rubric_description) VALUES (?, ?)", ("R1", "Math Department"))
    cursor.execute("INSERT INTO Rubrics (rubric_id, rubric_description) VALUES (?, ?)", ("R2", "Computer Science"))

    # Seed a sample course
    cursor.execute("INSERT INTO Course (course_name, course_credits, course_number, rubric_id) VALUES (?, ?, ?, ?)",
                   ("Algebra", 3, 101, "R1"))

    conn.commit()
    conn.close()
    print("✅ Database reset and seeded successfully.")

if __name__ == "__main__":
    reset_db()
