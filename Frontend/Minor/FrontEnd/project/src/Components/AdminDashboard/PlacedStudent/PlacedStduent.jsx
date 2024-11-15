import React, { useState } from 'react';

const studentsData = [
  {
    id: "66c5861c315484408b8b0d18",
    firstName: "Jatin",
    middleName: "Lalit",
    lastName: "Varyani",
    email: "22bce545@nirmauni.ac.in",
    phoneNumber: "8128677995",
    role: "Student",
    userId: "92538617-4f2e-4788-ba62-6333db6c2723",
  },
  {
    id: "77a5861c315484408b8b0e09",
    firstName: "Ayesha",
    middleName: "Kumar",
    lastName: "Singh",
    email: "22bce123@nirmauni.ac.in",
    phoneNumber: "9876543210",
    role: "Student",
    userId: "23456789-4f2e-4788-ba62-1234db6c2723",
  },
];

const companiesData = ["Google", "Tech Innovators", "Global Analytics"];

const PlacedStudents = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleGetList = () => {
    // Filter logic here based on company name.
    setFilteredStudents(studentsData); 
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4 text-primary-dark">Placed Students</h1>
      
      <div className="flex items-center mb-4 space-x-3">
        <label htmlFor="company" className="text-primary-dark">Select Company:</label>
        <select
          id="company"
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="p-2 border rounded border-primary-light text-primary-dark"
        >
          <option value="">Select a company</option>
          {companiesData.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
        <button
          onClick={handleGetList}
          className="p-2 bg-primary-dark text-white rounded hover:bg-primary-darker transition-colors"
        >
          Get List
        </button>
      </div>

      <div className="border border-primary-light rounded-lg p-4">
        {filteredStudents.length > 0 ? (
          <table className="w-full border-collapse text-primary-darker">
            <thead>
              <tr className="bg-primary-lightest">
                <th className="py-2 px-4 text-left border-b border-primary-light">ID</th>
                <th className="py-2 px-4 text-left border-b border-primary-light">Name</th>
                <th className="py-2 px-4 text-left border-b border-primary-light">Email</th>
                <th className="py-2 px-4 text-left border-b border-primary-light">Phone</th>
                <th className="py-2 px-4 text-left border-b border-primary-light">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-primary-lightest transition-colors">
                  <td className="py-2 px-4 border-b border-primary-light">{student.id}</td>
                  <td className="py-2 px-4 border-b border-primary-light">
                    {student.firstName} {student.middleName} {student.lastName}
                  </td>
                  <td className="py-2 px-4 border-b border-primary-light">{student.email}</td>
                  <td className="py-2 px-4 border-b border-primary-light">{student.phoneNumber}</td>
                  <td className="py-2 px-4 border-b border-primary-light">{student.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-primary-darker mt-4">No students found for the selected company.</p>
        )}
      </div>
    </div>
  );
};

export default PlacedStudents;
