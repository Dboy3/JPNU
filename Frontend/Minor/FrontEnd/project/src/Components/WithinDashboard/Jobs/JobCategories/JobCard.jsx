import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function JobCard({ job }) {
  const location = useLocation(); // Get the current path

  console.log("from card", job);

  // Conditionally render NavLink or div based on the current path
  const isApplicationsPage = location.pathname === "/d/jobs/applications";

  const CardContent = (
    <div className="space-x-4 border bg-white shadow-lg p-4 rounded-lg flex items-center">
      <div className="">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary-dark">
            {job.roles.join(" / ")}
          </h3>
          <p className="text-gray-700">{job.companyName}</p>

          {/* Conditionally render internship or full-time details */}
          {job.employmentType.internship && (
            <div className="mt-2">
              <p className="text-gray-700">Internship: Not Available</p>
            </div>
          )}

          {job.employmentType.fullTime && (
            <div className="mt-2">
              <p className="text-gray-700">
                Full-time: Available | CTC: ₹{job.ctc}
              </p>
            </div>
          )}

          <p className="text-primary-dark mt-1">
            Locations: {job.location.join(", ")}
          </p>
          <p className="text-primary-dark mt-1">
            Eligible Courses: {job.eligibleCourses.join(", ")}
          </p>
          <p className="text-primary-dark mt-1">
            Required CGPA: {job.requiredCgpa}
          </p>
          <p className="text-gray-500 mt-1">
            Registration Period: {job.registrationStartDate.split("T")[0]} to{" "}
            {job.registrationEndDate.split("T")[0]}
          </p>

          <p className="text-gray-500 mt-2">{job.otherDetails}</p>
        </div>
      </div>
    </div>
  );

  return isApplicationsPage ? (
    <div>{CardContent}</div> // Render as a div if on applications page
  ) : (
    <NavLink to={`/d/jobs/${job._id}`}>{CardContent}</NavLink> // Render as NavLink otherwise
  );
}

export default JobCard;
