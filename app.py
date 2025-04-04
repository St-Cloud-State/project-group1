from flask import Flask, jsonify, render_template, request
import sqlite3
import os

app = Flask(__name__)

# Define the path to your SQLite database file
DATABASE = 'db/course_management.db'

# Ensure the db directory exists
os.makedirs(os.path.dirname(DATABASE), exist_ok=True)

# Initialize database if it doesn't exist
def init_db():
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Create the tables based on SQL script
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Student (
            student_id INTEGER PRIMARY KEY,
            student_name TEXT NOT NULL,
            student_address TEXT
        )
        ''')
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Rubrics (
            rubric_id TEXT PRIMARY KEY,
            rubric_description TEXT NOT NULL
        )
        ''')
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Course (
            course_id INTEGER PRIMARY KEY,
            course_name TEXT NOT NULL,
            course_creadits INTEGER NOT NULL,
            course_number INTEGER,
            rubric_id TEXT,
            FOREIGN KEY (rubric_id) REFERENCES Rubrics (rubric_id)
        )
        ''')
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Section (
            section_id INTEGER PRIMARY KEY,
            course_id INTEGER,
            section_semester INTEGER NOT NULL,
            section_year INTEGER NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course (course_id)
        )
        ''')
        
        conn.commit()
        conn.close()

# Initialize the database
init_db()

# Route to render the HTML pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/students')
def students():
    return render_template('students.html')

@app.route('/courses')
def courses():
    return render_template('courses.html')

@app.route('/sections')
def sections():
    return render_template('sections.html')

@app.route('/rubrics')
def rubrics():
    return render_template('rubrics.html')

# API endpoints for Students
@app.route('/api/students', methods=['GET'])
def get_all_students():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row  # This enables column access by name
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Student")
        students = cursor.fetchall()
        conn.close()

        # Convert the rows to dictionaries
        student_list = []
        for student in students:
            student_dict = dict(student)
            student_list.append(student_dict)

        return jsonify({'students': student_list})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/students', methods=['POST'])
def add_student():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Get student details from the request
        data = request.get_json()
        student_name = data.get('student_name')
        student_address = data.get('student_address')

        # Insert the student into the database
        cursor.execute("INSERT INTO Student (student_name, student_address) VALUES (?, ?)", 
                      (student_name, student_address))
        
        # Get the ID of the newly inserted student
        student_id = cursor.lastrowid
        
        conn.commit()
        conn.close()

        return jsonify({'message': 'Student added successfully', 'student_id': student_id})
    except Exception as e:
        return jsonify({'error': str(e)})

# API endpoints for Courses
@app.route('/api/courses', methods=['GET'])
def get_all_courses():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Course")
        courses = cursor.fetchall()
        conn.close()

        # Convert the rows to dictionaries
        course_list = []
        for course in courses:
            course_dict = dict(course)
            course_list.append(course_dict)

        return jsonify({'courses': course_list})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/courses', methods=['POST'])
def add_course():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Get course details from the request
        data = request.get_json()
        course_name = data.get('course_name')
        course_creadits = data.get('course_creadits')
        course_number = data.get('course_number')
        rubric_id = data.get('rubric_id')

        # Insert the course into the database
        cursor.execute(
            "INSERT INTO Course (course_name, course_creadits, course_number, rubric_id) VALUES (?, ?, ?, ?)",
            (course_name, course_creadits, course_number, rubric_id)
        )
        
        # Get the ID of the newly inserted course
        course_id = cursor.lastrowid
        
        conn.commit()
        conn.close()

        return jsonify({'message': 'Course added successfully', 'course_id': course_id})
    except Exception as e:
        return jsonify({'error': str(e)})

# API endpoints for Sections
@app.route('/api/sections', methods=['GET'])
def get_all_sections():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Section")
        sections = cursor.fetchall()
        conn.close()

        # Convert the rows to dictionaries
        section_list = []
        for section in sections:
            section_dict = dict(section)
            section_list.append(section_dict)

        return jsonify({'sections': section_list})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/sections', methods=['POST'])
def add_section():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Get section details from the request
        data = request.get_json()
        course_id = data.get('course_id')
        section_semester = data.get('section_semester')
        section_year = data.get('section_year')

        # Insert the section into the database
        cursor.execute(
            "INSERT INTO Section (course_id, section_semester, section_year) VALUES (?, ?, ?)",
            (course_id, section_semester, section_year)
        )
        
        # Get the ID of the newly inserted section
        section_id = cursor.lastrowid
        
        conn.commit()
        conn.close()

        return jsonify({'message': 'Section added successfully', 'section_id': section_id})
    except Exception as e:
        return jsonify({'error': str(e)})

# API endpoints for Rubrics
@app.route('/api/rubrics', methods=['GET'])
def get_all_rubrics():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Rubrics")
        rubrics = cursor.fetchall()
        conn.close()

        # Convert the rows to dictionaries
        rubric_list = []
        for rubric in rubrics:
            rubric_dict = dict(rubric)
            rubric_list.append(rubric_dict)

        return jsonify({'rubrics': rubric_list})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/rubrics', methods=['POST'])
def add_rubric():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Get rubric details from the request
        data = request.get_json()
        rubric_id = data.get('rubric_id')
        rubric_description = data.get('rubric_description')

        # Insert the rubric into the database
        cursor.execute(
            "INSERT INTO Rubrics (rubric_id, rubric_description) VALUES (?, ?)",
            (rubric_id, rubric_description)
        )
        
        conn.commit()
        conn.close()

        return jsonify({'message': 'Rubric added successfully', 'rubric_id': rubric_id})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")