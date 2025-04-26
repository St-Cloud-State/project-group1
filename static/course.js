// Array to store book data
const students = []; //was const book = [];
const courses = [];
const section = [];
const rubric = [];

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
    
    // Send request with better error handling
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
        