import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getJobById,
  getSingleJob,
} from "../../../AdminDashboard/JobPost/jobPostSlice";
import { selectUser } from "../../../../Pages/auth";
import { applyForJob } from "../jobSlice";
import { useNavigate } from "react-router-dom";
import { fetchApplications } from "../jobSlice";

const JD = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate() ;

  useEffect(() => {
    dispatch(getJobById(id));
  }, [dispatch, id]);

  const job = useSelector(getSingleJob);
  const user = useSelector(selectUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const ishold = user.hold;

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // change -note
  // const handleFormSubmit = () => {
  //   // call from the backend to check is profile complete or not

  //   if (isChecked) {
  //     setIsApplied(true);
  //     setIsModalOpen(false);
  //     const data = { userId: user.userId, postId: job.postId };
  //     dispatch(applyForJob(data));
  //   } else {
  //     alert("Please check the agreement before submitting.");
  //   }
  // };

  const handleFormSubmit = async () => {
    try {
      // Call the backend API to check if the profile is complete
      const response = await fetch("http://localhost:8000/api/profile/isProf", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "NOT OK") {
        alert("Please add at least one project to complete your profile.");
        return;
      }

      if (isChecked) {
        setIsApplied(true);
        setIsModalOpen(false);

        const data = { userId: user.userId, postId: job.postId };
        dispatch(applyForJob(data));
        await dispatch(fetchApplications({ userId: user.userId })); 
        navigate("/d/jobs/applications");
      } else {
        alert("Please check the agreement before submitting.");
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error);
      alert(
        "An error occurred while checking your profile. Please try again later."
      );
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {job.roles.join(", ")}
          </h1>
          <p className="text-sm text-gray-600">{job.companyName}</p>
        </div>
        <div className="flex space-x-2 items-center">
          {job.employmentType?.fullTime && (
            <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full">
              Full-Time
            </span>
          )}
          {job.employmentType?.internship && (
            <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full">
              Internship
            </span>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-3 gap-4 py-4">
        <div>
          <h2 className="font-bold text-gray-800">Location</h2>
          <p className="text-gray-600">{job.location.join(", ")}</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Required CGPA</h2>
          <p className="text-gray-600">{job.requiredCgpa}</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Registration Period</h2>
          <p className="text-gray-600">
            {job.registrationStartDate.split("T")[0]} to{" "}
            {job.registrationEndDate.split("T")[0]}
          </p>
        </div>
      </div>

      {/* Full-Time Details */}
      {job.employmentType?.fullTime && (
        <div className="my-4">
          <h2 className="font-bold text-gray-800">Full-Time Details</h2>
          <p className="text-gray-600">CTC: INR {job.ctc}</p>
        </div>
      )}

      {/* Eligible Courses */}
      <div className="my-4">
        <h2 className="font-bold text-gray-800">Eligible Courses</h2>
        <p className="text-gray-600">{job.eligibleCourses.join(", ")}</p>
      </div>

      {/* Other Details */}
      {job.otherDetails && (
        <div className="my-4">
          <h2 className="font-bold text-gray-800">Other Details</h2>
          <p className="text-gray-600">{job.otherDetails}</p>
        </div>
      )}

      {/* Alert if Account is on Hold */}
      {ishold && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
          <p>
            Your account has been put on hold. Please contact the administrator.
          </p>
        </div>
      )}

      {/* Apply Button */}
      <div className="my-6">
        <button
          className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary-darker"
          onClick={handleClick}
          disabled={ishold}
        >
          Apply Now
        </button>
        {isApplied && (
          <p className="text-green-500 mt-4">
            You have applied for this job successfully!
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Apply for {job.roles.join(", ")}
            </h2>
            <div className="flex items-center mb-4 bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2 w-5 h-5 text-primary-dark border-gray-300 rounded focus:ring-primary-darker"
              />
              <label className="text-gray-800 font-medium">
                I am aware that the details entered by me are valid. Please
                check resume before submitting application.
              </label>
            </div>

            <button
              onClick={handleFormSubmit}
              className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary-darker w-full"
            >
              Submit Application
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JD;
