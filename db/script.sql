CREATE TABLE IF NOT EXISTS Student (
student_id INTEGER PRIMARY KEY,
student_name TEXT NOT NULL,
student_address TEXT
);

CREATE TABLE IF NOT EXISTS Course (
course_id INTEGER PRIMARY KEY,
course_name TEXT NOT NULL,
course_creadits INTEGER NOT NULL,
course_number INTEGER,
FOREIGN KEY (rubric_id) REFERENCES Rubrics (rubric_id)
);

CREATE TABLE IF NOT EXISTS Section (
section_id INTEGER PRIMARY KEY,
course_id INTEGER,
section_semester INTEGER NOT NULL,
section_year INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Rubrics (
rubric_id TEXT PRIMARY KEY,
rubric_description TEXT NOT NULL,
);

------------------
