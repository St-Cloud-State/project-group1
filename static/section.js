// Array to store book data
const students = []; //was const book = [];
const courses = [];
const section = [];
const rubric = [];
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

