import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaClipboardList,
  FaFileAlt,
} from "react-icons/fa";

const pages = [
  { name: "JobPost",  path: "/" },
  { name: "GetStudentList",  path: "/studentlist" },
  { name: "ExpenseList",  path: "/expenselist" },
  { name: "Notifications",  path: "/notification" },
  { name: "PlacedStudents",  path: "/placedstudents" },
  { name: "PreviousRecords",  path: "/history" },
  { name: "AddDetails",  path: "/addDetails" },
];

function AdminSidebar({onPageChange }) {

  return (
    <div
      className={`bg-white shadow-md fixed top-0 h-full md:static md:w-40`}
    >
      <nav className="h-auto mt-10 flex-1 flex md:flex-col md:justify-start justify-around">
        <ul className="space-y-4 md:space-y-0 md:space-x-0 space-x-4 md:flex-col flex">
          {pages.map((page) => (
            <li
              key={page.name}
              onClick={() => onPageChange(page.name.toLowerCase())}
            >
              <Link
                to={page.path}
                className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
              >
                {<span className="ml-4">{page.name}</span> }
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;
