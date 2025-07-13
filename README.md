# 🏥 Clinc-CMS (Clinic Management System)

A comprehensive **Clinic Management System** built with vanilla JavaScript, Bootstrap CSS, and localStorage for data persistence. This system provides role-based access for different healthcare staff members with complete patient management, appointment scheduling, and medical record keeping.

**Developed by Group 3**: Rejul, Anjali, Chithara, Goldlin, Niyathi

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [User Roles & Access](#user-roles--access)
- [File Structure](#file-structure)
- [Technical Details](#technical-details)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

##✨ Features

### 🔐 **Unified Authentication System**
- Single login portal for all staff members
- Role-based access control
- Secure session management
- Password strength validation

### 👨‍⚕️ **Admin Module**
- **User Management**: Add, edit, and manage staff members
- **Role Assignment**: Support for doctors, pharmacists, lab technicians, receptionists
- **Doctor Configuration**: Specialization and consultation fee setup
- **Availability Management**: Working days and time slots configuration
- **Credential Generation**: Auto-generate usernames and secure default passwords

### 🏥 **Receptionist Module**
- **Patient Registration**: Complete patient profile management with unique ID generation
- **Appointment Scheduling**: Create appointments with token system and billing
- **Patient Search**: Advanced search by ID, name, or phone number
- **Daily Reports**: Comprehensive consultation reports with doctor filtering
- **Password Security**: Mandatory password change after first login

### 👨‍⚕️ **Doctor Module**
- **Daily Dashboard**: View today's appointments with patient details and age calculation
- **Consultation Management**: Complete patient consultation workflow
- **Medical Records**: Comprehensive patient history with non-editable previous consultations
- **Prescription System**: Detailed prescription creation with medicines and lab tests
- **Data Persistence**: All consultation data saved to patient medical history

### 💊 **Pharmacist Module**
- **Inventory Management**: Complete CRUD operations for medicine inventory
- **Medicine Tracking**: Name, quantity, and expiry date monitoring
- **Status Indicators**: Real-time status tracking (Available, Expiring Soon, Expired)
- **Prescription Integration**: Search and view doctor prescriptions by patient
- **Medicine Dispensing**: Track medicine distribution and stock levels

### 🔬 **Lab Technician Module**
- **Test Report Management**: Comprehensive lab test report system
- **Report Creation**: Detailed test reports with all required medical fields
- **Result Analysis**: Automatic analysis of test results (Normal, High, Low)
- **Prescription Integration**: Search doctor prescriptions by patient ID or name
- **Patient Data Sync**: Auto-fill patient details from central database

## 🏗️ System Architecture

```
Clinc-CMS/
├── 📁 Portal/                    # Main application portal
│   ├── login.html               # Unified authentication portal
│   ├── admin.html               # Admin dashboard
│   ├── doctor.html              # Doctor dashboard
│   ├── receptionist.html        # Receptionist dashboard
│   ├── pharmacist.html          # Pharmacist dashboard
│   ├── labtech.html             # Lab technician dashboard
|   └── 📁 js/                       # JavaScript modules
│      ├── unified-auth.js         # Authentication system
│      ├── staff.js                # Staff management
│      ├── doctor.js               # Doctor functionality
│      ├── receptionist.js         # Receptionist functionality
│      ├── pharmacist.js           # Pharmacist functionality
│      └── lab-technician.js       # Lab technician functionality
├── 📄 index.html                # Landing page
├── 📄 appoinment.html          # Appointment management
└── 📄 README.md                # Documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Quick Start
1. **Clone or Download** the project files
2. **Open** `Portal/login.html` in your web browser
3. **Login** with admin credentials:
   - **Email**: `admin@clinc.com`
   - **Password**: `Admin@123`
4. **Setup Staff**: Add doctors, receptionists, and other staff members
5. **Begin Operations**: Start managing patients and appointments

### First-Time Setup
```bash
# 1. Download the project
git clone [repository-url]
cd Clinc-CMS

# 2. Open in browser
# Navigate to Portal/login.html

# 3. Login as admin and setup staff members
# 4. Distribute credentials to staff members
# 5. Staff members login and change default passwords
```

## 👥 User Roles & Access

### 🔑 **Admin Access**
- **Login**: `admin@clinc.com` / `Admin@123`
- **Responsibilities**: System administration, staff management
- **Features**: User creation, role assignment, system configuration

### 👨‍⚕️ **Doctor Access**
- **Login**: Email assigned by admin / Default: `Welcome@123`
- **Responsibilities**: Patient consultations, medical records
- **Features**: Daily appointments, consultation management, prescription creation

### 🏥 **Receptionist Access**
- **Login**: Email assigned by admin / Default: `Welcome@123`
- **Responsibilities**: Patient registration, appointment scheduling
- **Features**: Patient management, appointment booking, daily reports

### 💊 **Pharmacist Access**
- **Login**: Email assigned by admin / Default: `Welcome@123`
- **Responsibilities**: Medicine inventory, prescription fulfillment
- **Features**: Medicine management, prescription search, stock tracking

### 🔬 **Lab Technician Access**
- **Login**: Email assigned by admin / Default: `Welcome@123`
- **Responsibilities**: Lab test management, report creation
- **Features**: Test report creation, result analysis, prescription integration

## 💾 Data Storage

The system uses browser localStorage for data persistence:

| Storage Key | Description | Data Structure |
|-------------|-------------|----------------|
| `staffList` | Staff member details | Array of staff objects |
| `patients` | Patient records | Array of patient objects |
| `appointments` | Appointment bookings | Array of appointment objects |
| `consultations` | Patient consultation history | Array of consultation objects |
| `medicines` | Medicine inventory | Array of medicine objects |
| `labTests` | Lab test reports | Array of test report objects |
| `userLoggedIn` | Session state | Boolean |
| `currentUser` | Current user data | User object |

## 🛠️ Technical Details

### **Frontend Technologies**
- **JavaScript**: ES6+ (Vanilla JS, no frameworks)
- **CSS Framework**: Bootstrap 5.3.0 (CDN)
- **Data Storage**: Browser localStorage API
- **Authentication**: Session-based login system
- **Responsive Design**: Mobile-first approach

### **Browser Compatibility**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### **Security Features**
- Password strength validation
- Session management
- Role-based access control
- Secure credential generation

## 📚 API Documentation

### **Functions**
```javascript
// Login function
loginUser(email, password)

// Logout function
logoutUser()

// Check session
isUserLoggedIn()

// Get current user
getCurrentUser()
```

### **Staff Management **
```javascript
// Add staff member
addStaff(staffData)

// Get staff list
getStaffList()

// Update staff
updateStaff(staffId, updatedData)

// Delete staff
deleteStaff(staffId)
```

### **Patient Management **
```javascript
// Add patient
addPatient(patientData)

// Search patients
searchPatients(criteria)

// Get patient by ID
getPatientById(patientId)

// Update patient
updatePatient(patientId, updatedData)
```

## 🔧 Development

### **Local Development**
1. Clone the repository
2. Open `Portal/login.html` in your browser
3. Use browser developer tools for debugging
4. Check localStorage for data inspection

### **Code Structure**
- **Modular JavaScript**: Each role has its own JS file
- **Unified Authentication**: Centralized login system
- **Bootstrap Components**: Responsive UI components
- **LocalStorage API**: Client-side data persistence

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code structure
- Add comments for complex functions
- Test all functionality before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email**: hclsrip@gmail.com
- **Issues**: Create an issue in the repository
- **Documentation**: Refer to this README

## 🎯 Roadmap

### **Planned Features**
- [ ] Offline data synchronization
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Enhanced security features
- [ ] Mobile app development
- [ ] Cloud data storage integration

### **Known Limitations**
- Data stored locally in browser
- No server-side functionality
- Limited to single browser session
- No data backup/export features

---

**Note**: This is a demonstration system designed for small clinics or educational purposes. For production use, consider implementing server-side functionality and proper security measures.

**Last Updated**: December 2024
**Version**: 1.0.0 
