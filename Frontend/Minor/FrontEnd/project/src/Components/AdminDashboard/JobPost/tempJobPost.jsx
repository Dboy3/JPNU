import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  addJobPost,
  updateJobPost,
  deleteJobPost,
  fetchAllJobPosts,
} from "./jobSlice"; // Adjust the import path as needed

const JobPost = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobPosts);
  const [showForm, setShowForm] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchAllJobPosts()); // Fetch all jobs on component load
  }, [dispatch]);

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
      stipend: job.stipend.map((item) => `${item.role}: ${item.amount}`).join(", "),
      eligibleCourses: job.eligibleCourses.map((item) => `${item.role}: ${item.course}`).join(", "),
      requiredCgpa: job.requiredCgpa.map((item) => `${item.role}: ${item.cgpa}`).join(", "),
      requiredBacklogs: job.requiredBacklogs.map((item) => `${item.role}: ${item.backlogsAllowed}`).join(", "),
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
    dispatch(deleteJobPost(id)); // Dispatch delete action
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
      requiredSkills: data.requiredSkills.split(",").map((skill) => skill.trim()),
    };

    if (currentJob) {
      dispatch(updateJobPost(newJob)); // Dispatch update action
    } else {
      dispatch(addJobPost(newJob)); // Dispatch add action
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
            <div key={job.id} className="p-6 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{job.jobDriveName}</h3>
                  <p className="text-gray-500">{job.companyName}</p>
                  <p><strong>Roles:</strong> {job.roles.join(", ")}</p>
                  <p><strong>CTC:</strong> {job.ctc.map((item, idx) => (
                    <span key={idx}>{item.role}: {item.amount}</span>
                  ))}</p>
                  <p><strong>Eligible Courses:</strong> {job.eligibleCourses.map((item, idx) => (
                    <span key={idx}>{item.role}: {item.course}</span>
                  ))}</p>
                  <p className="text-gray-500">{job.location.join(", ")}</p>
                  <p className="mt-4">{job.otherDetails}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditJob(job)} className="text-blue-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteJob(job.id)} className="text-red-500">
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
            <h2 className="text-2xl mb-4">{currentJob ? "Edit Job Posting" : "Add New Job Posting"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Form fields remain the same */}
              {/* ... */}
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
