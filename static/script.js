// Array to store book data
const students = []; //was const book = [];
const courses = [];
const section = [];
const rubric = [];

// Function to add a book to the list and send it to the server
function addBook() {
    const bookTitle = document.getElementById('bookTitle').value;
    const publicationYear = document.getElementById('publicationYear').value;

    // Create a JSON object with book data
    const bookData = {
        title: bookTitle,
        publication_year: publicationYear
    };

    // Send the book data to the server via POST request
    fetch('/api/add_book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    })
        .then(response => response.json())
        .then(data => {
            // Display a success message or handle errors if needed
            console.log(data.message);

            // Add the new book data to the books array
            books.push(bookData);
            console.log(books)

            // Refresh the book list
            displayBooks();
        })
        .catch(error => {
            console.error('Error adding book:', error);
        });
}
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

function addRubric() {
    const rubricId = document.getElementById('rubricId').value;
    const rubricDescription = document.getElementById('rubricDescription').value;

    fetch('/api/rubrics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            rubric_id: rubricId,
            rubric_description: rubricDescription
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Rubric added successfully: ' + data.rubric_id);
            // Optionally refresh the rubric list here
        }
    })
    .catch(error => {
        console.error('Error adding rubric:', error);
    });
}

function addCourse() {
    console.log("Function called")
    const courseName = document.getElementById('courseName').value;
    const courseCredits = document.getElementById('courseCredits').value;
    const courseNumber = document.getElementById('courseNumber').value;
    const rubric_id = document.getElementById('rubric_id').value;

    const courseData = {
        course_name: courseName,
        course_credits: courseCredits,
        course_number: courseNumber,
        rubric_id: rubric_id
    };
 
    console.log("Sending course data:", courseData);
    
    fetch('/api/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    })
    .then(async response => {
        console.log("Server response status:", response.status);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server error (${response.status}): ${text}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Server response data:", data);
        // Add course to array and display
        courseData.course_id = data.course_id;
        courses.push(courseData);
        displaycourses();
    })
    .catch(error => {
        console.error("Request failed:", error);
        alert("Failed to add course: " + error.message);
    });
}

    function displaycourses() {
        const courseList = document.getElementById('courseList');
        courseList.innerHTML = ''; // Clear existing course list
    
        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.innerHTML = `
                <h2>Added Successfully :${course.course_name}</h2>
            `;
            courseList.appendChild(courseElement);
        });
    }

// Function to display books in the list
function displayBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // Clear existing book list

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.innerHTML = `
            <h2>Added Successfully :${book.title}</h2>
            <p>Publication Year: ${book.publication_year}</p>
        `;
        bookList.appendChild(bookElement);
    });
}

// Function to add a new section
function addSection() {
    const courseId = document.getElementById('courseId').value;
    const sectionSemester = document.getElementById('sectionSemester').value;
    const sectionYear = document.getElementById('sectionYear').value;
    // Create a JSON object with student data
    const sectionData = {
        course_Id: courseId,
        section_Semester: sectionSemester,
	section_Year: sectionYear,
    };

    // Send the student data to the server via POST request
    fetch('/api/sections', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData)
    })
    

        .then(response => response.json())
        .then(data => {
            // Display a success message or handle errors if needed
            console.log(data.message);

            // Add the new student data to the students array
            section.push(sectionData);
            console.log(section);

            // Refresh the student list
            displaySections();
        })
        .catch(error => {
            console.error('Error adding section:', error);
        })
    }

    
function displaySections() {
    const sectionList = document.getElementById('sectionList');
    sectionList.innerHTML = ''; // Clear existing student list

    section.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.innerHTML = `
            <h2>Added Successfully :${section.section_Semester}</h2>
        `;
        sectionList.appendChild(sectionElement);
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
                studentElement.classList.add('student-card');
                
                let sectionsHtml = '';
                
                // Create section and grade pairs
                for (let i = 1; i <= 5; i++) {
                    const sectionId = student[`section_id_${i}`];
                    const gradeId = student[`grade_id_${i}`];
                    
                    if (sectionId && sectionId !== "-1") {
                        sectionsHtml += `
                            <div class="section-grade">
                                <p>Section ${i}: ${sectionId} ${gradeId}</p>
                            </div>
                        `;
                    }
                }
                studentElement.innerHTML = `
                    <h3>${student.student_name}</h3>
                    <p>Student ID: ${student.student_id}</p>
                    <p>Address: ${student.student_address || 'Not provided'}</p>
                    <div class="sections-container">
                        <h4>Enrolled Sections:</h4>
                        ${sectionsHtml || '<p>No sections assigned</p>'}
                    </div>

                `;
                studentList.appendChild(studentElement);
            });
        })
        .catch(error => {
            console.error('Error fetching all students:', error);
            document.getElementById('allStudents').innerHTML = '<p>Error loading students. Please try again.</p>';
        });
}




