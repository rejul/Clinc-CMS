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
}); 