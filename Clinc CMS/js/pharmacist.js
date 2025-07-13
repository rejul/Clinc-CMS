// Check pharmacist role first - before any other code executes
const currentUser = checkUserRole('pharmacist');
if (!currentUser) {
    // If authentication fails, the page will redirect to login
    // No need to continue loading the rest of the script
    throw new Error('Authentication failed');
}

// Utility functions
function getMedicines() {
    return JSON.parse(localStorage.getItem('medicines') || '[]');
}

function saveMedicines(medicines) {
    localStorage.setItem('medicines', JSON.stringify(medicines));
}

function getConsultations() {
    return JSON.parse(localStorage.getItem('consultations') || '[]');
}

function getPatients() {
    return JSON.parse(localStorage.getItem('patients') || '[]');
}

// Initialize pharmacist dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pharmacist module loaded');
    
    // Display pharmacist name
    const pharmacistName = document.getElementById('pharmacistName');
    if (pharmacistName && currentUser) {
        pharmacistName.textContent = currentUser.name;
    }
    
    // Load medicine list
    loadMedicineList();
    
    // Handle medicine form submission
    if (document.getElementById('medicineForm')) {
        document.getElementById('medicineForm').addEventListener('submit', function(e) {
            e.preventDefault();
            addMedicine();
        });
    }
    
    // Handle password change form submission
    if (document.getElementById('passwordChangeForm')) {
        document.getElementById('passwordChangeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
});

// Load and display medicine list
function loadMedicineList() {
    const medicines = getMedicines();
    const medicineListDiv = document.getElementById('medicineList');
    
    if (medicines.length === 0) {
        medicineListDiv.innerHTML = '<div class="alert alert-info">No medicines found. Add some medicines to get started.</div>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-striped">';
    html += '<thead><tr><th>Medicine Name</th><th>Quantity</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    
    medicines.forEach((medicine, index) => {
        const today = new Date();
        const expiryDate = new Date(medicine.expiryDate);
        const isExpired = expiryDate < today;
        const isExpiringSoon = expiryDate.getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000; // 30 days
        
        let statusClass = 'success';
        let statusText = 'Available';
        
        if (isExpired) {
            statusClass = 'danger';
            statusText = 'Expired';
        } else if (isExpiringSoon) {
            statusClass = 'warning';
            statusText = 'Expiring Soon';
        }
        
        html += `<tr>
            <td>${medicine.name}</td>
            <td>${medicine.quantity}</td>
            <td>${medicine.expiryDate}</td>
            <td><span class="badge bg-${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editMedicine(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteMedicine(${index})">Delete</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    medicineListDiv.innerHTML = html;
}

// Add new medicine
function addMedicine() {
    const medicines = getMedicines();
    const medicine = {
        id: Date.now().toString(),
        name: document.getElementById('medicineName').value,
        quantity: parseInt(document.getElementById('medicineQuantity').value),
        expiryDate: document.getElementById('medicineExpiry').value,
        createdAt: new Date().toISOString()
    };
    
    medicines.push(medicine);
    saveMedicines(medicines);
    
    alert('Medicine added successfully!');
    document.getElementById('medicineForm').reset();
    loadMedicineList();
}

// Edit medicine
function editMedicine(index) {
    const medicines = getMedicines();
    const medicine = medicines[index];
    
    document.getElementById('editMedicineName').value = medicine.name;
    document.getElementById('editMedicineQuantity').value = medicine.quantity;
    document.getElementById('editMedicineExpiry').value = medicine.expiryDate;
    
    // Store the index for update
    document.getElementById('medicineModal').setAttribute('data-edit-index', index);
    
    const modal = new bootstrap.Modal(document.getElementById('medicineModal'));
    modal.show();
}

// Update medicine
function updateMedicine() {
    const medicines = getMedicines();
    const editIndex = document.getElementById('medicineModal').getAttribute('data-edit-index');
    
    if (editIndex !== null) {
        const index = parseInt(editIndex);
        medicines[index].name = document.getElementById('editMedicineName').value;
        medicines[index].quantity = parseInt(document.getElementById('editMedicineQuantity').value);
        medicines[index].expiryDate = document.getElementById('editMedicineExpiry').value;
        
        saveMedicines(medicines);
        loadMedicineList();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('medicineModal'));
        modal.hide();
        
        alert('Medicine updated successfully!');
    }
}

// Delete medicine
function deleteMedicine(index) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    const medicines = getMedicines();
    medicines.splice(index, 1);
    saveMedicines(medicines);
    loadMedicineList();
    
    alert('Medicine deleted successfully!');
}

// Search prescriptions
function searchPrescriptions() {
    const patientId = document.getElementById('searchPatientId').value.trim();
    const patientName = document.getElementById('searchPatientName').value.trim();
    
    const consultations = getConsultations();
    const patients = getPatients();
    let results = [];
    
    if (patientId) {
        results = consultations.filter(cons => cons.patientId === patientId);
    } else if (patientName) {
        results = consultations.filter(cons => 
            cons.patientName.toLowerCase().includes(patientName.toLowerCase())
        );
    }
    
    displayPrescriptionResults(results);
}

// Clear prescription search
function clearPrescriptionSearch() {
    document.getElementById('searchPatientId').value = '';
    document.getElementById('searchPatientName').value = '';
    document.getElementById('prescriptionResults').innerHTML = '';
}

// Display prescription search results
function displayPrescriptionResults(consultations) {
    const resultsDiv = document.getElementById('prescriptionResults');
    
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
                        <strong>Prescription:</strong><br>
                        <p>${consultation.prescription}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <strong>Medicines:</strong><br>
                        <p>${consultation.medicines}</p>
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

// Change password functionality
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showPasswordModal('Please fill in all password fields.', 'danger');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showPasswordModal('New password and confirm password do not match.', 'danger');
        return;
    }
    
    if (newPassword.length < 6) {
        showPasswordModal('New password must be at least 6 characters long.', 'danger');
        return;
    }
    
    // Get staff data
    const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
    const userIndex = staffList.findIndex(staff =>
        staff.email === currentUser.email
    );
    
    if (userIndex === -1) {
        showPasswordModal('Staff member not found.', 'danger');
        return;
    }
    
    // Check current password
    if (currentPassword !== staffList[userIndex].password) {
        showPasswordModal('Current password is incorrect.', 'danger');
        return;
    }
    
    // Update password
    staffList[userIndex].password = newPassword;
    staffList[userIndex].mustChangePassword = false;
    localStorage.setItem('staffList', JSON.stringify(staffList));
    
    // Update current user session
    const sessionUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    sessionUser.password = newPassword;
    sessionUser.mustChangePassword = false;
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    
    // Show success message
    showPasswordModal('Password changed successfully!', 'success');
    
    // Reset form
    document.getElementById('passwordChangeForm').reset();
}

// Show password change modal
function showPasswordModal(message, type) {
    const modalBody = document.getElementById('passwordChangeModalBody');
    modalBody.innerHTML = `<div class="alert alert-${type} mb-0">${message}</div>`;
    
    const modal = new bootstrap.Modal(document.getElementById('passwordChangeModal'));
    modal.show();
} 