function listCoursesByRubric() {
    const rubricId = document.getElementById('searchRubricId').value;
    
    const coursesDiv = document.getElementById('coursesByRubric');
    coursesDiv.innerHTML = '<p>Loading courses...</p>';
    
    fetch(`/api/courses/by-rubric/${rubricId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            coursesDiv.innerHTML = `<h2>Courses in Rubric: ${rubricId}</h2>`;
            
            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Credits</th>
                        <th>Number</th>
			<th>Rubric Id</th>
                    </tr>
                </thead>
                <tbody id="courseTableBody">
                </tbody>
            `;
            coursesDiv.appendChild(table);
            
            const tableBody = document.getElementById('courseTableBody');
            data.courses.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${course.course_id}</td>
                    <td>${course.course_name}</td>
                    <td>${course.course_credits}</td>
                    <td>${course.course_number}</td>
                    <td>${course.rubric_id}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        }
    
    function listSectionsByCourse() {
            const courseId = document.getElementById('searchCourseId').value;
           
            
            const sectionsDiv = document.getElementById('sectionsByCourse');
            sectionsDiv.innerHTML = '<p>Loading sections...</p>';
            
            fetch(`/api/sections/by-course/${courseId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    sectionsDiv.innerHTML = `<h2>Sections for Course ID: ${courseId}</h2>`;
                    
                    const table = document.createElement('table');
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>Section ID</th>
                                <th>Semester</th>
                                <th>Year</th>
                            </tr>
                        </thead>
                        <tbody id="sectionTableBody">
                        </tbody>
                    `;
                    sectionsDiv.appendChild(table);
                    
                    const tableBody = document.getElementById('sectionTableBody');
                    data.sections.forEach(section => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${section.section_id}</td>
                            <td>${section.section_semester}</td>
                            <td>${section.section_year}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error('Error fetching sections:', error);
                    sectionsDiv.innerHTML = `<p style="color:red;">Error loading sections: ${error.message}</p>`;
                });
            }
        

function changeSection(){

    const studentName2 = document.getElementById('studentName2').value;
    const sectionId = document.getElementById('section_id').value;
    const sectionSlot = document.getElementById('section_slot').value;
    const grade = document.getElementById('grade_value').value;

    if (!studentName2 || !sectionId || !sectionSlot) {
        alert('Please fill in all required fields');
        return;
    }

    fetch('/api/change_section',{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ stuName: studentName2, Id: sectionId, sSlot: sectionSlot, grade: grade })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('studentName2').value = '';
        document.getElementById('section_id').value = '';
        document.getElementById('section_slot').selectedIndex = 0;
        document.getElementById('grade_value').selectedIndex = 0;

        alert(data.message || 'Section and grade updated successfully');

        showAllStudents();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update section and grade');
    });

    
}

function getStudentsBySection(sectionId) {
    fetch(`/api/students_in_section/${sectionId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Students in section:", data.students);
            // You can loop and display them if you want
        })
        .catch(error => console.error('Error:', error));
}

function searchStudentsBySection() {
    const sectionId = document.getElementById('sectionSearchInput').value;
    fetch(`/api/students_in_section/${encodeURIComponent(sectionId)}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('studentsInSectionList');
            container.innerHTML = '';

            if (!data.students || data.students.length === 0) {
                container.innerHTML = '<p>No students found in this section.</p>';
                return;
            }

            data.students.forEach(student => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <h4>${student.student_name}</h4>
                    <p>ID: ${student.student_id}</p>
                    <p>Address: ${student.student_address || 'N/A'}</p>
                    <p>Sections: 
                        ${student.section_id_1}, 
                        ${student.section_id_2}, 
                        ${student.section_id_3}, 
                        ${student.section_id_4}, 
                        ${student.section_id_5}
                    </p>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching students by section:', error);
            document.getElementById('studentsInSectionList').innerHTML = '<p>Error loading data.</p>';
        });
}

function getCoursesForStudent() {
    const studentName = document.getElementById('studentCourseInput').value;
    const output = document.getElementById('studentCoursesResult');
    output.innerHTML = '';  // Clear previous results

    fetch(`/api/student_courses/${encodeURIComponent(studentName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                output.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            if (!data.courses || data.courses.length === 0) {
                output.innerHTML = '<p>No courses found for this student.</p>';
                return;
            }

            // Display each course nicely
            data.courses.forEach(course => {
                const div = document.createElement('div');
                div.classList.add('course-entry');
                div.innerHTML = `
                    <h4>${course.course_name}</h4>
                    <ul>
                        <li><strong>Course Number:</strong> ${course.course_number}</li>
                        <li><strong>Credits:</strong> ${course.course_credits}</li>
                    </ul>
                `;
                output.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            output.innerHTML = '<p>Error retrieving courses.</p>';
        });
}

