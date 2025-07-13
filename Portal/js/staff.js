// Check admin role first - before any other code executes
const currentUser = checkUserRole('admin');
if (!currentUser) {
    // If authentication fails, the page will redirect to login
    // No need to continue loading the rest of the script
    throw new Error('Authentication failed');
}

// Utility: Get staff list from localStorage
function getStaffList() {
    return JSON.parse(localStorage.getItem('staffList') || '[]');
}

// Utility: Save staff list to localStorage
function saveStaffList(list) {
    localStorage.setItem('staffList', JSON.stringify(list));
}

// Utility: Generate default password
function generateDefaultPassword() {
    return 'Welcome@123';
}

// Populate staff table
function populateStaffTable() {
    const tbody = document.querySelector('#staffTable tbody');
    tbody.innerHTML = '';
    const staffList = getStaffList();
    staffList.forEach((staff, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${staff.name}</td>
            <td>${staff.role}</td>
            <td>${staff.email}</td>
            <td>${staff.phone}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editStaff(${idx})">Edit</button>
                <button class="btn btn-sm btn-warning me-1" onclick="resetPassword(${idx})">Reset Password</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStaff(${idx})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Show/hide doctor fields
function handleRoleChange() {
    const role = document.getElementById('role').value;
    const doctorFields = document.getElementById('doctorFields');
    if (role === 'doctor') {
        doctorFields.classList.remove('d-none');
        document.getElementById('specialization').required = true;
        document.getElementById('fee').required = true;
    } else {
        doctorFields.classList.add('d-none');
        document.getElementById('specialization').required = false;
        document.getElementById('fee').required = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin module loaded');
    
    // Add dummy staff if staffList is empty
    let staffList = getStaffList();
    if (staffList.length === 1) {
        staffList = [
            {
                name: 'Dr. John Doe',
                dob: '1980-05-15',
                gender: 'Male',
                phone: '9000000001',
                address: '123 Main St',
                email: 'doctor1@clinic.com',
                role: 'doctor',
                specialization: 'Cardiology',
                fee: '500',
                days: ['Monday', 'Wednesday', 'Friday'],
                startTime: '09:00',
                endTime: '17:00',
                password: generateDefaultPassword()
            },
            {
                name: 'Pharma Jane',
                dob: '1985-08-20',
                gender: 'Female',
                phone: '9000000002',
                address: '456 Elm St',
                email: 'pharma1@clinic.com',
                role: 'pharmacist',
                specialization: '',
                fee: '',
                days: ['Monday', 'Tuesday', 'Thursday'],
                startTime: '10:00',
                endTime: '18:00',
                password: generateDefaultPassword()
            },
            {
                name: 'Lab Sam',
                dob: '1990-03-10',
                gender: 'Other',
                phone: '9000000003',
                address: '789 Oak St',
                email: 'lab1@clinic.com',
                role: 'lab technician',
                specialization: '',
                fee: '',
                days: ['Tuesday', 'Thursday'],
                startTime: '08:00',
                endTime: '16:00',
                password: generateDefaultPassword()
            },
            {
                name: 'Reception Max',
                dob: '1992-12-01',
                gender: 'Male',
                phone: '9000000004',
                address: '321 Pine St',
                email: 'recept1@clinic.com',
                role: 'receptionist',
                specialization: '',
                fee: '',
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                startTime: '08:30',
                endTime: '17:30',
                password: generateDefaultPassword()
            }
        ];
        saveStaffList(staffList);
    }
    
    console.log('Admin role verified, initializing...');
    populateStaffTable();
    document.getElementById('role').addEventListener('change', handleRoleChange);
    
    // Clear error styling when user types in email field
    document.getElementById('email').addEventListener('input', function() {
        this.classList.remove('is-invalid');
        const errorDiv = this.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    });
    document.getElementById('phone').addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
    document.getElementById('dob').addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
    document.getElementById('staffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const staffList = getStaffList();
        const name = document.getElementById('name').value;
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;
        const specialization = document.getElementById('specialization').value;
        const fee = document.getElementById('fee').value;
        const days = [];
        ['mon','tue','wed','thu','fri','sat','sun'].forEach(day => {
            if (document.getElementById(day).checked) days.push(document.getElementById(day).value);
        });
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        
        // Phone number validation
        const phoneField = document.getElementById('phone');
        if (!/^\d{10}$/.test(phone)) {
            phoneField.classList.add('is-invalid');
            phoneField.focus();
            return;
        } else {
            phoneField.classList.remove('is-invalid');
        }

        // Age validation
        const dobField = document.getElementById('dob');
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age <= 20) {
            dobField.classList.add('is-invalid');
            dobField.focus();
            return;
        } else {
            dobField.classList.remove('is-invalid');
        }
        
        // Check for duplicate email
        const existingStaff = staffList.find(staff => staff.email.toLowerCase() === email.toLowerCase());
        if (existingStaff) {
            // Show error message
            const emailField = document.getElementById('email');
            emailField.classList.add('is-invalid');
            
            // Create or update error message
            let errorDiv = emailField.parentNode.querySelector('.invalid-feedback');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                emailField.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = 'Staff already exists with this email address!';
            
            emailField.focus();
            return;
        }
        
        // Check for duplicate phone number
        const existingPhone = staffList.find(staff => staff.phone === phone);
        if (existingPhone) {
            const phoneField = document.getElementById('phone');
            phoneField.classList.add('is-invalid');
            let phoneErrorDiv = document.getElementById('phoneError');
            if (phoneErrorDiv) {
                phoneErrorDiv.textContent = 'Staff already exists with this phone number!';
            }
            phoneField.focus();
            return;
        } else {
            // Reset phone error message if not duplicate
            let phoneErrorDiv = document.getElementById('phoneError');
            if (phoneErrorDiv) {
                phoneErrorDiv.textContent = 'Phone number must be exactly 10 digits and contain only numbers (no spaces or symbols).';
            }
        }
        
        // Remove any existing error styling
        const emailField = document.getElementById('email');
        emailField.classList.remove('is-invalid');
        const errorDiv = emailField.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        const staff = {
            name, dob, gender, phone, address, email, role,
            specialization: role === 'doctor' ? specialization : '',
            fee: role === 'doctor' ? fee : '',
            days, startTime, endTime,
            password: generateDefaultPassword()
        };
        staffList.push(staff);
        saveStaffList(staffList);
        populateStaffTable();
        // Show credentials modal
        document.getElementById('credEmail').textContent = email;
        document.getElementById('credPassword').textContent = staff.password;
        var modal = new bootstrap.Modal(document.getElementById('credentialsModal'));
        modal.show();
        document.getElementById('staffForm').reset();
        handleRoleChange();
    });

    // Admin password change logic
    const passwordForm = document.getElementById('passwordChangeForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageDiv = document.getElementById('passwordMessage');
            messageDiv.classList.add('d-none');

            // Get current admin from localStorage
            let staffList = getStaffList();
            let admin = staffList.find(s => s.role === 'admin');
            if (!admin) {
                messageDiv.textContent = 'Admin account not found.';
                messageDiv.className = 'alert alert-danger mt-3';
                messageDiv.classList.remove('d-none');
                return;
            }
            if (currentPassword !== admin.password) {
                messageDiv.textContent = 'Current password is incorrect.';
                messageDiv.className = 'alert alert-danger mt-3';
                messageDiv.classList.remove('d-none');
                return;
            }
            if (newPassword.length < 6) {
                messageDiv.textContent = 'New password must be at least 6 characters.';
                messageDiv.className = 'alert alert-warning mt-3';
                messageDiv.classList.remove('d-none');
                return;
            }
            if (newPassword !== confirmPassword) {
                messageDiv.textContent = 'New password and confirmation do not match.';
                messageDiv.className = 'alert alert-warning mt-3';
                messageDiv.classList.remove('d-none');
                return;
            }
            // Update password
            admin.password = newPassword;
            // Also update in localStorage
            staffList = staffList.map(s => s.role === 'admin' ? admin : s);
            saveStaffList(staffList);
            // Update currentUser if logged in as admin
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.role === 'admin') {
                currentUser.password = newPassword;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            messageDiv.textContent = 'Password changed successfully!';
            messageDiv.className = 'alert alert-success mt-3';
            messageDiv.classList.remove('d-none');
            passwordForm.reset();
        });
    }
});

