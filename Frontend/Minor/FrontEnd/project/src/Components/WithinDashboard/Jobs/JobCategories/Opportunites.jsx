import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchJobPosts,
//   getJobs,
// } from "../../../AdminDashboard/JobPost/jobPostSlice";
import { fetchOpportunities, getOpportunites } from "../jobSlice";
import { selectUser } from "../../../../Pages/auth";

function Opportunites() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const obj = { userId: user.userId };
    dispatch(fetchOpportunities(obj));
  }, [dispatch]);

  const newJobsOpportunity = useSelector(getOpportunites);
  console.log(newJobsOpportunity);

  return (
    <div className="space-y-4">
      {newJobsOpportunity.length > 0 ? (
        newJobsOpportunity.map((job) => <JobCard key={job._id} job={job} />)
      ) : (
        <div className="text-center text-gray-500">
          No current opportunities available.
        </div>
      )}
    </div>
  );
}

export default Opportunites;
