import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { fetchJobPosts, addJobPost, updateJobPost, deleteJobPost } from './jobPostSlice';

const JobPost = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);
  
  const [showForm, setShowForm] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchJobPosts());
  }, [dispatch]);

  const handleAddJob = () => {
    setCurrentJob(null);
    reset();
    setShowForm(true);
  };

  const handleEditJob = (job) => {
    setCurrentJob(job);
    reset({
      companyName: job.companyName,
      roles: job.roles.join(", "),
      employmentType: job.employmentType,
      ctc: job.ctc || '',
      stipend: job.stipend || '',
      eligibleCourses: job.eligibleCourses.join(", "),
      requiredCgpa: job.requiredCgpa,
      location: job.location.join(", "),
      otherDetails: job.otherDetails,
      registrationStartDate: job.registrationStartDate,
      registrationEndDate: job.registrationEndDate,
      urlLink: job.urlLink || '',
    });
    setShowForm(true);
  };

  const handleDeleteJob = (id) => {
    dispatch(deleteJobPost(id));
  };

  const onSubmit = (data) => {
    const newJob = {
      id: currentJob ? currentJob.id : Date.now(),
      companyName: data.companyName,
      roles: data.roles.split(",").map((role) => role.trim()),
      employmentType: { fullTime: data.fullTime, internship: data.internship },
      ctc: data.ctc || null,
      stipend: data.stipend || null,
      eligibleCourses: data.eligibleCourses.split(",").map((course) => course.trim()),
      requiredCgpa: data.requiredCgpa,
      location: data.location.split(",").map((loc) => loc.trim()),
      otherDetails: data.otherDetails,
      registrationStartDate: data.registrationStartDate,
      registrationEndDate: data.registrationEndDate,
      urlLink: data.urlLink || null,
    };

    if (currentJob) {
      dispatch(updateJobPost(newJob));
    } else {
      dispatch(addJobPost(newJob));
    }

    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Postings</h1>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddJob}>
          + Add New
        </button>
      </div>

      {status === 'loading' ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : jobs.length === 0 ? (
        <p>No job postings available. Add one using the button above.</p>
      ) : (
        <div className="grid gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{job.companyName}</h3>
                  <p><strong>Roles:</strong> {job.roles.join(", ")}</p>
                  <p><strong>CTC:</strong> {job.ctc || 'Not Applicable'}</p>
                  <p><strong>Stipend:</strong> {job.stipend || 'Not Applicable'}</p>
                  <p><strong>Eligible Courses:</strong> {job.eligibleCourses.join(", ")}</p>
                  <p className="text-gray-500">{job.location.join(", ")}</p>
                  <p className="mt-4">{job.otherDetails}</p>
                  {job.urlLink && <p className="mt-2">URL: <a href={job.urlLink} target="_blank" rel="noopener noreferrer">{job.urlLink}</a></p>}
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
            <h2 className="text-2xl mb-4">{currentJob ? 'Edit Job Posting' : 'Add New Job Posting'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Form Fields */}
              {/* Company Name, Roles, etc. */}
              {/* Add the rest of the form as you already have in the original code */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPost;
