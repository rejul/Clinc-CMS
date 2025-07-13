// Show password message function (available to all modules)
function showPasswordMessage(message, type) {
    // Check if we're on a page with the password change modal
    const modal = document.getElementById('passwordChangeModal');
    if (modal) {
        // Show modal popup
        const modalBody = document.getElementById('passwordChangeModalBody');
        if (modalBody) {
            modalBody.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    } else {
        // Fallback to alert if modal doesn't exist
        alert(message);
    }
}

// Create default admin account if not exists
function createDefaultAdmin() {
    const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
    const adminExists = staffList.find(s => s.role === 'admin');
    
    if (!adminExists) {
        const defaultAdmin = {
            name: 'Administrator',
            dob: '1990-01-01',
            gender: 'Other',
            phone: '1234567890',
            address: 'Clinc Admin',
            email: 'admin@clinc.com',
            role: 'admin',
            specialization: '',
            fee: '',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            startTime: '09:00',
            endTime: '17:00',
            password: 'Admin@123',
            createdAt: new Date().toISOString()
        };
        staffList.push(defaultAdmin);
        localStorage.setItem('staffList', JSON.stringify(staffList));
    }
}

// Unified authentication for all staff members
document.addEventListener('DOMContentLoaded', function() {
    // Create default admin on first load
    createDefaultAdmin();
    
    if (document.getElementById('unifiedLoginForm')) {
        document.getElementById('unifiedLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get staff list and check credentials
            const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
            const staff = staffList.find(s => 
                s.email === email && 
                s.password === password
            );
            
            if (staff) {
                // Store user session
                localStorage.setItem('currentUser', JSON.stringify(staff));
                
                if (staff.password === "Welcome@123") {
                    staff.mustChangePassword = true;
                    localStorage.setItem('currentUser', JSON.stringify(staff));
                } else {
                    staff.mustChangePassword = false;
                    localStorage.setItem('currentUser', JSON.stringify(staff));
                }
                localStorage.setItem('userLoggedIn', 'true');
                
                // Redirect based on role
                switch (staff.role) {
                    case 'admin':
                        window.location.href = 'admin.html';
                        break;
                    case 'receptionist':
                        window.location.href = 'receptionist.html';
                        break;
                    case 'doctor':
                        window.location.href = 'doctor.html';
                        break;
                    case 'pharmacist':
                        window.location.href = 'pharmacist.html';
                        break;
                    case 'lab technician':
                        window.location.href = 'labtech.html';
                        break;
                    default:
                        alert('Role not supported yet. Please contact administrator.');
                        break;
                }
            } else {
                document.getElementById('loginError').classList.remove('d-none');
            }
        });
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.mustChangePassword) {
        // Switch to Change Password tab (adjust selector for each module)
        const tab = new bootstrap.Tab(document.querySelector('#profile-tab'));
        tab.show();
        showPasswordMessage('You must change your password before using the system.', 'warning');
    }
});

// Check if user is logged in on protected pages
function checkUserAuth() {
    console.log('Checking user authentication...');
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    console.log('userLoggedIn:', userLoggedIn);
    console.log('currentUser:', currentUser);
    
    if (!userLoggedIn || !currentUser) {
        console.log('Authentication failed, redirecting to login');
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('Authentication successful');
    return currentUser;
}

// Check if user has required role
function checkUserRole(requiredRole) {
    console.log('Checking role:', requiredRole);
    const currentUser = checkUserAuth();
    if (!currentUser) {
        console.log('No current user found');
        return false;
    }
    
    console.log('Current user role:', currentUser.role);
    if (currentUser.role !== requiredRole) {
        console.log('Role mismatch. Required:', requiredRole, 'Current:', currentUser.role);
        alert('Access denied. You do not have permission to access this module.');
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('Role check passed');
    return currentUser;
}

// Logout function
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
} 