// Employee Data Service
// In a real application, this would interact with a backend API
// For now, we'll use localStorage to simulate data persistence

class EmployeeService {
  constructor() {
    this.storageKey = 'hr_employee_data'
    this.credentialsKey = 'hr_employee_credentials'
    this.initializeStorage()
  }

  // Initialize storage with sample data if empty
  initializeStorage() {
    // Force refresh of sample data - remove this line after testing
    localStorage.removeItem(this.storageKey)
    
    if (!localStorage.getItem(this.storageKey)) {
      const sampleEmployees = [
        {
          id: 'EMP001',
          name: 'Ahmed Khan',
          nameBangla: 'আহমেদ খান',
          designation: 'Senior Tailor',
          department: 'Sewing',
          levelOfWork: 'Worker',
          phone: '+880 1712-345678',
          email: 'ahmed.khan@company.com',
          joiningDate: '2022-03-15',
          status: 'Active',
          unit: 'Unit 1',
          line: 'Line 2',
          supervisor: 'Mohammad Hassan',
          grossSalary: 25000,
          basicSalary: 15000,
          houseRent: 7500,
          medical: 750,
          food: 1250,
          conveyance: 450,
          picture: null,
          personalInfo: {
            dateOfBirth: '1990-05-15',
            nidNumber: '1234567890123',
            bloodGroup: 'B+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'HSC or Equivalent',
            gender: 'Male',
            address: {
              present: {
                village: 'Dhaka City',
                postOffice: 'Dhaka GPO',
                upazilla: 'Dhaka Sadar',
                district: 'Dhaka'
              },
              permanent: {
                village: 'Comilla City',
                postOffice: 'Comilla GPO',
                upazilla: 'Comilla Sadar',
                district: 'Comilla'
              }
            }
          },
          children: [
            { name: 'Fatima Khan', age: '8', education: 'Primary', institute: 'Dhaka Primary School' },
            { name: 'Ali Khan', age: '5', education: 'Kindergarten', institute: 'Dhaka Kindergarten' }
          ],
          references: [
            { name: 'Karim Uddin', mobile: '+880 1812-345678' },
            { name: 'Salma Begum', mobile: '+880 1912-345679' }
          ],
          emergencyContact: {
            name: 'Fatima Begum',
            mobile: '+880 1612-345680',
            relation: 'Wife'
          },
          workExperience: [
            {
              companyName: 'Previous Garment Co.',
              department: 'Sewing',
              designation: 'Tailor',
              salary: '18000',
              duration: '2 years'
            }
          ],
          attendance: {
            currentMonth: {
              present: 22,
              absent: 2,
              late: 1,
              overtime: 12,
              totalWorkingHours: 176
            },
            recentDays: [
              { date: '2024-01-15', checkIn: '08:00', checkOut: '17:30', status: 'Present', overtime: 0.5 },
              { date: '2024-01-14', checkIn: '08:15', checkOut: '17:00', status: 'Present', overtime: 0 },
              { date: '2024-01-13', checkIn: '08:00', checkOut: '18:00', status: 'Present', overtime: 1.0 },
              { date: '2024-01-12', checkIn: '08:00', checkOut: '17:30', status: 'Present', overtime: 0.5 },
              { date: '2024-01-11', checkIn: '08:30', checkOut: '17:00', status: 'Late', overtime: 0 }
            ]
          },
          payroll: {
            currentMonth: {
              basicSalary: 15000,
              houseRent: 7500,
              medical: 750,
              food: 1250,
              conveyance: 450,
              overtime: 1200,
              deductions: 500,
              netSalary: 23650
            },
            history: [
              { month: 'December 2023', netSalary: 23500, status: 'Paid' },
              { month: 'November 2023', netSalary: 23400, status: 'Paid' },
              { month: 'October 2023', netSalary: 23300, status: 'Paid' }
            ]
          },
          leaveApplications: [
            {
              id: 'LEAVE001',
              type: 'Casual Leave',
              startDate: '2024-01-20',
              endDate: '2024-01-22',
              reason: 'Family function',
              status: 'Approved',
              appliedDate: '2024-01-10'
            },
            {
              id: 'LEAVE002',
              type: 'Sick Leave',
              startDate: '2024-01-25',
              endDate: '2024-01-26',
              reason: 'Medical appointment',
              status: 'Pending',
              appliedDate: '2024-01-15'
            }
          ],
          leaveBalance: {
            casual: 12,
            sick: 7,
            annual: 15,
            maternity: 0,
            earned: 8
          }
        },
        {
          id: 'EMP002',
          name: 'Fatima Begum',
          designation: 'Quality Inspector',
          department: 'Quality Control',
          levelOfWork: 'Staff',
          phone: '+880 1712-345679',
          email: 'fatima.begum@company.com',
          joiningDate: '2021-08-20',
          status: 'Active',
          unit: 'Unit 1',
          line: 'Line 1',
          supervisor: 'Rahman Ali',
          grossSalary: 35000,
          basicSalary: 20000,
          houseRent: 10000,
          medical: 1000,
          food: 1500,
          conveyance: 600,
          personalInfo: {
            dateOfBirth: '1988-12-10',
            nidNumber: '1234567890124',
            bloodGroup: 'O+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'BSc in Textile Engineering',
            gender: 'Female',
            address: {
              present: {
                village: 'Chittagong City',
                postOffice: 'Chittagong GPO',
                upazilla: 'Chittagong Sadar',
                district: 'Chittagong'
              },
              permanent: {
                village: 'Chittagong City',
                postOffice: 'Chittagong GPO',
                upazilla: 'Chittagong Sadar',
                district: 'Chittagong'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 23,
              absent: 1,
              late: 0,
              overtime: 8,
              totalWorkingHours: 184
            }
          },
          leaveBalance: {
            casual: 10,
            sick: 5,
            annual: 12,
            maternity: 0,
            earned: 6
          }
        },
        {
          id: 'EMP003',
          name: 'Mohammad Hassan',
          designation: 'Production Manager',
          department: 'Production',
          levelOfWork: 'Staff',
          phone: '+880 1712-345680',
          email: 'mohammad.hassan@company.com',
          joiningDate: '2020-01-15',
          status: 'Active',
          unit: 'Unit 1',
          line: 'All Lines',
          supervisor: 'Director',
          grossSalary: 60000,
          basicSalary: 35000,
          houseRent: 17500,
          medical: 1750,
          food: 2500,
          conveyance: 900,
          personalInfo: {
            dateOfBirth: '1985-06-22',
            nidNumber: '1234567890125',
            bloodGroup: 'A+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'MBA in Operations Management',
            gender: 'Male',
            address: {
              present: {
                village: 'Dhaka City',
                postOffice: 'Dhaka GPO',
                upazilla: 'Dhaka Sadar',
                district: 'Dhaka'
              },
              permanent: {
                village: 'Dhaka City',
                postOffice: 'Dhaka GPO',
                upazilla: 'Dhaka Sadar',
                district: 'Dhaka'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 24,
              absent: 0,
              late: 0,
              overtime: 16,
              totalWorkingHours: 200
            }
          },
          leaveBalance: {
            casual: 15,
            sick: 8,
            annual: 20,
            maternity: 0,
            earned: 10
          }
        },
        {
          id: 'EMP004',
          name: 'Salma Khatun',
          designation: 'Cutting Master',
          department: 'Cutting',
          levelOfWork: 'Worker',
          phone: '+880 1712-345681',
          email: 'salma.khatun@company.com',
          joiningDate: '2023-02-10',
          status: 'Active',
          unit: 'Unit 2',
          line: 'Line 3',
          supervisor: 'Production Manager',
          grossSalary: 22000,
          basicSalary: 13000,
          houseRent: 6500,
          medical: 650,
          food: 1100,
          conveyance: 400,
          personalInfo: {
            dateOfBirth: '1992-03-18',
            nidNumber: '1234567890126',
            bloodGroup: 'B-',
            religion: 'Islam',
            maritalStatus: 'Single',
            education: 'HSC or Equivalent',
            gender: 'Female',
            address: {
              present: {
                village: 'Sylhet City',
                postOffice: 'Sylhet GPO',
                upazilla: 'Sylhet Sadar',
                district: 'Sylhet'
              },
              permanent: {
                village: 'Sylhet City',
                postOffice: 'Sylhet GPO',
                upazilla: 'Sylhet Sadar',
                district: 'Sylhet'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 20,
              absent: 3,
              late: 2,
              overtime: 6,
              totalWorkingHours: 160
            }
          },
          leaveBalance: {
            casual: 14,
            sick: 9,
            annual: 18,
            maternity: 0,
            earned: 7
          }
        },
        {
          id: 'EMP005',
          name: 'Karim Uddin',
          designation: 'Maintenance Engineer',
          department: 'Maintenance',
          levelOfWork: 'Staff',
          phone: '+880 1712-345682',
          email: 'karim.uddin@company.com',
          joiningDate: '2022-11-05',
          status: 'Active',
          unit: 'All Units',
          line: 'All Lines',
          supervisor: 'Maintenance Manager',
          grossSalary: 28000,
          basicSalary: 17000,
          houseRent: 8500,
          medical: 850,
          food: 1300,
          conveyance: 500,
          personalInfo: {
            dateOfBirth: '1989-09-30',
            nidNumber: '1234567890127',
            bloodGroup: 'AB+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'Diploma in Mechanical Engineering',
            gender: 'Male',
            address: {
              present: {
                village: 'Rajshahi City',
                postOffice: 'Rajshahi GPO',
                upazilla: 'Rajshahi Sadar',
                district: 'Rajshahi'
              },
              permanent: {
                village: 'Rajshahi City',
                postOffice: 'Rajshahi GPO',
                upazilla: 'Rajshahi Sadar',
                district: 'Rajshahi'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 21,
              absent: 2,
              late: 1,
              overtime: 10,
              totalWorkingHours: 172
            }
          },
          leaveBalance: {
            casual: 11,
            sick: 6,
            annual: 14,
            maternity: 0,
            earned: 5
          }
        },
        {
          id: 'EMP006',
          name: 'Nusrat Jahan',
          designation: 'Fabric Inspector',
          department: 'Quality Control',
          levelOfWork: 'Worker',
          phone: '+880 1712-345683',
          email: 'nusrat.jahan@company.com',
          joiningDate: '2023-04-12',
          status: 'Active',
          unit: 'Unit 1',
          line: 'Line 1',
          supervisor: 'Fatima Begum',
          grossSalary: 20000,
          basicSalary: 12000,
          houseRent: 6000,
          medical: 600,
          food: 1000,
          conveyance: 400,
          personalInfo: {
            dateOfBirth: '1993-07-25',
            nidNumber: '1234567890128',
            bloodGroup: 'A-',
            religion: 'Islam',
            maritalStatus: 'Single',
            education: 'HSC or Equivalent',
            gender: 'Female',
            address: {
              present: {
                village: 'Khulna City',
                postOffice: 'Khulna GPO',
                upazilla: 'Khulna Sadar',
                district: 'Khulna'
              },
              permanent: {
                village: 'Khulna City',
                postOffice: 'Khulna GPO',
                upazilla: 'Khulna Sadar',
                district: 'Khulna'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 19,
              absent: 4,
              late: 2,
              overtime: 8,
              totalWorkingHours: 152
            }
          },
          leaveBalance: {
            casual: 13,
            sick: 8,
            annual: 16,
            maternity: 0,
            earned: 9
          }
        },
        {
          id: 'EMP007',
          name: 'Rashid Ahmed',
          designation: 'Line Supervisor',
          department: 'Sewing',
          levelOfWork: 'Staff',
          phone: '+880 1712-345684',
          email: 'rashid.ahmed@company.com',
          joiningDate: '2021-06-18',
          status: 'Active',
          unit: 'Unit 1',
          line: 'Line 2',
          supervisor: 'Mohammad Hassan',
          grossSalary: 32000,
          basicSalary: 19000,
          houseRent: 9500,
          medical: 950,
          food: 1400,
          conveyance: 550,
          personalInfo: {
            dateOfBirth: '1987-03-14',
            nidNumber: '1234567890129',
            bloodGroup: 'O-',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'Diploma in Garment Technology',
            gender: 'Male',
            address: {
              present: {
                village: 'Barisal City',
                postOffice: 'Barisal GPO',
                upazilla: 'Barisal Sadar',
                district: 'Barisal'
              },
              permanent: {
                village: 'Barisal City',
                postOffice: 'Barisal GPO',
                upazilla: 'Barisal Sadar',
                district: 'Barisal'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 23,
              absent: 1,
              late: 0,
              overtime: 14,
              totalWorkingHours: 188
            }
          },
          leaveBalance: {
            casual: 9,
            sick: 4,
            annual: 11,
            maternity: 0,
            earned: 3
          }
        },
        {
          id: 'EMP008',
          name: 'Sabina Yasmin',
          designation: 'Pattern Maker',
          department: 'Cutting',
          levelOfWork: 'Worker',
          phone: '+880 1712-345685',
          email: 'sabina.yasmin@company.com',
          joiningDate: '2022-09-08',
          status: 'Active',
          unit: 'Unit 2',
          line: 'Line 4',
          supervisor: 'Production Manager',
          grossSalary: 24000,
          basicSalary: 14500,
          houseRent: 7250,
          medical: 725,
          food: 1200,
          conveyance: 450,
          personalInfo: {
            dateOfBirth: '1991-11-08',
            nidNumber: '1234567890130',
            bloodGroup: 'B+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'HSC or Equivalent',
            gender: 'Female',
            address: {
              present: {
                village: 'Rangpur City',
                postOffice: 'Rangpur GPO',
                upazilla: 'Rangpur Sadar',
                district: 'Rangpur'
              },
              permanent: {
                village: 'Rangpur City',
                postOffice: 'Rangpur GPO',
                upazilla: 'Rangpur Sadar',
                district: 'Rangpur'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 22,
              absent: 2,
              late: 1,
              overtime: 11,
              totalWorkingHours: 178
            }
          },
          leaveBalance: {
            casual: 12,
            sick: 7,
            annual: 15,
            maternity: 0,
            earned: 8
          }
        },
        {
          id: 'EMP009',
          name: 'Imran Hossain',
          designation: 'Machine Operator',
          department: 'Sewing',
          levelOfWork: 'Worker',
          phone: '+880 1712-345686',
          email: 'imran.hossain@company.com',
          joiningDate: '2023-01-25',
          status: 'Active',
          unit: 'Unit 1',
          line: 'Line 3',
          supervisor: 'Rashid Ahmed',
          grossSalary: 22000,
          basicSalary: 13000,
          houseRent: 6500,
          medical: 650,
          food: 1100,
          conveyance: 400,
          personalInfo: {
            dateOfBirth: '1994-02-20',
            nidNumber: '1234567890131',
            bloodGroup: 'A+',
            religion: 'Islam',
            maritalStatus: 'Single',
            education: 'SSC or Equivalent',
            gender: 'Male',
            address: {
              present: {
                village: 'Mymensingh City',
                postOffice: 'Mymensingh GPO',
                upazilla: 'Mymensingh Sadar',
                district: 'Mymensingh'
              },
              permanent: {
                village: 'Mymensingh City',
                postOffice: 'Mymensingh GPO',
                upazilla: 'Mymensingh Sadar',
                district: 'Mymensingh'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 20,
              absent: 3,
              late: 2,
              overtime: 9,
              totalWorkingHours: 164
            }
          },
          leaveBalance: {
            casual: 14,
            sick: 9,
            annual: 18,
            maternity: 0,
            earned: 10
          }
        },
                {
          id: 'EMP010',
          name: 'Rehana Begum',
          designation: 'Quality Manager',
          department: 'Quality Control',
          levelOfWork: 'Staff',
          phone: '+880 1712-345687',
          email: 'rehana.begum@company.com',
          joiningDate: '2019-11-30',
          status: 'Active',
          unit: 'All Units',
          line: 'All Lines',
          supervisor: 'Director',
          grossSalary: 55000,
          basicSalary: 32000,
          houseRent: 16000,
          medical: 1600,
           food: 2200,
            conveyance: 800,
          personalInfo: {
            dateOfBirth: '1983-08-12',
            nidNumber: '1234567890132',
            bloodGroup: 'O+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'MSc in Textile Engineering',
            gender: 'Female',
            address: {
              present: {
                village: 'Dhaka City',
                postOffice: 'Dhaka GPO',
                upazilla: 'Dhaka Sadar',
                district: 'Dhaka'
              },
              permanent: {
                village: 'Dhaka City',
                postOffice: 'Dhaka GPO',
                upazilla: 'Dhaka Sadar',
                district: 'Dhaka'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 25,
              absent: 0,
              late: 0,
              overtime: 18,
              totalWorkingHours: 208
            }
          },
          leaveBalance: {
            casual: 16,
            sick: 10,
            annual: 22,
            maternity: 0,
            earned: 12
          }
        },
        {
          id: 'EMP011',
          name: 'Shafiqul Islam',
          designation: 'Store Keeper',
          department: 'Store',
          levelOfWork: 'Worker',
          phone: '+880 1712-345688',
          email: 'shafiqul.islam@company.com',
          joiningDate: '2022-07-14',
          status: 'Active',
          unit: 'All Units',
          line: 'All Lines',
          supervisor: 'Store Manager',
          grossSalary: 23000,
          basicSalary: 14000,
          houseRent: 7000,
          medical: 700,
          food: 1150,
          conveyance: 420,
          personalInfo: {
            dateOfBirth: '1988-12-03',
            nidNumber: '1234567890133',
            bloodGroup: 'B-',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'HSC or Equivalent',
            gender: 'Male',
            address: {
              present: {
                village: 'Jessore City',
                postOffice: 'Jessore GPO',
                upazilla: 'Jessore Sadar',
                district: 'Jessore'
              },
              permanent: {
                village: 'Jessore City',
                postOffice: 'Jessore GPO',
                upazilla: 'Jessore Sadar',
                district: 'Jessore'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 21,
              absent: 2,
              late: 1,
              overtime: 7,
              totalWorkingHours: 172
            }
          },
          leaveBalance: {
            casual: 11,
            sick: 6,
            annual: 14,
            maternity: 0,
            earned: 5
          }
        },
        {
          id: 'EMP012',
          name: 'Nasreen Akter',
          designation: 'Finishing Worker',
          department: 'Finishing',
          levelOfWork: 'Worker',
          phone: '+880 1712-345689',
          email: 'nasreen.akter@company.com',
          joiningDate: '2023-03-22',
          status: 'Active',
          unit: 'Unit 2',
          line: 'Line 5',
          supervisor: 'Finishing Supervisor',
          grossSalary: 21000,
          basicSalary: 12500,
          houseRent: 6250,
          medical: 625,
          food: 1050,
          conveyance: 380,
          personalInfo: {
            dateOfBirth: '1995-05-17',
            nidNumber: '1234567890134',
            bloodGroup: 'AB-',
            religion: 'Islam',
            maritalStatus: 'Single',
            education: 'SSC or Equivalent',
            gender: 'Female',
            address: {
              present: {
                village: 'Pabna City',
                postOffice: 'Pabna GPO',
                upazilla: 'Pabna Sadar',
                district: 'Pabna'
              },
              permanent: {
                village: 'Pabna City',
                postOffice: 'Pabna GPO',
                upazilla: 'Pabna Sadar',
                district: 'Pabna'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 18,
              absent: 5,
              late: 3,
              overtime: 6,
              totalWorkingHours: 144
            }
          },
          leaveBalance: {
            casual: 15,
            sick: 10,
            annual: 19,
            maternity: 0,
            earned: 11
          }
        },
        {
          id: 'EMP013',
          name: 'Mizanur Rahman',
          designation: 'Electrician',
          department: 'Maintenance',
          levelOfWork: 'Staff',
          phone: '+880 1712-345690',
          email: 'mizanur.rahman@company.com',
          joiningDate: '2021-12-10',
          status: 'Active',
          unit: 'All Units',
          line: 'All Lines',
          supervisor: 'Maintenance Manager',
          grossSalary: 26000,
          basicSalary: 15500,
          houseRent: 7750,
          medical: 775,
          food: 1200,
          conveyance: 450,
          personalInfo: {
            dateOfBirth: '1986-10-28',
            nidNumber: '1234567890135',
            bloodGroup: 'A-',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'Diploma in Electrical Engineering',
            gender: 'Male',
            address: {
              present: {
                village: 'Bogra City',
                postOffice: 'Bogra GPO',
                upazilla: 'Bogra Sadar',
                district: 'Bogra'
              },
              permanent: {
                village: 'Bogra City',
                postOffice: 'Bogra GPO',
                upazilla: 'Bogra Sadar',
                district: 'Bogra'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 22,
              absent: 2,
              late: 1,
              overtime: 12,
              totalWorkingHours: 176
            }
          },
          leaveBalance: {
            casual: 10,
            sick: 5,
            annual: 13,
            maternity: 0,
            earned: 4
          }
        },
        {
          id: 'EMP014',
          name: 'Tahmina Khatun',
          designation: 'Sample Maker',
          department: 'Sample',
          levelOfWork: 'Worker',
          phone: '+880 1712-345691',
          email: 'tahmina.khatun@company.com',
          joiningDate: '2022-05-18',
          status: 'Active',
          unit: 'Unit 1',
          line: 'Sample Room',
          supervisor: 'Sample Manager',
          grossSalary: 25000,
          basicSalary: 15000,
          houseRent: 7500,
          medical: 750,
          food: 1250,
          conveyance: 450,
          personalInfo: {
            dateOfBirth: '1990-01-15',
            nidNumber: '1234567890136',
            bloodGroup: 'O+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'HSC or Equivalent',
            gender: 'Female',
            address: {
              present: {
                village: 'Kushtia City',
                postOffice: 'Kushtia GPO',
                upazilla: 'Kushtia Sadar',
                district: 'Kushtia'
              },
              permanent: {
                village: 'Kushtia City',
                postOffice: 'Kushtia GPO',
                upazilla: 'Kushtia Sadar',
                district: 'Kushtia'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 23,
              absent: 1,
              late: 0,
              overtime: 13,
              totalWorkingHours: 188
            }
          },
          leaveBalance: {
            casual: 12,
            sick: 7,
            annual: 15,
            maternity: 0,
            earned: 8
          }
        },
        {
          id: 'EMP015',
          name: 'Abdul Kader',
          designation: 'Security Guard',
          department: 'Security',
          levelOfWork: 'Worker',
          phone: '+880 1712-345692',
          email: 'abdul.kader@company.com',
          joiningDate: '2020-08-25',
          status: 'Active',
          unit: 'All Units',
          line: 'All Gates',
          supervisor: 'Security Manager',
          grossSalary: 18000,
          basicSalary: 11000,
          houseRent: 5500,
          medical: 550,
          food: 900,
          conveyance: 350,
          personalInfo: {
            dateOfBirth: '1984-04-12',
            nidNumber: '1234567890137',
            bloodGroup: 'B+',
            religion: 'Islam',
            maritalStatus: 'Married',
            education: 'SSC or Equivalent',
            gender: 'Male',
            address: {
              present: {
                village: 'Tangail City',
                postOffice: 'Tangail GPO',
                upazilla: 'Tangail Sadar',
                district: 'Tangail'
              },
              permanent: {
                village: 'Tangail City',
                postOffice: 'Tangail GPO',
                upazilla: 'Tangail Sadar',
                district: 'Tangail'
              }
            }
          },
          attendance: {
            currentMonth: {
              present: 24,
              absent: 0,
              late: 0,
              overtime: 20,
              totalWorkingHours: 200
            }
          },
          leaveBalance: {
            casual: 8,
            sick: 3,
            annual: 10,
            maternity: 0,
            earned: 2
          }
        }
      ]
      localStorage.setItem(this.storageKey, JSON.stringify(sampleEmployees))
    }

    // Initialize credentials if empty
    if (!localStorage.getItem(this.credentialsKey)) {
      const sampleCredentials = {
        'EMP001': 'password123',
        'EMP002': 'password123',
        'EMP003': 'password123',
        'EMP004': 'password123',
        'EMP005': 'password123',
        'EMP006': 'password123',
        'EMP007': 'password123',
        'EMP008': 'password123',
        'EMP009': 'password123',
        'EMP010': 'password123',
        'EMP011': 'password123',
        'EMP012': 'password123',
        'EMP013': 'password123',
        'EMP014': 'password123',
        'EMP015': 'password123'
      }
      localStorage.setItem(this.credentialsKey, JSON.stringify(sampleCredentials))
    }
  }

  // Save new employee data (called when HR submits form)
  async saveEmployee(employeeData) {
    try {
      const employees = this.getAllEmployees()
      
      // Generate new employee ID if not provided
      if (!employeeData.id) {
        const lastId = employees.length > 0 ? 
          Math.max(...employees.map(emp => parseInt(emp.id.replace('EMP', '')))) : 0
        employeeData.id = `EMP${String(lastId + 1).padStart(3, '0')}`
      }

      // Set default values
      employeeData.status = 'Active'
      employeeData.joiningDate = employeeData.joiningDate || new Date().toISOString().split('T')[0]
      employeeData.createdAt = new Date().toISOString()
      employeeData.updatedAt = new Date().toISOString()

      // Initialize attendance and payroll data
      employeeData.attendance = {
        currentMonth: {
          present: 0,
          absent: 0,
          late: 0,
          overtime: 0,
          totalWorkingHours: 0
        },
        recentDays: []
      }

      employeeData.payroll = {
        currentMonth: {
          basicSalary: employeeData.salaryComponents?.basicSalary?.amount || 0,
          houseRent: employeeData.salaryComponents?.houseRent?.amount || 0,
          medical: employeeData.salaryComponents?.medical?.amount || 0,
          food: employeeData.salaryComponents?.food?.amount || 0,
          conveyance: employeeData.salaryComponents?.conveyance?.amount || 0,
          overtime: 0,
          deductions: 0,
          netSalary: employeeData.grossSalary || 0
        },
        history: []
      }

      employeeData.leaveApplications = []
      employeeData.leaveBalance = {
        casual: 12,
        sick: 7,
        annual: 15,
        maternity: 0,
        earned: 8
      }

      // Add to employees array
      employees.push(employeeData)
      localStorage.setItem(this.storageKey, JSON.stringify(employees))

      // Create login credentials
      await this.createEmployeeCredentials(employeeData.id, 'password123')

      return {
        success: true,
        employeeId: employeeData.id,
        message: 'Employee added successfully'
      }
    } catch (error) {
      console.error('Error saving employee:', error)
      return {
        success: false,
        message: 'Failed to save employee data'
      }
    }
  }

  // Get all employees (for HR dashboard)
  getAllEmployees() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error getting employees:', error)
      return []
    }
  }

  // Get employee by ID (for employee dashboard)
  getEmployeeById(employeeId) {
    try {
      const employees = this.getAllEmployees()
      return employees.find(emp => emp.id === employeeId) || null
    } catch (error) {
      console.error('Error getting employee:', error)
      return null
    }
  }

  // Update employee data
  async updateEmployee(employeeId, updatedData) {
    try {
      const employees = this.getAllEmployees()
      const index = employees.findIndex(emp => emp.id === employeeId)
      
      if (index !== -1) {
        employees[index] = {
          ...employees[index],
          ...updatedData,
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem(this.storageKey, JSON.stringify(employees))
        return { success: true, message: 'Employee updated successfully' }
      }
      
      return { success: false, message: 'Employee not found' }
    } catch (error) {
      console.error('Error updating employee:', error)
      return { success: false, message: 'Failed to update employee' }
    }
  }

  // Delete employee
  async deleteEmployee(employeeId) {
    try {
      const employees = this.getAllEmployees()
      const filteredEmployees = employees.filter(emp => emp.id !== employeeId)
      
      if (filteredEmployees.length < employees.length) {
        localStorage.setItem(this.storageKey, JSON.stringify(filteredEmployees))
        
        // Remove credentials
        await this.removeEmployeeCredentials(employeeId)
        
        return { success: true, message: 'Employee deleted successfully' }
      }
      
      return { success: false, message: 'Employee not found' }
    } catch (error) {
      console.error('Error deleting employee:', error)
      return { success: false, message: 'Failed to delete employee' }
    }
  }

  // Create employee login credentials
  async createEmployeeCredentials(employeeId, password) {
    try {
      const credentials = JSON.parse(localStorage.getItem(this.credentialsKey) || '{}')
      credentials[employeeId] = password
      localStorage.setItem(this.credentialsKey, JSON.stringify(credentials))
      return true
    } catch (error) {
      console.error('Error creating credentials:', error)
      return false
    }
  }

  // Remove employee credentials
  async removeEmployeeCredentials(employeeId) {
    try {
      const credentials = JSON.parse(localStorage.getItem(this.credentialsKey) || '{}')
      delete credentials[employeeId]
      localStorage.setItem(this.credentialsKey, JSON.stringify(credentials))
      return true
    } catch (error) {
      console.error('Error removing credentials:', error)
      return false
    }
  }

  // Authenticate employee login
  async authenticateEmployee(employeeId, password) {
    try {
      const credentials = JSON.parse(localStorage.getItem(this.credentialsKey) || '{}')
      return credentials[employeeId] === password
    } catch (error) {
      console.error('Error authenticating employee:', error)
      return false
    }
  }

  // Search employees (for HR filtering)
  searchEmployees(filters = {}) {
    try {
      let employees = this.getAllEmployees()
      
      // Apply filters
      if (filters.department && filters.department !== 'All') {
        employees = employees.filter(emp => emp.department === filters.department)
      }
      
      if (filters.designation && filters.designation !== 'All') {
        employees = employees.filter(emp => emp.designation === filters.designation)
      }
      
      if (filters.levelOfWork && filters.levelOfWork !== 'All') {
        employees = employees.filter(emp => emp.levelOfWork === filters.levelOfWork)
      }
      
      if (filters.status && filters.status !== 'All') {
        employees = employees.filter(emp => emp.status === filters.status)
      }
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        employees = employees.filter(emp => 
          emp.name.toLowerCase().includes(term) ||
          emp.id.toLowerCase().includes(term) ||
          emp.designation.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term)
        )
      }
      
      return employees
    } catch (error) {
      console.error('Error searching employees:', error)
      return []
    }
  }

  // Get employee statistics (for HR dashboard)
  getEmployeeStats() {
    try {
      const employees = this.getAllEmployees()
      
      const stats = {
        total: employees.length,
        byDepartment: {},
        byLevel: {},
        byStatus: {},
        recentJoinings: 0
      }
      
      employees.forEach(emp => {
        // Department stats
        stats.byDepartment[emp.department] = (stats.byDepartment[emp.department] || 0) + 1
        
        // Level stats
        stats.byLevel[emp.levelOfWork] = (stats.byLevel[emp.levelOfWork] || 0) + 1
        
        // Status stats
        stats.byStatus[emp.status] = (stats.byStatus[emp.status] || 0) + 1
        
        // Recent joinings (last 30 days)
        const joiningDate = new Date(emp.joiningDate)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        if (joiningDate >= thirtyDaysAgo) {
          stats.recentJoinings++
        }
      })
      
      return stats
    } catch (error) {
      console.error('Error getting employee stats:', error)
      return {}
    }
  }

  // Force refresh sample data (for development/testing)
  refreshSampleData() {
    try {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.credentialsKey)
      this.initializeStorage()
      return { success: true, message: 'Sample data refreshed successfully' }
    } catch (error) {
      console.error('Error refreshing sample data:', error)
      return { success: false, message: 'Failed to refresh sample data' }
    }
  }
}

// Export singleton instance
export default new EmployeeService()