// Edit staff
function editStaff(idx) {
    const staffList = getStaffList();
    const staff = staffList[idx];
    document.getElementById('name').value = staff.name;
    document.getElementById('dob').value = staff.dob;
    document.getElementById('gender').value = staff.gender;
    document.getElementById('phone').value = staff.phone;
    document.getElementById('address').value = staff.address;
    document.getElementById('email').value = staff.email;
    document.getElementById('role').value = staff.role;
    handleRoleChange();
    document.getElementById('specialization').value = staff.specialization || '';
    document.getElementById('fee').value = staff.fee || '';
    ['mon','tue','wed','thu','fri','sat','sun'].forEach(day => {
        document.getElementById(day).checked = staff.days.includes(document.getElementById(day).value);
    });
    document.getElementById('startTime').value = staff.startTime;
    document.getElementById('endTime').value = staff.endTime;
    
    // Store the original email for duplicate check during edit
    const originalEmail = staff.email;
    
    // Remove the old staff on next submit
    document.getElementById('staffForm').onsubmit = function(e) {
        e.preventDefault();
        const newEmail = document.getElementById('email').value;
        
        // Check for duplicate email (excluding the current staff being edited)
        const existingStaff = staffList.find((s, i) => 
            i !== idx && s.email.toLowerCase() === newEmail.toLowerCase()
        );
        
        if (existingStaff) {
            // Show error message
            const emailField = document.getElementById('email');
            emailField.classList.add('is-invalid');
            
            // Create or update error message
            let errorDiv = emailField.parentNode.querySelector('.invalid-feedback');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                emailField.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = 'Staff already exists with this email address!';
            
            emailField.focus();
            return;
        }
        
        // Remove any existing error styling
        const emailField = document.getElementById('email');
        emailField.classList.remove('is-invalid');
        const errorDiv = emailField.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        staffList.splice(idx, 1);
        saveStaffList(staffList);
        document.getElementById('staffForm').onsubmit = null;
        document.getElementById('staffForm').dispatchEvent(new Event('submit'));
    };
}

