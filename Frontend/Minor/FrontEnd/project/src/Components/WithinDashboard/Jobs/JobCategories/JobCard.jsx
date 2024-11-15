import React from "react";
import { NavLink } from "react-router-dom";

// pass the job-ids
function JobCard({ job }) {
  console.log(job);
  return (
    <NavLink
      className="space-x-4 border bg-white shadow-lg p-4 rounded-lg flex items-center"
      to={`/d/jobs/${job.id}`}
    >
      <div className="">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary-dark">
            {job.role}
          </h3>
          <p className="text-gray-700">{job.companyName}</p>

          {/* Conditionally render internship or full-time details */}
          {job.internship && job.internship.name && (
            <div className="mt-2">
              <p className="text-gray-700">
                Internship: {job.internship.name} | Duration:{" "}
                {job.internship.duration} | Stipend: ₹{job.internship.stipend}
              </p>
            </div>
          )}

          {job.fulltime && job.fulltime.name && (
            <div className="mt-2">
              <p className="text-gray-700">
                Full-time: {job.fulltime.name} | CTC: ₹{job.fulltime.ctc}
              </p>
            </div>
          )}

          <p className="text-primary-dark mt-1">
            Number of Positions: {job.NumberOfPositions}
          </p>
          <p className="text-primary-dark mt-1">
            {/* Eligible Branches: {job.eligibleBranch.join(", ")} */}
          </p>
          <p className="text-gray-500 mt-1">Start Date: {job.StartDate}</p>
          <p className="text-gray-500 mt-1">End Date: {job.EndDate}</p>

          <p className="text-gray-500 mt-2">{job.OtherDetails}</p>
        </div>
      </div>
    </NavLink>
  );
}

export default JobCard;
