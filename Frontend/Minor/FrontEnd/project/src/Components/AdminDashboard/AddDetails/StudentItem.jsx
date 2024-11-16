// StudentItem.js
import React, { useState } from "react";

const StudentItem = ({ student, updateStudentStatus }) => {
  const [isHeld, setIsHeld] = useState(student.isHeld);

  const handleHoldUnhold = async () => {
    try {
      // Trigger the API to update the student's status
      const response = await fetch("http://localhost:8000/api/jobs/holdUnhold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: student.userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update student status");
      }

      // Toggle the state of 'isHeld' locally and inform the parent
      setIsHeld((prevIsHeld) => !prevIsHeld);
      updateStudentStatus(student.userId, !isHeld); // Update parent state
    } catch (err) {
      console.error(err.message);
      alert("Failed to update student status. Please try again.");
    }
  };

  return (
    <li className="p-4 border border-primary-lighter rounded-md flex justify-between items-center">
      <div>
        <p className="text-primary-dark font-medium">Roll No: {student.rollNo}</p>
        <p className="text-primary-dark">Email: {student.email}</p>
      </div>
      <button
        onClick={handleHoldUnhold}
        className={`${
          isHeld ? "bg-red-600 hover:bg-red-700" : "bg-primary-dark hover:bg-primary-darker"
        } text-white p-2 rounded-md`}
      >
        {isHeld ? "Unhold" : "Hold"}
      </button>
    </li>
  );
};

export default StudentItem;
