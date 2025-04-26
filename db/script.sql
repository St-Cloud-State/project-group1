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

CREATE TABLE IF NOT EXISTS Rubrics (
rubric_id TEXT PRIMARY KEY,
rubric_description TEXT NOT NULL
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

------------------
