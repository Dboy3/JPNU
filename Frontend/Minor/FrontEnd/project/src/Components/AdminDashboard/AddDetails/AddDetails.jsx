import React, { useEffect, useState } from "react";
import StudentItem from "./StudentItem"; // Import the new StudentItem component

const AddDetails = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/jobs/getstudents");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data); // Initially show all students
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on the email search query
    if (searchQuery === "") {
      setFilteredStudents(students); // If no search query, show all students
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()) // Ensure email is not undefined
        )
      );
    }
  }, [searchQuery, students]);

  const updateStudentStatus = (userId, newStatus) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.userId === userId ? { ...student, isHeld: newStatus } : student
      )
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary-lightest p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-primary-dark text-center mb-6">
          Students List
        </h2>

        <div className="mb-4">
          <input
            type="text"
            className="p-2 w-full border border-primary-lighter rounded-md"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && <p className="text-center text-primary-dark">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && filteredStudents.length === 0 && (
          <p className="text-center text-primary-dark">No students found.</p>
        )}

        {!loading && !error && filteredStudents.length > 0 && (
          <ul className="space-y-4">
            {filteredStudents.map((student) => (
              <StudentItem
                key={student._id}
                student={student}
                updateStudentStatus={updateStudentStatus} // Pass the function as a prop
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddDetails;