// Delete staff
function deleteStaff(idx) {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    const staffList = getStaffList();
    staffList.splice(idx, 1);
    saveStaffList(staffList);
    populateStaffTable();
}

// Reset password
function resetPassword(idx) {
    const staffList = getStaffList();
    const staff = staffList[idx];
    
    if (!confirm(`Are you sure you want to reset the password for ${staff.name} (${staff.email})?\n\nThis will reset their password to the default password.`)) {
        return;
    }
    
    // Reset to default password
    staff.password = generateDefaultPassword();
    saveStaffList(staffList);
    
    // Show success message with new credentials
    document.getElementById('credEmail').textContent = staff.email;
    document.getElementById('credPassword').textContent = staff.password;
    document.getElementById('credentialsModalLabel').textContent = 'Password Reset Successful';
    
    // Update the info message for password reset
    const infoDiv = document.querySelector('#credentialsModal .alert');
    if (infoDiv) {
        infoDiv.innerHTML = '<small><i class="bi bi-info-circle"></i> Password has been reset to default. The user should change this password after their next login.</small>';
    }
    
    var modal = new bootstrap.Modal(document.getElementById('credentialsModal'));
    modal.show();
    
    // Reset modal title and info message back to original after modal closes
    modal._element.addEventListener('hidden.bs.modal', function() {
        document.getElementById('credentialsModalLabel').textContent = 'Generated Credentials';
        if (infoDiv) {
            infoDiv.innerHTML = '<small><i class="bi bi-info-circle"></i> The user should change this password after their first login.</small>';
        }
    }, { once: true });
} 