import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentList() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);

  // New state for filters
  const [cgpaFilter, setCgpaFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/jobs/get");
        const companyList = response.data.jobPostings.map((job) => ({
          id: job.postId,
          name: job.companyName,
        }));
        setCompanies(companyList);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
    setStudents([]);
  };

  const handleShowData = async () => {
    if (selectedCompany) {
      try {
        const response = await axios.post("http://localhost:8000/api/jobs/getstudentbypostid", { postId: selectedCompany });
        setStudents(response.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  };

  // Apply filters to the student data
  const filteredStudents = students.filter((student) => {
    let matchesCgpa = true;
    let matchesBranch = true;

    // Apply CGPA filter
     // Apply CGPA filter
     if (cgpaFilter) {
      if (cgpaFilter === "below5" && student.cgpa >= 5) {
        matchesCgpa = false;
      } else if (cgpaFilter === "above5" && student.cgpa <= 5) {
        matchesCgpa = false;
      } else if (cgpaFilter === "above6" && student.cgpa <= 6) {
        matchesCgpa = false;
      } else if (cgpaFilter === "above7" && student.cgpa <= 7) {
        matchesCgpa = false;
      } else if (cgpaFilter === "above8" && student.cgpa <= 8) {
        matchesCgpa = false;
      } else if (cgpaFilter === "above9" && student.cgpa <= 9) {
        matchesCgpa = false;
      }
    }

    // Apply Branch filter
    if (branchFilter) {
      // Ensure we compare the branch in a case-sensitive manner
      matchesBranch = student.branch && student.branch.toUpperCase() === branchFilter.toUpperCase();
    }

    return matchesCgpa && matchesBranch;
  });

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
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
        <button
          onClick={handleShowData}
          className="bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark transition-all focus:outline-none"
        >
          Show Data
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-4">
      <select
          value={cgpaFilter}
          onChange={(e) => setCgpaFilter(e.target.value)}
          className="border text-primary-dark p-2 rounded focus:outline-none focus:ring focus:ring-primary-light transition-all"
        >
          <option value="">Select CGPA Filter</option>
          <option value="below5">Below 5</option>
          <option value="above5">Above 5</option>
          <option value="above6">Above 6</option>
          <option value="above7">Above 7</option>
          <option value="above8">Above 8</option>
          <option value="above9">Above 9</option>
        </select>

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border text-primary-dark p-2 rounded focus:outline-none focus:ring focus:ring-primary-light transition-all"
        >
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option>
          <option value="EC">EC</option>
          <option value="EE">EE</option>
        </select>
      </div>

      {/* Students Table */}
      <div>
        {filteredStudents.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">First Name</th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">Last Name</th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">Email</th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">Phone Number</th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">Branch</th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">CGPA</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="p-2">{student.firstName}</td>
                  <td className="p-2">{student.lastName}</td>
                  <td className="p-2">{student.email}</td>
                  <td className="p-2">{student.phoneNumber}</td>
                  <td className="p-2">{student.branch}</td>
                  <td className="p-2">{student.cgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedCompany && (
            <p className="text-primary-darker italic text-center">
              No students applied for this job or no students match your filters.
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default StudentList;
