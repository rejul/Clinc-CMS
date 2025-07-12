# Hospital CMS (Clinic Management System)

A simple Hospital CMS built with  JavaScript, Bootstrap CSS, and localStorage for data persistence.
Done By Group 3 - Rejul, Anjali, Chithara , Goldlin , Niyathi
## Features

### Admin Module
- **Login Required**: Secure admin access
- **User Management**: Add/edit staff members
- **Role Management**: Support for doctors, pharmacists, lab technicians, receptionists
- **Doctor Details**: Specialization and consultation fee for doctors
- **Availability Management**: Working days and times for staff
- **Credential Generation**: Auto-generate username (email) and default password

### Receptionist Module
- **Patient Management**: Add new patients with unique ID generation
- **Appointment Management**: Create appointments with token and billing
- **Patient Search**: Search by ID, name, or phone number
- **Reporting**: Daily consultation reports with filtering by doctor
- **Password Management**: Change default password after first login

### Doctor Module
- **Daily Appointments View**: View today's appointments with token ID, patient details, and age
- **Consultation Management**: Start consultation for patients
- **Patient History**: View non-editable patient consultation history
- **Consultation Details**: Input symptoms, diagnosis, notes, prescription, medicines, lab tests
- **Data Persistence**: Save all consultation data to patient history

### Pharmacist Module
- **Medicine List Management**: Complete CRUD operations for medicines
- **Medicine Details**: Name, quantity, expiry date tracking
- **Status Tracking**: Available, Expiring Soon, Expired status indicators
- **Prescription Search**: Search by patient ID or name
- **Consultation Integration**: View doctor prescriptions and medicines

### Lab Technician Module
- **Lab Tests Management**: View and manage all lab test reports
- **Test Report Creation**: Create detailed test reports with all required fields
- **Status Analysis**: Automatic analysis of test results (Normal, High, Low)
- **Prescription Search**: Search doctor prescriptions by patient ID or name
- **Patient Integration**: Auto-fill patient details from patient database

## File Structure

```
pro/
├── unified-login.html      # Unified login for all staff
├── admin.html              # Admin dashboard
├── receptionist.html       # Receptionist dashboard
├── doctor.html             # Doctor dashboard
├── pharmacist.html         # Pharmacist dashboard
├── lab-technician.html     # Lab Technician dashboard
├── js/
│   ├── unified-auth.js    # Unified authentication system
│   ├── staff.js           # Staff management logic
│   ├── receptionist.js    # Receptionist functionality
│   ├── doctor.js          # Doctor functionality
│   ├── pharmacist.js      # Pharmacist functionality
│   └── lab-technician.js  # Lab Technician functionality
└── README.md              # This file
```

## How to Use

### 1. Admin Setup
1. Open `unified-login.html` in your browser
2. Login with admin credentials:
   - **Email**: admin@hospital.com
   - **Password**: Admin@123
3. Add staff members (doctors, receptionists, etc.)
4. View generated credentials for each staff member

### 2. Staff Access (Unified Login)
1. Open `unified-login.html` in your browser
2. Login with your staff credentials created by admin:
   - **Email**: Your email address
   - **Password**: Your password (default: Welcome@123)
3. System automatically redirects to appropriate dashboard based on your role:
   - **Admin**: User management and staff setup
   - **Receptionist**: Patient management, appointments, search, reports
   - **Doctor**: Daily appointments and consultation management
   - **Pharmacist**: Medicine management and prescription search
   - **Lab Technician**: Lab test management and report creation

## Features in Detail

### Admin Features
- **Staff Management**: Add staff with complete details
- **Dynamic Forms**: Doctor-specific fields (specialization, consultation fee)
- **Availability Tracking**: Working days and time slots
- **Credential Generation**: Automatic username/password creation

### Receptionist Features
- **Patient Registration**: 
  - Name, DOB, gender, phone, address, email (optional)
  - Automatic unique patient ID generation
- **Appointment Booking**:
  - Select patient by ID
  - Choose doctor from available staff
  - Set appointment date/time
  - Generate token and billing details
- **Patient Search**:
  - Search by unique patient ID
  - Search by name (shows all matching names)
  - Search by phone number
- **Reporting**:
  - Daily consultation reports
  - Filter by specific doctor
  - View total transactions and revenue
- **Password Management**:
  - Change default password after first login
  - Password strength validation (minimum 8 characters)
  - Secure password update process

### Doctor Features
- **Daily Appointments View**:
  - View today's appointments for logged-in doctor
  - Display token ID, patient ID, name, and calculated age
  - Show appointment time and type (OP/IP)
  - Quick access to start consultation
- **Consultation Management**:
  - Start consultation from appointment list
  - Auto-fill patient details from patient ID
  - View patient age calculated from date of birth
- **Patient History**:
  - Display non-editable previous consultation history
  - Show consultation date, doctor name, and all details
  - Organized view of symptoms, diagnosis, prescription, medicines, lab tests
- **Consultation Details**:
  - Input symptoms, diagnosis, notes
  - Add prescription and medicines
  - Specify lab tests if required
  - Save all data to patient consultation history

### Pharmacist Features
- **Medicine Management**:
  - Add new medicines with name, quantity, expiry date
  - Edit existing medicine details
  - Delete medicines from inventory
  - View medicine status (Available, Expiring Soon, Expired)
- **Medicine List**:
  - Complete table view of all medicines
  - Status indicators with color coding
  - CRUD operations for each medicine
- **Prescription Search**:
  - Search by patient ID or patient name
  - View complete prescription details
  - Display diagnosis, medicines, lab tests
  - Show consultation date and doctor information

### Lab Technician Features
- **Lab Tests Management**:
  - View all lab test reports in a comprehensive table
  - Automatic status analysis (Normal, High, Low)
  - Delete test reports as needed
  - View detailed test report information
- **Test Report Creation**:
  - Patient ID and name (auto-filled from patient database)
  - Doctor name and test date
  - Test name and range values (high/low)
  - Actual reading and observations
  - Automatic status calculation based on ranges
- **Prescription Search**:
  - Search by patient ID or patient name
  - View doctor prescriptions and lab test requirements
  - Display diagnosis and lab test recommendations
  - Show consultation details and doctor information

## Technical Details

- **Frontend**: Pure JavaScript (no frameworks)
- **Styling**: Bootstrap 5.3.0 CDN
- **Data Storage**: Browser localStorage
- **Authentication**: Simple session-based login
- **Responsive Design**: Mobile-friendly interface

## Demo Credentials

### Admin (Initial Setup)
- Email: admin@hospital.com
- Password: Admin@123

### Staff Members
- Email: Use the email created by admin for each staff member
- Password: Use the default password generated by admin (Welcome@123)
- All staff members use the same unified login page

## Data Persistence

All data is stored in browser localStorage:
- `staffList`: Staff member details
- `patients`: Patient records
- `appointments`: Appointment bookings
- `consultations`: Patient consultation history
- `medicines`: Medicine inventory
- `labTests`: Lab test reports
- `userLoggedIn`: Unified session state
- `currentUser`: Current logged-in user data

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript features
- localStorage API
- Bootstrap 5.3.0

## Getting Started

1. Download all files to a local directory
2. Open `unified-login.html` in a web browser
3. Login as admin to set up staff members (including doctors and receptionists)
4. Use the same login page for all staff members
5. System automatically redirects to appropriate dashboard based on role
6. Change default passwords after first login
7. Start managing patients, appointments, and consultations!

## Notes

- This is a demo system with hardcoded credentials
- Data is stored locally in the browser
- No server-side functionality
- Suitable for small clinics or demonstration purposes 
