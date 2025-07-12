// Check lab technician role first - before any other code executes
const currentUser = checkUserRole('lab technician');
if (!currentUser) {
    // If authentication fails, the page will redirect to login
    // No need to continue loading the rest of the script
    throw new Error('Authentication failed');
}

// Utility functions
function getLabTests() {
    return JSON.parse(localStorage.getItem('labTests') || '[]');
}

function saveLabTests(labTests) {
    localStorage.setItem('labTests', JSON.stringify(labTests));
}

function getConsultations() {
    return JSON.parse(localStorage.getItem('consultations') || '[]');
}

function getPatients() {
    return JSON.parse(localStorage.getItem('patients') || '[]');
}

// Initialize lab technician dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lab Technician module loaded');
    
    // Display lab technician name
    const labTechnicianName = document.getElementById('labTechnicianName');
    if (labTechnicianName && currentUser) {
        labTechnicianName.textContent = currentUser.name;
    }
    
    // Load lab tests list
    loadLabTestsList();
    
    // Set today's date for test report form
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('reportTestDate')) {
        document.getElementById('reportTestDate').value = today;
    }
    
    // Handle test report form submission
    if (document.getElementById('testReportForm')) {
        document.getElementById('testReportForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveTestReport();
        });
    }
    
    // Auto-fill patient name when patient ID is entered
    if (document.getElementById('reportPatientId')) {
        document.getElementById('reportPatientId').addEventListener('blur', function() {
            const patientId = this.value.trim();
            if (patientId) {
                const patients = getPatients();
                const patient = patients.find(p => p.id === patientId);
                if (patient) {
                    document.getElementById('reportPatientName').value = patient.name;
                } else {
                    document.getElementById('reportPatientName').value = '';
                    alert('Patient not found!');
                }
            }
        });
    }
});

