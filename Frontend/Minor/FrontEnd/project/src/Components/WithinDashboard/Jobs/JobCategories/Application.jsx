import React from "react";
import JobCard from "./JobCard";
function Application() {
  const userAppliedJobs = [
    {
      id: 4,
      companyName: "CloudSoft Solutions",
      roles: ["Cloud Engineer", "DevOps Specialist"],
      employmentType: {
        fullTime: true,
        internship: false,
      },
      ctc: 9000000,
      stipend: null,
      eligibleCourses: ["B.Tech in Computer Science", "B.Tech in Cloud Computing"],
      requiredCgpa: 7.5,
      location: ["Toronto, Canada"],
      otherDetails: "Join CloudSoft Solutions and build cutting-edge cloud infrastructure solutions.",
      registrationStartDate: "2024-11-05",
      registrationEndDate: "2024-12-05",
      urlLink: "https://www.cloudsoft.com/careers",
    },
  ];
  // simply use useEffect and dispatch the getJobOppotunites 

  return (
    <div className="space-y-4">
      {userAppliedJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default Application;
