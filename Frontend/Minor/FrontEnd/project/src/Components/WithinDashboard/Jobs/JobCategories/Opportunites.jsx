import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobPosts,
  getJobs,
} from "../../../AdminDashboard/JobPost/jobPostSlice";


function Opportunites() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchJobPosts());
  }, [dispatch]);

  const newJobsOpportunity = useSelector(getJobs);
  return (
    <div className="space-y-4">
      {newJobsOpportunity.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default Opportunites;
