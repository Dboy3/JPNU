import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";

const JobPost = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      jobDriveName: "Campus Recruitment Drive 2024",
      companyName: "Google",
      roles: ["Software Engineer", "Data Scientist"],
      employmentType: "fulltime",
      ctc: [{ role: "Software Engineer", amount: 3000000 }],
      stipend: [{ role: "Intern", amount: 50000 }],
      eligibleCourses: [{ role: "Software Engineer", course: "B.Tech" }],
      requiredCgpa: [{ role: "Software Engineer", cgpa: 8 }],
      requiredBacklogs: [{ role: "Software Engineer", backlogsAllowed: "No" }],
      location: ["Bangalore"],
      otherDetails: "Remote work is available",
      registrationOpenDate: "2024-01-01",
      registrationCloseDate: "2024-01-31",
      postDate: "2023-12-15",
      status: "active",
      numberOfPositions: 10,
      requiredSkills: ["JavaScript", "ReactJS", "Node.js"],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddJob = () => {
    setCurrentJob(null);
    reset();
    setShowForm(true);
  };

  const handleEditJob = (job) => {
    setCurrentJob(job);
    reset({
      jobDriveName: job.jobDriveName,
      companyName: job.companyName,
      roles: job.roles.join(", "),
      employmentType: job.employmentType,
      ctc: job.ctc.map((item) => `${item.role}: ${item.amount}`).join(", "),
      stipend: job.stipend
        .map((item) => `${item.role}: ${item.amount}`)
        .join(", "),
      eligibleCourses: job.eligibleCourses
        .map((item) => `${item.role}: ${item.course}`)
        .join(", "),
      requiredCgpa: job.requiredCgpa
        .map((item) => `${item.role}: ${item.cgpa}`)
        .join(", "),
      requiredBacklogs: job.requiredBacklogs
        .map((item) => `${item.role}: ${item.backlogsAllowed}`)
        .join(", "),
      location: job.location.join(", "),
      otherDetails: job.otherDetails,
      registrationOpenDate: job.registrationOpenDate,
      registrationCloseDate: job.registrationCloseDate,
      numberOfPositions: job.numberOfPositions,
      requiredSkills: job.requiredSkills.join(", "),
    });
    setShowForm(true);
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const onSubmit = (data) => {
    const newJob = {
      id: currentJob ? currentJob.id : Date.now(),
      ...data,
      roles: data.roles.split(",").map((role) => role.trim()),
      ctc: data.ctc.split(",").map((item) => {
        const [role, amount] = item.split(":");
        return { role: role.trim(), amount: Number(amount.trim()) };
      }),
      stipend: data.stipend.split(",").map((item) => {
        const [role, amount] = item.split(":");
        return { role: role.trim(), amount: Number(amount.trim()) };
      }),
      eligibleCourses: data.eligibleCourses.split(",").map((item) => {
        const [role, course] = item.split(":");
        return { role: role.trim(), course: course.trim() };
      }),
      requiredCgpa: data.requiredCgpa.split(",").map((item) => {
        const [role, cgpa] = item.split(":");
        return { role: role.trim(), cgpa: Number(cgpa.trim()) };
      }),
      requiredBacklogs: data.requiredBacklogs.split(",").map((item) => {
        const [role, backlogsAllowed] = item.split(":");
        return { role: role.trim(), backlogsAllowed: backlogsAllowed.trim() };
      }),
      location: data.location.split(",").map((loc) => loc.trim()),
      requiredSkills: data.requiredSkills
        .split(",")
        .map((skill) => skill.trim()),
    };

    if (currentJob) {
      setJobs(jobs.map((job) => (job.id === currentJob.id ? newJob : job)));
    } else {
      console.log(newJob);
      setJobs([...jobs, newJob]);
    }

    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Postings</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleAddJob}
        >
          + Add New
        </button>
      </div>

      {jobs.length === 0 ? (
        <p>No job postings available. Add one using the button above.</p>
      ) : (
        <div className="grid gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 border rounded-lg shadow-md bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{job.jobDriveName}</h3>
                  <p className="text-gray-500">{job.companyName}</p>
                  <p>
                    <strong>Roles:</strong> {job.roles.join(", ")}
                  </p>
                  <p>
                    <strong>CTC:</strong>{" "}
                    {job.ctc.map((item, idx) => (
                      <span key={idx}>
                        {item.role}: {item.amount}
                      </span>
                    ))}
                  </p>
                  <p>
                    <strong>Eligible Courses:</strong>{" "}
                    {job.eligibleCourses.map((item, idx) => (
                      <span key={idx}>
                        {item.role}: {item.course}
                      </span>
                    ))}
                  </p>
                  <p className="text-gray-500">{job.location.join(", ")}</p>
                  <p className="mt-4">{job.otherDetails}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl mb-4">
              {currentJob ? "Edit Job Posting" : "Add New Job Posting"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Job Drive Name
                </label>
                <input
                  {...register("jobDriveName", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                />
                {errors.jobDriveName && (
                  <p className="text-red-500 text-sm">
                    Job Drive Name is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  {...register("companyName", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    Company Name is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Roles</label>
                <input
                  {...register("roles", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Separate roles with commas"
                />
                {errors.roles && (
                  <p className="text-red-500 text-sm">Roles are required</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">CTC</label>
                <input
                  {...register("ctc", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="e.g. Software Engineer:3000000"
                />
                {errors.ctc && (
                  <p className="text-red-500 text-sm">CTC is required</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Stipend
                </label>
                <input
                  {...register("stipend")}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="e.g. Intern:50000"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Eligible Courses
                </label>
                <input
                  {...register("eligibleCourses", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="e.g. Software Engineer:B.Tech"
                />
                {errors.eligibleCourses && (
                  <p className="text-red-500 text-sm">
                    Eligible Courses are required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Required CGPA
                </label>
                <input
                  {...register("requiredCgpa", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="e.g. Software Engineer:8"
                />
                {errors.requiredCgpa && (
                  <p className="text-red-500 text-sm">
                    Required CGPA is necessary
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Backlogs Allowed
                </label>
                <input
                  {...register("requiredBacklogs", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="e.g. Software Engineer:No"
                />
                {errors.requiredBacklogs && (
                  <p className="text-red-500 text-sm">
                    Specify if backlogs are allowed or not
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Job Location
                </label>
                <input
                  {...register("location", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Separate locations with commas"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">Location is required</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Required Skills
                </label>
                <input
                  {...register("requiredSkills", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Separate skills with commas"
                />
                {errors.requiredSkills && (
                  <p className="text-red-500 text-sm">
                    Required Skills are needed
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Number of Positions
                </label>
                <input
                  {...register("numberOfPositions", { required: true })}
                  type="number"
                  className="border px-4 py-2 rounded w-full"
                />
                {errors.numberOfPositions && (
                  <p className="text-red-500 text-sm">
                    Number of positions is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Other Details
                </label>
                <textarea
                  {...register("otherDetails")}
                  className="border px-4 py-2 rounded w-full"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Registration Start Date
                </label>
                <input
                  type="date"
                  {...register("registrationOpenDate", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                />
                {errors.registrationOpenDate && (
                  <p className="text-red-500 text-sm">Start date is required</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Registration End Date
                </label>
                <input
                  type="date"
                  {...register("registrationCloseDate", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                />
                {errors.registrationCloseDate && (
                  <p className="text-red-500 text-sm">End date is required</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {currentJob ? "Update Job" : "Add Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPost;
