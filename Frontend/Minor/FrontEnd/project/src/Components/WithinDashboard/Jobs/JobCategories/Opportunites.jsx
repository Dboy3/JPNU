import React from "react";
import JobCard from "./JobCard";

const newJobsOpportunity = [
  {
    id: 1,
    companyName: "TechCorp Ltd.",
    roles: ["Software Engineer", "Frontend Developer"],
    employmentType: {
      fullTime: true,
      internship: false,
    },
    ctc: 8000000,
    stipend: null,
    eligibleCourses: ["B.Tech in Computer Science", "B.Tech in IT"],
    requiredCgpa: 7.5,
    location: ["New York, USA", "Remote"],
    otherDetails: "We are looking for passionate software engineers to join our team.",
    registrationStartDate: "2024-11-01",
    registrationEndDate: "2024-12-01",
    urlLink: "https://www.techcorp.com/careers",
  },
  {
    id: 2,
    companyName: "Innovate Inc.",
    roles: ["Data Scientist", "AI Researcher"],
    employmentType: {
      fullTime: true,
      internship: false,
    },
    ctc: 12000000,
    stipend: null,
    eligibleCourses: ["B.Tech in Computer Science", "M.Sc in Data Science"],
    requiredCgpa: 8.0,
    location: ["San Francisco, USA"],
    otherDetails: "Innovate Inc. is looking for top-tier data scientists to join our growing AI team.",
    registrationStartDate: "2024-11-10",
    registrationEndDate: "2024-12-15",
    urlLink: "https://www.innovate.com/careers",
  },
  {
    id: 3,
    companyName: "EduStart",
    roles: ["Internship - Backend Developer"],
    employmentType: {
      fullTime: false,
      internship: true,
    },
    ctc: null,
    stipend: 30000,
    eligibleCourses: ["B.Tech in Computer Science", "B.Tech in Information Technology"],
    requiredCgpa: 7.0,
    location: ["London, UK", "Remote"],
    otherDetails: "EduStart is offering a paid internship opportunity for aspiring backend developers.",
    registrationStartDate: "2024-11-20",
    registrationEndDate: "2024-12-20",
    urlLink: null,
  },
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

function Opportunites() {
  return (
    <div className="space-y-4">
      {newJobsOpportunity.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default Opportunites;