// Load and display lab tests list
function loadLabTestsList() {
    const labTests = getLabTests();
    const labTestsListDiv = document.getElementById('labTestsList');
    
    if (labTests.length === 0) {
        labTestsListDiv.innerHTML = '<div class="alert alert-info">No lab tests found. Create test reports to see them here.</div>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-striped">';
    html += '<thead><tr><th>Patient ID</th><th>Patient Name</th><th>Test Name</th><th>Test Date</th><th>Doctor</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    
    labTests.forEach((test, index) => {
        const actualReading = parseFloat(test.actualReading);
        const highRange = parseFloat(test.highRange);
        const lowRange = parseFloat(test.lowRange);
        
        let statusClass = 'success';
        let statusText = 'Normal';
        
        if (actualReading > highRange) {
            statusClass = 'danger';
            statusText = 'High';
        } else if (actualReading < lowRange) {
            statusClass = 'warning';
            statusText = 'Low';
        }
        
        html += `<tr>
            <td>${test.patientId}</td>
            <td>${test.patientName}</td>
            <td>${test.testName}</td>
            <td>${test.testDate}</td>
            <td>${test.doctorName}</td>
            <td><span class="badge bg-${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="viewTestReport(${index})">View</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTestReport(${index})">Delete</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    labTestsListDiv.innerHTML = html;
}

// Save test report
function saveTestReport() {
    const labTests = getLabTests();
    const testReport = {
        id: Date.now().toString(),
        patientId: document.getElementById('reportPatientId').value,
        patientName: document.getElementById('reportPatientName').value,
        doctorName: document.getElementById('reportDoctorName').value,
        testDate: document.getElementById('reportTestDate').value,
        testName: document.getElementById('reportTestName').value,
        highRange: parseFloat(document.getElementById('reportHighRange').value),
        lowRange: parseFloat(document.getElementById('reportLowRange').value),
        actualReading: parseFloat(document.getElementById('reportActualReading').value),
        observations: document.getElementById('reportObservations').value,
        createdBy: currentUser.name,
        createdAt: new Date().toISOString()
    };
    
    labTests.push(testReport);
    saveLabTests(labTests);
    
    // Show success modal
    const modal = new bootstrap.Modal(document.getElementById('testReportModal'));
    modal.show();
    
    // Reset form
    document.getElementById('testReportForm').reset();
    document.getElementById('reportTestDate').value = new Date().toISOString().split('T')[0];
    
    // Reload lab tests list
    loadLabTestsList();
}

// View test report details
function viewTestReport(index) {
    const labTests = getLabTests();
    const test = labTests[index];
    
    const actualReading = parseFloat(test.actualReading);
    const highRange = parseFloat(test.highRange);
    const lowRange = parseFloat(test.lowRange);
    
    let statusClass = 'success';
    let statusText = 'Normal';
    
    if (actualReading > highRange) {
        statusClass = 'danger';
        statusText = 'High';
    } else if (actualReading < lowRange) {
        statusClass = 'warning';
        statusText = 'Low';
    }
    
    const reportHtml = `
        <div class="card">
            <div class="card-header">
                <h6>Test Report Details</h6>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Patient ID:</strong> ${test.patientId}</p>
                        <p><strong>Patient Name:</strong> ${test.patientName}</p>
                        <p><strong>Doctor:</strong> ${test.doctorName}</p>
                        <p><strong>Test Date:</strong> ${test.testDate}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Test Name:</strong> ${test.testName}</p>
                        <p><strong>High Range:</strong> ${test.highRange}</p>
                        <p><strong>Low Range:</strong> ${test.lowRange}</p>
                        <p><strong>Actual Reading:</strong> ${test.actualReading}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <p><strong>Status:</strong> <span class="badge bg-${statusClass}">${statusText}</span></p>
                    <p><strong>Observations:</strong></p>
                    <p>${test.observations}</p>
                </div>
            </div>
        </div>
    `;
    
    // Create a modal to show the report
    const modalHtml = `
        <div class="modal fade" id="viewTestModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Test Report Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${reportHtml}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('viewTestModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body and show it
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('viewTestModal'));
    modal.show();
    
    // Remove modal from DOM after it's hidden
    document.getElementById('viewTestModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Delete test report
function deleteTestReport(index) {
    if (!confirm('Are you sure you want to delete this test report?')) return;
    
    const labTests = getLabTests();
    labTests.splice(index, 1);
    saveLabTests(labTests);
    loadLabTestsList();
    
    alert('Test report deleted successfully!');
}

// Search lab prescriptions
function searchLabPrescriptions() {
    const patientId = document.getElementById('searchLabPatientId').value.trim();
    const patientName = document.getElementById('searchLabPatientName').value.trim();
    
    const consultations = getConsultations();
    let results = [];
    
    if (patientId) {
        results = consultations.filter(cons => cons.patientId === patientId);
    } else if (patientName) {
        results = consultations.filter(cons => 
            cons.patientName.toLowerCase().includes(patientName.toLowerCase())
        );
    }
    
    displayLabPrescriptionResults(results);
}

// Clear lab prescription search
function clearLabPrescriptionSearch() {
    document.getElementById('searchLabPatientId').value = '';
    document.getElementById('searchLabPatientName').value = '';
    document.getElementById('labPrescriptionResults').innerHTML = '';
}

// Display lab prescription search results
function displayLabPrescriptionResults(consultations) {
    const resultsDiv = document.getElementById('labPrescriptionResults');
    
    if (consultations.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-info">No prescriptions found.</div>';
        return;
    }
    
    let html = '';
    consultations.forEach(consultation => {
        html += `<div class="card mb-3">
            <div class="card-header">
                <h6 class="mb-0">Patient: ${consultation.patientName} (ID: ${consultation.patientId})</h6>
                <small class="text-muted">Consultation Date: ${consultation.date} | Doctor: ${consultation.doctorName}</small>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <strong>Diagnosis:</strong><br>
                        <p>${consultation.diagnosis}</p>
                    </div>
                    <div class="col-md-6">
                        <strong>Lab Tests:</strong><br>
                        <p>${consultation.labTests || 'None'}</p>
                    </div>
                </div>
                ${consultation.notes ? `<div class="mt-3"><strong>Notes:</strong><br><p>${consultation.notes}</p></div>` : ''}
            </div>
        </div>`;
    });
    
    resultsDiv.innerHTML = html;
} 