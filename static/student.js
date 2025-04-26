// Array to store book data
const students = []; //was const book = [];
const courses = [];
const section = [];
const rubric = [];

// Function to add a new student
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const studentAddress = document.getElementById('studentAddress').value;
    console.log("Test");
    // Create a JSON object with student data
    const studentData = {
        student_name: studentName,
        student_address: studentAddress
    };


    // Send the student data to the server via POST request
    fetch('/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    

        .then(response => response.json())
        .then(data => {
            // Display a success message or handle errors if needed
            console.log(data.message);

            // Add the new student data to the students array
            students.push(studentData);
            console.log(students);

            // Refresh the student list
            displayStudents();
        })
        .catch(error => {
            console.error('Error adding student:', error);
        });
}


// Function to display students in the list
function displayStudents() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Clear existing student list

    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.innerHTML = `
            <h2>Added Successfully :${student.student_name}</h2>
        `;
        studentList.appendChild(studentElement);
    });
}

// Function to fetch and display all books from the server
function showAllStudents() {
    fetch('/api/get_students')
        .then(response => response.json())
        .then(data => {
            const studentList = document.getElementById('allStudents'); 
            studentList.innerHTML = ''; // Clear existing student list (not bookList)
            console.log(data);
            
            if (!data.students || data.students.length === 0) {
                studentList.innerHTML = '<p>No students found.</p>';
                return;
            }
            
            data.students.forEach(student => { // Access the 'students' key in the JSON response
                const studentElement = document.createElement('div');
                studentElement.innerHTML = `
                    <h3>${student.student_name}</h3>
                    <p>Student ID: ${student.student_id}</p>
                    <p>Address: ${student.student_address || 'Not provided'}</p>
                `;
                studentList.appendChild(studentElement);
            });
        })
        .catch(error => {
            console.error('Error fetching all students:', error);
            document.getElementById('allStudents').innerHTML = '<p>Error loading students. Please try again.</p>';
        });
}
