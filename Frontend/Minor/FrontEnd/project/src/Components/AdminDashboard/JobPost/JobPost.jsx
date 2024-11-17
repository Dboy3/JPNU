import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const eligibleCoursesList = ["CSE", "EE", "EC", "Civil", "Mech"];
const JobPost = () => {
  const [jobs, setJobs] = useState([]); // Initialize jobs as an empty array
  const [showForm, setShowForm] = useState(false);
  const [showCtc, setShowCtc] = useState(false);
  const [showStipend, setShowStipend] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const currentDate = new Date().toISOString().split("T")[0];

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/jobs/get", {
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Error fetching jobs:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Fetched Jobs Data:", data);
      setJobs(Array.isArray(data.jobPostings) ? data.jobPostings : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Add a new job post to the database
  const addJob = async (newJob) => {
    console.log(newJob);
    try {
      const response = await fetch("http://localhost:8000/api/jobs/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "The company already posted.");
        return;
      }

      const data = await response.json();
      console.log("Job added successfully:", data);
      alert("Job posting added successfully!");

      // Refresh the job list
      fetchJobs();
    } catch (error) {
      console.error("Error adding job:", error);
      alert(`${error}`);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleEmploymentTypeChange = (e) => {
    const { name, checked } = e.target;
    if (name === "fullTime") setShowCtc(checked);
    if (name === "internship") setShowStipend(checked);
  };

  const handleAddJob = () => {
    reset();
    setShowForm(true);
  };

  // const onSubmit = (data) => {
  //   console.log("check");
  //   if (data.registrationStartDate < currentDate) {
  //     alert("The date should be greater than or equal to the current date.");
  //     return;
  //   }

  //   if (data.registrationEndDate <= data.registrationStartDate) {
  //     alert("End date should be at least one day after the start date.");
  //     return;
  //   }

  //   const newJob = {
  //     companyName: data.companyName,
  //     roles: data.roles ? data.roles.split(",").map((role) => role.trim()) : [],
  //     employmentType: {
  //       fullTime: showCtc,
  //       internship: showStipend,
  //     },
  //     ctc: showCtc ? Number(data.ctc) : null,
  //     stipend: showStipend ? Number(data.stipend) : null,
  //     // eligibleCourses: data.eligibleCourses
  //     //   ? data.eligibleCourses.split(",").map((course) => course.trim())
  //     //   : [],
  //     eligibleCourses: eligibleCoursesList.filter(
  //       (course) => data[course] === true
  //     ),
  //     requiredCgpa: Number(data.requiredCgpa),
  //     location: data.location
  //       ? data.location.split(",").map((loc) => loc.trim())
  //       : [],
  //     otherDetails: data.otherDetails,
  //     registrationStartDate: data.registrationStartDate,
  //     registrationEndDate: data.registrationEndDate,
  //     urlLink: data.urlLink || null,
  //   };
  //   console.log(newJob);
  //   addJob(newJob);
  //   setShowForm(false);
  // };

  const onSubmit = (data) => {
    console.log("Submitted data:", data);

    if (data.registrationStartDate < currentDate) {
      alert("The date should be greater than or equal to the current date.");
      return;
    }

    if (data.registrationEndDate <= data.registrationStartDate) {
      alert("End date should be at least one day after the start date.");
      return;
    }

    const arr = eligibleCoursesList.filter((course) => data[course] === true);

    if (arr.length == 0) {
      alert("Please enter at least one course name");
      return;
    }

    const newJob = {
      companyName: data.companyName,
      roles: data.roles ? data.roles.split(",").map((role) => role.trim()) : [],
      employmentType: {
        fullTime: showCtc,
        internship: showStipend,
      },
      ctc: showCtc ? Number(data.ctc) : null,
      stipend: showStipend ? Number(data.stipend) : null,
      eligibleCourses: eligibleCoursesList.filter(
        (course) => data[course] === true
      ),
      requiredCgpa: Number(data.requiredCgpa),
      location: data.location
        ? data.location.split(",").map((loc) => loc.trim())
        : [],
      otherDetails: data.otherDetails,
      registrationStartDate: data.registrationStartDate,
      registrationEndDate: data.registrationEndDate,
      urlLink: data.urlLink || null,
    };
    console.log("New Job:", newJob);
    addJob(newJob);
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

      {jobs.length > 0 ? (
        <div className="grid gap-8">
          {jobs.map((job) => (
            <div
              key={job._id || job.postId} // Use `postId` as a fallback if `_id` is missing
              className="p-6 border rounded-lg shadow-md bg-white"
            >
              <h3 className="text-xl font-semibold">{job.companyName}</h3>

              {/* Roles */}
              <p>
                <strong>Roles:</strong> {job.roles?.join(", ") || "N/A"}
              </p>

              {/* CTC */}
              <p>
                <strong>CTC:</strong>{" "}
                {job.ctc ? `${job.ctc}` : "Not Applicable"}
              </p>

              {/* Stipend */}
              <p>
                <strong>Stipend:</strong> {job.stipend || "Not Applicable"}
              </p>

              {/* Location */}
              <p>
                <strong>Location:</strong> {job.location?.join(", ") || "N/A"}
              </p>

              {/* Eligible Courses */}
              <p>
                <strong>Eligible Courses:</strong>{" "}
                {job.eligibleCourses?.join(", ") || "N/A"}
              </p>

              {/* Required CGPA */}
              <p>
                <strong>Required CGPA:</strong> {job.requiredCgpa || "N/A"}
              </p>

              {/* Registration Dates */}
              <p>
                <strong>Registration Period:</strong>{" "}
                {job.registrationStartDate && job.registrationEndDate
                  ? `${new Date(
                      job.registrationStartDate
                    ).toLocaleDateString()} - ${new Date(
                      job.registrationEndDate
                    ).toLocaleDateString()}`
                  : "N/A"}
              </p>

              {/* Other Details */}
              <p className="mt-4">{job.otherDetails}</p>

              {/* URL Link */}
              {job.urlLink && (
                <p>
                  URL:{" "}
                  <a
                    href={job.urlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {job.urlLink}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No job postings available.</p>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl mb-4">Add New JobPost</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Company Name */}
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

              {/* Roles */}
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

              {/* Employment Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Employment Type
                </label>
                <div>
                  <input
                    type="checkbox"
                    name="fullTime"
                    onChange={handleEmploymentTypeChange}
                  />
                  <label className="ml-2">Full-Time</label>
                  <input
                    type="checkbox"
                    name="internship"
                    onChange={handleEmploymentTypeChange}
                    className="ml-4"
                  />
                  <label className="ml-2">Internship</label>
                </div>
              </div>

              {/* CTC */}
              {showCtc && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">CTC</label>
                  <input
                    type="number"
                    {...register("ctc", {
                      required: showCtc,
                      min: 0,
                      max: 10000000,
                      valueAsNumber: true,
                    })}
                    className="border px-4 py-2 rounded w-full"
                  />
                  {errors.ctc && (
                    <p className="text-red-500 text-sm">
                      CTC should be non-negative and ≤ 10,000,000
                    </p>
                  )}
                </div>
              )}

              {showStipend && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Stipend
                  </label>
                  <input
                    type="number"
                    {...register("stipend", {
                      required: showStipend,
                      min: 0,
                      max: 10000000,
                      valueAsNumber: true,
                    })}
                    className="border px-4 py-2 rounded w-full"
                  />
                  {errors.stipend && (
                    <p className="text-red-500 text-sm">
                      Stipend should be non-negative and ≤ 10,000,000
                    </p>
                  )}
                </div>
              )}

              {/* Eligible Courses */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Eligible Courses
                </label>
                <div className="flex flex-wrap space-x-4">
                  {eligibleCoursesList.map((course) => (
                    <div key={course} className="flex items-center">
                      <input
                        type="checkbox"
                        id={course}
                        {...register(course)}
                        className="mr-2"
                      />
                      <label htmlFor={course} className="text-sm">
                        {course}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required CGPA */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Minimum Required CGPA
                </label>
                <input
                  type="number"
                  placeholder="enter digits"
                  {...register("requiredCgpa", {
                    required: true,
                    min: 0,
                    max: 10,
                    valueAsNumber: true,
                  })}
                  step="0.01" // Allows two decimal places
                  className="border px-4 py-2 rounded w-full"
                />
                {errors.requiredCgpa && (
                  <p className="text-red-500 text-sm">
                    CGPA must be between 0 and 10
                  </p>
                )}
              </div>

              {/* URL Link */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  URL Link (optional)
                </label>
                <input
                  type="url"
                  {...register("urlLink")}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="https://example.com"
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  {...register("location", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter locations, separated by commas"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">Location is required</p>
                )}
              </div>

              {/* Other Details */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Other Details
                </label>
                <textarea
                  {...register("otherDetails")}
                  className="border px-4 py-2 rounded w-full"
                  rows="4"
                />
              </div>

              {/* Date Picker for Registration Period */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Registration Period
                </label>
                <div className="flex space-x-4">
                  {/* Start Date */}
                  <input
                    type="date"
                    {...register("registrationStartDate", {
                      required: "Registration Start Date is required",
                    })}
                    className="border px-4 py-2 rounded"
                  />
                  {/* End Date */}
                  <input
                    type="date"
                    {...register("registrationEndDate", {
                      required: "Registration End Date is required",
                    })}
                    className="border px-4 py-2 rounded"
                  />
                </div>
                {errors.registrationStartDate && (
                  <p className="text-red-500 text-sm">
                    Registration Start Date is required
                  </p>
                )}
                {errors.registrationEndDate && (
                  <p className="text-red-500 text-sm">
                    Registration End Date is required
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded mt-4"
              >
                Add Job Posting
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPost;
