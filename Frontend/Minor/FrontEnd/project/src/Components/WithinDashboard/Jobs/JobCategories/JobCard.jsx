import React from "react";
import { NavLink } from "react-router-dom";

// pass the job-ids
function JobCard({ job }) {
  console.log(job);
  return (
    <NavLink
      className="space-x-4 border bg-white shadow-lg p-4 rounded-lg flex items-center"
      to={`/d/jobs/${job._id}`}
    >
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
            Registration Period: {job.registrationStartDate} to {job.registrationEndDate}
          </p>

          <p className="text-gray-500 mt-2">{job.otherDetails}</p>
        </div>
      </div>
    </NavLink>
  );
}

export default JobCard;
