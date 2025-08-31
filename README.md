# HR-Payroll Management System

A comprehensive HR and Payroll management system for garment manufacturing companies, built with React and modern web technologies.

## Features

### 🏢 HR Management
- **Employee Management**: Add, edit, and manage employee information
- **Employee Dashboard**: View and filter all employees with statistics
- **Employee Types**: Support for both Workers and Staff with different requirements
- **Data Storage**: Persistent storage using localStorage (can be replaced with backend API)

### 👤 Employee Portal
- **Employee Login**: Secure login with HR-provided credentials
- **Personal Dashboard**: Employees can view their own information
- **Attendance Tracking**: View attendance records and statistics
- **Payroll Information**: Access salary details and payment history
- **Leave Management**: View leave balance and applications

### 💰 Payroll System
- **Salary Components**: Automatic calculation of basic salary, house rent, medical, food, and conveyance
- **Worker vs Staff**: Different salary calculation formulas for different employee types
- **Salary Breakdown**: Detailed view of all salary components
- **Payroll History**: Track monthly salary payments

### 📊 Dashboard & Analytics
- **Overview Dashboard**: Company-wide statistics and metrics
- **Employee Statistics**: Department-wise, level-wise, and status-wise employee counts
- **Filtering & Search**: Advanced filtering by department, designation, level, and status
- **Real-time Updates**: Live data updates as employees are added/modified

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd HR-Payroll
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### For HR Administrators

#### Adding New Employees
1. Navigate to "Add Employee" from the sidebar
2. Select employee type (Worker or Staff)
3. Fill in all required information:
   - **Personal Information**: Name, contact details, NID, etc.
   - **Address Information**: Present and permanent addresses
   - **Work Experience**: Previous employment details
   - **References**: Personal references (required for workers)
   - **Administration**: Employee ID, designation, salary, etc.
4. Click "See Preview" to review the information
5. Click "Add Employee" to save
6. **Important**: Note down the Employee ID and password (default: `password123`) to provide to the employee

#### Managing Employees
1. Navigate to "Employee Dashboard" from the sidebar
2. Use filters to find specific employees:
   - Search by name, ID, or phone
   - Filter by department, designation, level, or status
3. View employee statistics and counts
4. All employee data is automatically saved and accessible

### For Employees

#### First Time Login
1. Use the credentials provided by HR:
   - **Employee ID**: Format: EMP001, EMP002, etc.
   - **Password**: Default is `password123`
2. Click "Employee Portal" button on the HR dashboard
3. Enter your credentials and click "Sign In"

#### Using Employee Dashboard
1. **Overview Tab**: Quick statistics about your employment
2. **Personal Info Tab**: View your personal and employment details
3. **Attendance Tab**: Check your attendance records and overtime
4. **Payroll Tab**: View salary breakdown and payment history
5. **Leave Tab**: Check leave balance and application status

## System Architecture

### Data Flow
```
HR Adds Employee → Data Saved → Employee Credentials Created → Employee Can Login → View Personal Data
```

### Data Storage
- **Current**: localStorage (for demonstration)
- **Production**: Can be easily replaced with backend API calls
- **Data Structure**: Comprehensive employee objects with all necessary information

### Authentication
- **HR Access**: Direct access to admin dashboard
- **Employee Access**: Login required with HR-provided credentials
- **Session Management**: Automatic session handling and logout

## Configuration

### Employee Types
- **Worker**: Full information required (children, references, unit, line)
- **Staff**: Basic information only (no children, references, unit, line)

### Salary Calculations
- **Worker Formula**: `Basic Salary = (Gross Salary - 2450) / 1.5`
- **Staff Formula**: `Basic Salary = Gross Salary × 0.45`

### Default Values
- **Leave Balance**: Casual (12), Sick (7), Annual (15), Maternity (0), Earned (8)
- **Default Password**: `password123` for all employees

## Customization

### Adding New Fields
1. Update the `formData` state in `AddEmployee.jsx`
2. Add corresponding form inputs
3. Update the preview component
4. Modify the employee service to handle new data

### Changing Salary Formulas
1. Update the `calculateWorkerSalary` and `calculateStaffSalary` functions
2. Modify the salary components structure if needed

### Styling Changes
- The system uses Tailwind CSS for styling
- Modify component classes to change appearance
- Update color schemes and layouts as needed

## Security Considerations

### Current Implementation
- Basic authentication using localStorage
- No encryption of sensitive data
- Suitable for demonstration and development

### Production Recommendations
- Implement proper backend authentication
- Use HTTPS for all communications
- Encrypt sensitive employee data
- Implement role-based access control
- Add audit logging for all operations

## Troubleshooting

### Common Issues

#### Employee Can't Login
- Verify Employee ID format (EMP001, EMP002, etc.)
- Check if password is correct (default: `password123`)
- Ensure employee was properly added by HR

#### Data Not Saving
- Check browser console for errors
- Verify localStorage is enabled
- Check if employee service is properly imported

#### Preview Not Working
- Ensure all required fields are filled
- Check form validation messages
- Verify preview component is properly rendered

### Debug Mode
- Open browser developer tools
- Check console for error messages
- Verify localStorage contents
- Test employee service functions

## Future Enhancements

### Planned Features
- **Leave Application System**: Employees can apply for leave
- **Attendance Management**: Clock in/out functionality
- **Payroll Processing**: Monthly salary processing
- **Document Management**: Employee document uploads
- **Reporting System**: Advanced analytics and reports
- **Mobile App**: React Native mobile application

### Technical Improvements
- **Backend Integration**: Replace localStorage with real database
- **Real-time Updates**: WebSocket integration for live data
- **Offline Support**: Service worker for offline functionality
- **Performance**: Lazy loading and code splitting
- **Testing**: Unit and integration tests

## Support

For technical support or feature requests:
- Check the troubleshooting section
- Review the code structure and comments
- Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is a demonstration system. For production use, implement proper security measures and backend integration.
