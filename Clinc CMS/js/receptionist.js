// Check receptionist role first - before any other code executes
const currentUser = checkUserRole('receptionist');
if (!currentUser) {
    // If authentication fails, the page will redirect to login
    // No need to continue loading the rest of the script
    throw new Error('Authentication failed');
}

// Utility functions
function getPatients() {
    return JSON.parse(localStorage.getItem('patients') || '[]');
}

function savePatients(patients) {
    localStorage.setItem('patients', JSON.stringify(patients));
}

function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
}

function saveAppointments(appointments) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function getStaffList() {
    return JSON.parse(localStorage.getItem('staffList') || '[]');
}

// Generate unique patient ID
function generatePatientId() {
    const patients = getPatients();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `P${timestamp}${random}`;
}

// Generate appointment ID
function generateAppointmentId() {
    const appointments = getAppointments();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `APT${timestamp}${random}`;
}

// Generate token number
function generateToken() {
    const appointments = getAppointments();
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    return todayAppointments.length + 1;
}

// Load doctors for appointment form
function loadDoctors() {
    const staffList = getStaffList();
    const doctors = staffList.filter(staff => staff.role === 'doctor');
    const doctorSelect = document.getElementById('appointmentDoctor');
    const reportDoctorSelect = document.getElementById('reportDoctor');
    
    if (doctorSelect) {
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doctor => {
            doctorSelect.innerHTML += `<option value="${doctor.name}">${doctor.name} (${doctor.specialization})</option>`;
        });
    }
    
    if (reportDoctorSelect) {
        reportDoctorSelect.innerHTML = '<option value="">All Doctors</option>';
        doctors.forEach(doctor => {
            reportDoctorSelect.innerHTML += `<option value="${doctor.name}">${doctor.name}</option>`;
        });
    }
}

// Patient form handling
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('patientForm')) {
        document.getElementById('patientForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const patients = getPatients();
            const patient = {
                id: generatePatientId(),
                name: document.getElementById('patientName').value,
                dob: document.getElementById('patientDob').value,
                gender: document.getElementById('patientGender').value,
                phone: document.getElementById('patientPhone').value,
                address: document.getElementById('patientAddress').value,
                email: document.getElementById('patientEmail').value || '',
                createdAt: new Date().toISOString()
            };
            
            patients.push(patient);
            savePatients(patients);
            
            alert(`Patient added successfully!\nPatient ID: ${patient.id}`);
            document.getElementById('patientForm').reset();
        });
    }
    
    // Load doctors when page loads
    loadDoctors();
    
    // Set today's date for appointment and report forms
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('appointmentDate')) {
        document.getElementById('appointmentDate').value = today;
    }
    if (document.getElementById('reportDate')) {
        document.getElementById('reportDate').value = today;
    }
    
    // Password change form handling
    if (document.getElementById('passwordChangeForm')) {
        document.getElementById('passwordChangeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordChange();
        });
    }
});

// Patient search functionality
function searchPatients() {
    const searchById = document.getElementById('searchById').value.trim();
    const searchByName = document.getElementById('searchByName').value.trim();
    const searchByPhone = document.getElementById('searchByPhone').value.trim();
    
    const patients = getPatients();
    let results = [];
    
    if (searchById) {
        results = patients.filter(patient => patient.id.toLowerCase().includes(searchById.toLowerCase()));
    } else if (searchByName) {
        results = patients.filter(patient => patient.name.toLowerCase().includes(searchByName.toLowerCase()));
    } else if (searchByPhone) {
        results = patients.filter(patient => patient.phone.includes(searchByPhone));
    }
    
    displaySearchResults(results);
}

