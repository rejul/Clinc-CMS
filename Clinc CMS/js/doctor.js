// Check doctor role first - before any other code executes
const currentUser = checkUserRole('doctor');
if (!currentUser) {
    // If authentication fails, the page will redirect to login
    // No need to continue loading the rest of the script
    throw new Error('Authentication failed');
}

// Utility functions
function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
}

function getPatients() {
    return JSON.parse(localStorage.getItem('patients') || '[]');
}

function getConsultations() {
    return JSON.parse(localStorage.getItem('consultations') || '[]');
}

function saveConsultations(consultations) {
    localStorage.setItem('consultations', JSON.stringify(consultations));
}

function getCurrentDoctor() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Calculate age from date of birth
function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Load today's appointments for the logged-in doctor
function loadTodayAppointments() {
    const appointments = getAppointments();
    const patients = getPatients();
    const today = new Date().toISOString().split('T')[0];
    
    // Filter appointments for today and current doctor
    const todayAppointments = appointments.filter(apt => 
        apt.date === today && apt.doctor === currentUser.name
    );
    
    const appointmentsListDiv = document.getElementById('appointmentsList');
    
    if (todayAppointments.length === 0) {
        appointmentsListDiv.innerHTML = '<div class="alert alert-info">No appointments for today.</div>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-striped">';
    html += '<thead><tr><th>Token</th><th>Patient ID</th><th>Patient Name</th><th>Age</th><th>Time</th><th>Type</th><th>Action</th></tr></thead><tbody>';
    
    todayAppointments.forEach(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const age = patient ? calculateAge(patient.dob) : 'N/A';
        
        html += `<tr>
            <td><span class="badge bg-primary">${appointment.token}</span></td>
            <td>${appointment.patientId}</td>
            <td>${appointment.patientName}</td>
            <td>${age}</td>
            <td>${appointment.time}</td>
            <td><span class="badge bg-${appointment.type === 'OP' ? 'success' : 'warning'}">${appointment.type}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="startConsultation('${appointment.patientId}')">Start Consultation</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    appointmentsListDiv.innerHTML = html;
}

// Start consultation for a patient
function startConsultation(patientId) {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        alert('Patient not found!');
        return;
    }
    
    // Fill patient details
    document.getElementById('consultationPatientId').value = patient.id;
    document.getElementById('consultationPatientName').value = patient.name;
    document.getElementById('consultationPatientAge').value = calculateAge(patient.dob);
    document.getElementById('consultationPatientGender').value = patient.gender;
    document.getElementById('consultationPatientPhone').value = patient.phone;
    
    // Load patient history
    loadPatientHistory(patientId);
    
    // Switch to consultation tab
    const consultationTab = document.getElementById('consultation-tab');
    const tab = new bootstrap.Tab(consultationTab);
    tab.show();
}

// Load patient consultation history
function loadPatientHistory(patientId) {
    const consultations = getConsultations();
    const patientConsultations = consultations.filter(cons => cons.patientId === patientId);
    
    const historyDiv = document.getElementById('patientHistory');
    
    if (patientConsultations.length === 0) {
        historyDiv.innerHTML = '<p class="text-muted">No previous consultation history found.</p>';
        return;
    }
    
    let html = '';
    patientConsultations.forEach((consultation, index) => {
        html += `<div class="mb-3 p-3 border rounded">
            <h6>Consultation on ${consultation.date} by Dr. ${consultation.doctorName}</h6>
            <div class="row">
                <div class="col-md-6">
                    <strong>Symptoms:</strong> ${consultation.symptoms}<br>
                    <strong>Diagnosis:</strong> ${consultation.diagnosis}<br>
                    <strong>Notes:</strong> ${consultation.notes || 'N/A'}
                </div>
                <div class="col-md-6">
                    <strong>Prescription:</strong> ${consultation.prescription}<br>
                    <strong>Medicines:</strong> ${consultation.medicines}<br>
                    <strong>Lab Tests:</strong> ${consultation.labTests || 'N/A'}
                </div>
            </div>
        </div>`;
    });
    
    historyDiv.innerHTML = html;
}

// Auto-fill patient details when patient ID is entered
function setupPatientIdAutoFill() {
    const patientIdInput = document.getElementById('consultationPatientId');
    if (patientIdInput) {
        patientIdInput.addEventListener('blur', function() {
            const patientId = this.value.trim();
            if (patientId) {
                const patients = getPatients();
                const patient = patients.find(p => p.id === patientId);
                if (patient) {
                    document.getElementById('consultationPatientName').value = patient.name;
                    document.getElementById('consultationPatientAge').value = calculateAge(patient.dob);
                    document.getElementById('consultationPatientGender').value = patient.gender;
                    document.getElementById('consultationPatientPhone').value = patient.phone;
                    loadPatientHistory(patientId);
                } else {
                    alert('Patient not found!');
                    this.value = '';
                }
            }
        });
    }
}

// Save consultation data
function saveConsultation(formData) {
    const consultations = getConsultations();
    
    const consultation = {
        id: Date.now().toString(),
        patientId: formData.patientId,
        patientName: formData.patientName,
        doctorName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        prescription: formData.prescription,
        medicines: formData.medicines,
        labTests: formData.labTests,
        createdAt: new Date().toISOString()
    };
    
    consultations.push(consultation);
    saveConsultations(consultations);
    
    // Show success modal
    const modal = new bootstrap.Modal(document.getElementById('consultationModal'));
    modal.show();
    
    // Reset form
    document.getElementById('consultationForm').reset();
    document.getElementById('patientHistory').innerHTML = '';
}

// Refresh appointments
function refreshAppointments() {
    loadTodayAppointments();
}

function loadLabResults() {
    const labTests = JSON.parse(localStorage.getItem('labTests') || '[]');
    const patients = getPatients();
    // Show only lab tests for this doctor
    const doctorName = currentUser.name;
    const doctorLabTests = labTests.filter(test => test.doctorName === doctorName);

    const labResultsDiv = document.getElementById('labResultsList');
    if (!labResultsDiv) return;

    if (doctorLabTests.length === 0) {
        labResultsDiv.innerHTML = '<div class="alert alert-info">No lab results found for your patients.</div>';
        return;
    }

    let html = '<div class="d-flex justify-content-between align-items-center mb-3">';
    html += '<h6>Lab Results for Your Patients</h6>';
    html += '<button class="btn btn-primary btn-sm" onclick="loadLabResults()">Refresh</button>';
    html += '</div>';
    html += '<div class="table-responsive"><table class="table table-striped">';
    html += '<thead><tr><th>Patient ID</th><th>Patient Name</th><th>Test Name</th><th>Date</th><th>Actual</th><th>Low</th><th>High</th><th>Status</th><th>Observations</th><th>Actions</th></tr></thead><tbody>';

    doctorLabTests.forEach((test, index) => {
        let statusClass = 'success', statusText = 'Normal';
        if (test.actualReading > test.highRange) {
            statusClass = 'danger'; statusText = 'High';
        } else if (test.actualReading < test.lowRange) {
            statusClass = 'warning'; statusText = 'Low';
        }
        html += `<tr>
            <td>${test.patientId}</td>
            <td>${test.patientName}</td>
            <td>${test.testName}</td>
            <td>${test.testDate}</td>
            <td>${test.actualReading}</td>
            <td>${test.lowRange}</td>
            <td>${test.highRange}</td>
            <td><span class="badge bg-${statusClass}">${statusText}</span></td>
            <td>${test.observations}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewLabResult(${index})">View Details</button>
            </td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    labResultsDiv.innerHTML = html;
}

// View lab result details
function viewLabResult(index) {
    const labTests = JSON.parse(localStorage.getItem('labTests') || '[]');
    const doctorName = currentUser.name;
    const doctorLabTests = labTests.filter(test => test.doctorName === doctorName);
    const test = doctorLabTests[index];
    
    if (!test) return;
    
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
                <h6>Lab Test Report Details</h6>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Patient ID:</strong> ${test.patientId}</p>
                        <p><strong>Patient Name:</strong> ${test.patientName}</p>
                        <p><strong>Test Date:</strong> ${test.testDate}</p>
                        <p><strong>Test Name:</strong> ${test.testName}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>High Range:</strong> ${test.highRange}</p>
                        <p><strong>Low Range:</strong> ${test.lowRange}</p>
                        <p><strong>Actual Reading:</strong> ${test.actualReading}</p>
                        <p><strong>Status:</strong> <span class="badge bg-${statusClass}">${statusText}</span></p>
                    </div>
                </div>
                <div class="mt-3">
                    <p><strong>Observations:</strong></p>
                    <p>${test.observations}</p>
                </div>
            </div>
        </div>
    `;
    
    // Create a modal to show the report
    const modalHtml = `
        <div class="modal fade" id="viewLabResultModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Lab Test Report Details</h5>
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
    const existingModal = document.getElementById('viewLabResultModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body and show it
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('viewLabResultModal'));
    modal.show();
    
    // Remove modal from DOM after it's hidden
    document.getElementById('viewLabResultModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Initialize doctor dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Load today's appointments
    loadTodayAppointments();
    
    // Setup patient ID auto-fill
    setupPatientIdAutoFill();
    
    // Handle consultation form submission
    if (document.getElementById('consultationForm')) {
        document.getElementById('consultationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                patientId: document.getElementById('consultationPatientId').value,
                patientName: document.getElementById('consultationPatientName').value,
                symptoms: document.getElementById('symptoms').value,
                diagnosis: document.getElementById('diagnosis').value,
                notes: document.getElementById('notes').value,
                prescription: document.getElementById('prescription').value,
                medicines: document.getElementById('medicines').value,
                labTests: document.getElementById('labTests').value
            };
            
            if (!formData.patientId || !formData.patientName) {
                alert('Please enter a valid Patient ID first.');
                return;
            }
            
            saveConsultation(formData);
        });
    }

    // Handle password change form submission
    if (document.getElementById('passwordChangeForm')) {
        document.getElementById('passwordChangeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordChange();
        });
    }

    // Force password change if mustChangePassword is true
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.mustChangePassword) {
        const tab = new bootstrap.Tab(document.querySelector('#profile-tab'));
        tab.show();
        showPasswordMessage('You must change your password before using the system.', 'warning');
    }

    if (document.getElementById('labresults-tab')) {
        document.getElementById('labresults-tab').addEventListener('shown.bs.tab', function () {
            loadLabResults();
        });
    }
});

function handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Get current logged-in user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showPasswordMessage('Session expired. Please login again.', 'danger');
        return;
    }

    // Get staff list and find the user
    const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
    const userIndex = staffList.findIndex(staff =>
        staff.role === currentUser.role &&
        staff.email === currentUser.email
    );

    if (userIndex === -1) {
        showPasswordMessage('User profile not found. Please contact admin.', 'danger');
        return;
    }

    // Check if current password matches
    if (currentPassword !== staffList[userIndex].password) {
        showPasswordMessage('Current password is incorrect.', 'danger');
        return;
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        showPasswordMessage('New passwords do not match.', 'danger');
        return;
    }

    // Check password strength (minimum 8 characters)
    if (newPassword.length < 8) {
        showPasswordMessage('New password must be at least 8 characters long.', 'danger');
        return;
    }

    // Update password in staff list
    staffList[userIndex].password = newPassword;
    staffList[userIndex].mustChangePassword = false;
    localStorage.setItem('staffList', JSON.stringify(staffList));

    // Update current session
    currentUser.password = newPassword;
    currentUser.mustChangePassword = false;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showPasswordMessage('Password changed successfully!', 'success');
    document.getElementById('passwordChangeForm').reset();

    // Optionally reload after a short delay
    setTimeout(() => {
        location.reload();
    }, 1500);
}

function showPasswordMessage(message, type) {
    const messageDiv = document.getElementById('passwordMessage');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.classList.remove('d-none');
} 