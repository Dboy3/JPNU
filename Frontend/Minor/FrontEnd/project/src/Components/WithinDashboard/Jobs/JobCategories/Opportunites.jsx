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
    const obj = { userId : user.userId}
    dispatch(fetchOpportunities(obj));
  }, [dispatch]);

  const newJobsOpportunity = useSelector(getOpportunites);
  return (
    <div className="space-y-4">
      {newJobsOpportunity.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}


export default Opportunites;
