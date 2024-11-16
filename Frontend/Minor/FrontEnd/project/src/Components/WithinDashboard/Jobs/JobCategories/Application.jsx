import React, { useEffect } from "react";
import JobCard from "./JobCard";
import { useDispatch, useSelector } from "react-redux";
// import {
//   getApplicationsByUserId,
//   getApplicationsList,
// } from "./jobApplicationSlice";
import { selectUser } from "../../../../Pages/auth";
import { fetchApplications, getApplications } from "../jobSlice";
function Application() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const data = { userId: user.userId };
    dispatch(fetchApplications(data));
  }, [dispatch]);

  // const userAppliedJobs = useSelector(getApplicationsList);
  const userAppliedJobs = useSelector(getApplications);
  console.log(userAppliedJobs);
  return (
    <div className="space-y-4">
      {userAppliedJobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}

export default Application;