function clearSearch() {
    document.getElementById('searchById').value = '';
    document.getElementById('searchByName').value = '';
    document.getElementById('searchByPhone').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function displaySearchResults(patients) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (patients.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-info">No patients found.</div>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-striped">';
    html += '<thead><tr><th>Patient ID</th><th>Name</th><th>DOB</th><th>Gender</th><th>Phone</th><th>Email</th></tr></thead><tbody>';
    
    patients.forEach(patient => {
        html += `<tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.dob}</td>
            <td>${patient.gender}</td>
            <td>${patient.phone}</td>
            <td>${patient.email || '-'}</td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    resultsDiv.innerHTML = html;
}

// Appointment form handling
if (document.getElementById('appointmentForm')) {
    document.getElementById('appointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const patientId = document.getElementById('appointmentPatientId').value;
        const patients = getPatients();
        const patient = patients.find(p => p.id === patientId);
        
        if (!patient) {
            alert('Patient not found! Please enter a valid Patient ID.');
            return;
        }
        
        const staffList = getStaffList();
        const doctor = staffList.find(s => s.name === document.getElementById('appointmentDoctor').value);
        
        if (!doctor) {
            alert('Please select a valid doctor.');
            return;
        }
        
        const appointments = getAppointments();
        const appointment = {
            id: generateAppointmentId(),
            patientId: patientId,
            patientName: patient.name,
            doctor: document.getElementById('appointmentDoctor').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            type: document.getElementById('appointmentType').value,
            notes: document.getElementById('appointmentNotes').value,
            token: generateToken(),
            consultationFee: doctor.fee || 500,
            createdAt: new Date().toISOString()
        };
        
        appointments.push(appointment);
        saveAppointments(appointments);
        
        // Show appointment details modal
        showAppointmentDetails(appointment);
        
        document.getElementById('appointmentForm').reset();
        document.getElementById('appointmentDate').value = new Date().toISOString().split('T')[0];
    });
}

// Auto-fill patient name when patient ID is entered
if (document.getElementById('appointmentPatientId')) {
    document.getElementById('appointmentPatientId').addEventListener('blur', function() {
        const patientId = this.value.trim();
        if (patientId) {
            const patients = getPatients();
            const patient = patients.find(p => p.id === patientId);
            if (patient) {
                document.getElementById('appointmentPatientName').value = patient.name;
            } else {
                document.getElementById('appointmentPatientName').value = '';
                alert('Patient not found!');
            }
        }
    });
}

function showAppointmentDetails(appointment) {
    document.getElementById('modalAppointmentId').textContent = appointment.id;
    document.getElementById('modalPatientId').textContent = appointment.patientId;
    document.getElementById('modalPatientName').textContent = appointment.patientName;
    document.getElementById('modalDoctor').textContent = appointment.doctor;
    document.getElementById('modalDate').textContent = appointment.date;
    document.getElementById('modalTime').textContent = appointment.time;
    document.getElementById('modalType').textContent = appointment.type;
    document.getElementById('modalToken').textContent = appointment.token;
    document.getElementById('modalFee').textContent = appointment.consultationFee;
    document.getElementById('modalTotal').textContent = appointment.consultationFee;
    
    const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
    modal.show();
}

function printAppointment() {
    window.print();
}

// Password change functionality
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
    const staffList = getStaffList();
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
    saveStaffList(staffList);
    
    // Update current session
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showPasswordMessage('Password changed successfully!', 'success');
    document.getElementById('passwordChangeForm').reset();
}

function showPasswordMessage(message, type) {
    const messageDiv = document.getElementById('passwordMessage');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.classList.remove('d-none');
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add('d-none');
    }, 3000);
}

// Report generation
function generateReport() {
    const date = document.getElementById('reportDate').value;
    const doctorFilter = document.getElementById('reportDoctor').value;
    
    const appointments = getAppointments();
    let filteredAppointments = appointments.filter(apt => apt.date === date);
    
    if (doctorFilter) {
        filteredAppointments = filteredAppointments.filter(apt => apt.doctor === doctorFilter);
    }
    
    displayReport(filteredAppointments, date, doctorFilter);
}

function displayReport(appointments, date, doctorFilter) {
    const summaryDiv = document.getElementById('reportSummary');
    const detailsDiv = document.getElementById('reportDetails');
    
    // Calculate totals
    const totalConsultations = appointments.length;
    const totalRevenue = appointments.reduce((sum, apt) => sum + apt.consultationFee, 0);
    
    // Summary
    summaryDiv.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Consultations</h5>
                        <h3>${totalConsultations}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Revenue</h5>
                        <h3>₹${totalRevenue}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <h5 class="card-title">Date</h5>
                        <h3>${date}</h3>
                    </div>
                </div>
            </div>
        </div>
        ${doctorFilter ? `<p class="mt-3"><strong>Filtered by:</strong> ${doctorFilter}</p>` : ''}
    `;
    
    // Details table
    if (appointments.length === 0) {
        detailsDiv.innerHTML = '<div class="alert alert-info">No consultations found for the selected criteria.</div>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-striped">';
    html += '<thead><tr><th>Token</th><th>Patient ID</th><th>Patient Name</th><th>Doctor</th><th>Time</th><th>Type</th><th>Fee</th></tr></thead><tbody>';
    
    appointments.forEach(apt => {
        html += `<tr>
            <td>${apt.token}</td>
            <td>${apt.patientId}</td>
            <td>${apt.patientName}</td>
            <td>${apt.doctor}</td>
            <td>${apt.time}</td>
            <td>${apt.type}</td>
            <td>₹${apt.consultationFee}</td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    detailsDiv.innerHTML = html;
} 