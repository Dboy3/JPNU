import React, { useState, useEffect } from 'react';


function StudentList() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companyList = [
        { id: 'j1', name: 'Global Analytics' },
        { id: 'j2', name: 'Tech Innovators' },
        { id: 'j3', name: 'FinTech Solutions' }
      ];
      setCompanies(companyList);
    };
    fetchCompanies();
  }, []);

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleShowData = async () => {
    if (selectedCompany) {
      const fetchStudents = async () => {
        const mockStudentData = {
          j1: [
            { id: 's1', name: 'Student 1' },
            { id: 's2', name: 'Student 2' }
          ],
          j2: [{ id: 's3', name: 'Student 3' }],
          j3: [
            { id: 's4', name: 'Student 4' },
            { id: 's5', name: 'Student 5' }
          ]
        };
        setStudents(mockStudentData[selectedCompany] || []);
      };
      fetchStudents();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-primary-dark mb-4 text-center">Student Applications</h2>
      <div className="flex items-center space-x-3 mb-4">
        <select
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="border text-primary-dark p-2 rounded focus:outline-none focus:ring focus:ring-primary-light transition-all"
        >
          <option value="" disabled>Select a Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleShowData}
          className="bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark transition-all focus:outline-none"
        >
          Show Data
        </button>
      </div>

      <div>
        {students.length > 0 ? (
          <ul className="space-y-2">
            {students.map((student) => (
              <li key={student.id} className="p-2 bg-primary-lightest text-primary-dark rounded-md shadow-sm">
                {student.name}
              </li>
            ))}
          </ul>
        ) : (
          selectedCompany && (
            <p className="text-primary-darker italic text-center">No students applied for this job.</p>
          )
        )}
      </div>
    </div>
  );
}

export default StudentList;
