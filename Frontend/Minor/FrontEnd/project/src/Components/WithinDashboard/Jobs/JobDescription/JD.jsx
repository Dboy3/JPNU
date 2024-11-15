import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const JD = () => {
  const job = {
    title: "Frontend Developer",
    companyName: "Tech Solutions Ltd.",
    role: "Frontend",
    internship: {
      name: "internship",
      duration: "6 months",
      stipend: 20000,
    },
    fulltime: {
      name: "fulltime",
      ctc: 300000,
    },
    locations: ["Ahmedabad", "Banglore"],
    NumberOfPositions: 1,
    requiredSkills: ["React", "JavaScript", "CSS"],
    eligibleBranch: ["Mechanical", "Civil"],
    BacklogsAllowed: "Yes",
    StartDate: "2024-03-01",
    EndDate: "2024-03-31",
    OtherDetails: "2 rounds of interviews and a coding assessment",
  };

  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleClick = (e) => {
    console.log(e);
    setIsModalOpen(true);
    // dispatch(applyForJob({ studentId, jobId }));
    // dispatch(push it in application)
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFormSubmit = () => {
    // here we need to dispatch the APIs 
    if (isChecked) {
      setIsApplied(true);
      setIsModalOpen(false);
    } else {
      alert("Please check the agreement before submitting.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{job.title}</h1>
          <p className="text-sm text-gray-600">{job.companyName}</p>
        </div>
        <div className="flex space-x-2 items-center">
          <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full">
            On Campus
          </span>
          <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full">
            Eligible
          </span>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-3 gap-4 py-4">
        <div>
          <h2 className="font-bold text-gray-800">Role</h2>
          <p className="text-gray-600">{job.role}</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Locations</h2>
          <p className="text-gray-600">{job.locations.join(", ")}</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Number of Positions</h2>
          <p className="text-gray-600">{job.NumberOfPositions}</p>
        </div>
      </div>

      {/* Internship Details */}
      {job.internship && (
        <div className="my-4">
          <h2 className="font-bold text-gray-800">Internship Details</h2>
          <p className="text-gray-600">Duration: {job.internship.duration}</p>
          <p className="text-gray-600">Stipend: INR {job.internship.stipend}</p>
        </div>
      )}

      {/* Full-Time Details */}
      {job.fulltime && (
        <div className="my-4">
          <h2 className="font-bold text-gray-800">Full-Time Details</h2>
          <p className="text-gray-600">CTC: INR {job.fulltime.ctc}</p>
        </div>
      )}

      {/* Eligible Branches */}
      <div className="my-4">
        <h2 className="font-bold text-gray-800">Eligible Branches</h2>
        <p className="text-gray-600">{job.eligibleBranch.join(", ")}</p>
      </div>

      {/* Required Skills */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="my-4">
          <h2 className="font-bold text-gray-800">Required Skills</h2>
          <p className="text-gray-600">{job.requiredSkills.join(", ")}</p>
        </div>
      )}

      {/* Backlogs Allowed */}
      <div className="my-4">
        <h2 className="font-bold text-gray-800">Backlogs Allowed</h2>
        <p className="text-gray-600">{job.BacklogsAllowed}</p>
      </div>

      {/* Start and End Date */}
      <div className="my-4">
        <h2 className="font-bold text-gray-800">Job Duration</h2>
        <p className="text-gray-600">Start Date: {job.StartDate}</p>
        <p className="text-gray-600">End Date: {job.EndDate}</p>
      </div>

      {/* Other Details */}
      {job.OtherDetails && (
        <div className="my-4">
          <h2 className="font-bold text-gray-800">Other Details</h2>
          <p className="text-gray-600">{job.OtherDetails}</p>
        </div>
      )}

      {/* Apply Button */}
      <div className="my-6">
        <button
          className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary-darker"
          onClick={handleClick}
        >
          Apply Now
        </button>
        {isApplied && (
          <p className="text-green-500 mt-4">You have applied for this job successfully!</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Apply for {job.title}
            </h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="text-gray-600">
                I am aware that the details entered by me are valid
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
