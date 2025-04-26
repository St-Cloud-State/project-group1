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
            student_address TEXT,
            section_id_1 TEXT,
            section_id_2 TEXT,
            section_id_3 TEXT,
            section_id_4 TEXT,
            section_id_5 TEXT            
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
            course_Id INTEGER PRIMARY KEY,
            course_name TEXT NOT NULL,
            course_credits INTEGER NOT NULL,
            course_number INTEGER,
            rubric_id TEXT,
            FOREIGN KEY (rubric_id) REFERENCES Rubrics (rubric_id)
        )
        ''')
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Section (
            section_id INTEGER PRIMARY KEY,
            course_Id INTEGER,
            section_semester INTEGER NOT NULL,
            section_year INTEGER NOT NULL,
            FOREIGN KEY (course_Id) REFERENCES Course (course_Id)
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
@app.route('/api/get_students', methods=['GET'])
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
        section_id_1 = "-1"
        section_id_2 = "-1"
        section_id_3 = "-1"
        section_id_4 = "-1"
        section_id_5 = "-1"    
        
        # Insert the student into the database
        cursor.execute("INSERT INTO Student (student_name, student_address, section_id_1, section_id_2, section_id_3, section_id_4, section_id_5) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                      (student_name, student_address, section_id_1, section_id_2, section_id_3, section_id_4, section_id_5))
        
        # Get the ID of the newly inserted student
        student_id = cursor.lastrowid
       
        conn.commit()
        conn.close()

        return jsonify({'message': 'Student added successfully', 'student_id': student_id , 'section_id_1': section_id_1, 'section_id_3': section_id_3 , 'section_id_5': section_id_5})
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
def add_Course():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Get course details from the request
        data = request.get_json()
        course_name = data.get('course_name')
        course_credits = data.get('course_credits')
        course_number = data.get('course_number')
        rubric_id = data.get('rubric_id')

        # Insert the course into the database
        cursor.execute(
            "INSERT INTO Course (course_name, course_credits, course_number, rubric_id) VALUES (?, ?, ?, ?)",
            (course_name, course_credits, course_number, rubric_id)
        )
        
        # Get the ID of the newly inserted course
        course_id = cursor.lastrowid
        
        conn.commit()
        conn.close()

        return jsonify({'message': 'Course added successfully', 'course_id': course_id})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/sections', methods=['POST'])
def add_section():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Get section details from the request
        data = request.get_json()
        course_Id = data.get('course_Id')
        section_Semester = data.get('section_Semester')
        section_Year = data.get('section_Year')

        # Insert the section into the database
        cursor.execute("INSERT INTO Section (course_Id,section_Semester, section_Year) VALUES (?, ?, ?)", 
                      (course_Id,section_Semester, section_Year))
        
        # Get the ID of the newly inserted student
        section_id = cursor.lastrowid
        
        conn.commit()
        conn.close()

        return jsonify({'message': 'Section added successfully', 'section_id': section_id})
    except Exception as e:
        return jsonify({'error': str(e)})




# API endpoints for Sections
@app.route('/api/get_sections', methods=['GET'])
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
       
@app.route('/api/courses/by-rubric/<rubric_id>', methods=['GET'])
def  listCoursesByRubric(rubric_id):
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get courses for the specified rubric
        print(f"Searching for courses with rubric_id = {rubric_id}")
        cursor.execute("SELECT * FROM Course WHERE rubric_id = ?", (rubric_id,))
        courses = cursor.fetchall()
        print(f"Found {len(courses)} courses")
        
        # Convert to dictionaries
        course_list = [dict(course) for course in courses]
        print(f"Course list: {course_list}")
        
        conn.close()
        return jsonify({'courses': course_list})
    except Exception as e:
        print(f"Error in get_courses_by_rubric: {str(e)}")
        return jsonify({'error': str(e)})

@app.route('/api/rubrics', methods=['POST'])
def add_rubric():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Enable foreign key constraints (good practice)
        cursor.execute("PRAGMA foreign_keys = ON")

        # Get rubric data from request
        data = request.get_json()
        rubric_id = data.get('rubric_id')
        rubric_description = data.get('rubric_description')

        # Validate input
        if not rubric_id or not rubric_description:
            return jsonify({'error': 'Rubric ID and description are required'}), 400

        # Insert rubric into database
        cursor.execute(
            "INSERT INTO Rubrics (rubric_id, rubric_description) VALUES (?, ?)",
            (rubric_id, rubric_description)
        )

        conn.commit()
        conn.close()

        return jsonify({'message': 'Rubric added successfully', 'rubric_id': rubric_id})
    except sqlite3.IntegrityError as e:
        return jsonify({'error': f"Rubric ID '{rubric_id}' already exists."}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/sections/by-course/<int:course_Id>', methods=['GET'])
def get_sections_by_course(course_Id):
        try:
            conn = sqlite3.connect(DATABASE)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
        
            # Get sections for the specified course
            cursor.execute("SELECT * FROM Section WHERE course_Id = ?", (course_Id,))
            sections = cursor.fetchall()
            conn.close()

            # Convert to dictionaries
            section_list = [dict(section) for section in sections]
        
            return jsonify({'sections': section_list})
        except Exception as e:
            return jsonify({'error': str(e)})
       

@app.route('/api/change_section', methods=['PUT'])
def change_section():
    try:
        data = request.get_json()
        student_name = data.get('stuName')
        new_section_id = data.get('Id')
        section_slot = data.get('slot')


        if section_slot not in ['1', '2', '3', '4', '5']:
            return jsonify({'error': 'Invalid section slot'}), 400\

        column_name = f'section_id_{section_slot}'


        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()


        query = f"UPDATE Student SET {column_name} = ? WHERE student_name = ?"
        cursor.execute(query, (new_section_id, student_name))

        if cursor.rowcount ==0:
            return jsonify({'error': 'Student not found'}), 404



        conn.commit()
        conn.close()

        return jsonify({'message' : f'Section updated for {student_name}'})
    except Exception as e:
        return jsonify ({'error': str(e)}), 500


@app.route('/api/students_in_section/<section_id>', methods=['GET'])
def get_students_in_section(section_id):
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        query = """
        SELECT * FROM Student 
        WHERE section_id_1 = ?
           OR section_id_2 = ?
           OR section_id_3 = ?
           OR section_id_4 = ?
           OR section_id_5 = ?
        """
        cursor.execute(query, (section_id, section_id, section_id, section_id, section_id))
        rows = cursor.fetchall()
        conn.close()

        students = [dict(row) for row in rows]
        return jsonify({'students': students})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
        

