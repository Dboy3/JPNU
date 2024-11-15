import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAcademicDetails, resetState } from "./academicDetailsSlice";

const theme = {
  primary: {
    light: "hsla(240, 100%, 60%, .45)",
    lighter: "hsla(240, 100%, 70%, .45)",
    lightest: "hsla(240, 100%, 80%, .45)",
    DEFAULT: "hsla(240, 100%, 50%, .45)",
    dark: "hsla(240, 100%, 40%, .45)",
    darker: "hsla(240, 100%, 30%, .45)",
    darkest: "hsla(240, 100%, 20%, .45)",
  },
};

const AcademicDetailsForm = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.academicDetails
  );

  const [formData, setFormData] = useState({
    rollNo: "",
    email: "",
    isDiplomaToDegree: false,
    semester1: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    semester2: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    semester3: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    semester4: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    semester5: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    semester6: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    semester7: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    semester8: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name.includes("semester")) {
      const [semester, field] = name.split(".");
      setFormData({
        ...formData,
        [semester]: { ...formData[semester], [field]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAcademicDetails(formData));
  };

  const handleReset = () => {
    dispatch(resetState());
    setFormData({
      rollNo: "",
      email: "",
      isDiplomaToDegree: false,
      semester1: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
      semester2: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
      semester3: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
      semester4: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
      semester5: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
      semester6: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
      semester7: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
      semester8: { cgpa: "", liveBacklogs: "", closedBacklogs: "" },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary-lightest p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-2xl font-semibold text-primary-dark text-center mb-6">
          Academic Details
        </h2>
        <div className="mb-4">
          <label className="block text-primary-dark text-sm font-medium mb-2">
            Roll No:
          </label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            className="w-full p-3 border border-primary-lighter rounded-md text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary-dark text-sm font-medium mb-2">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-primary-lighter rounded-md text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center text-primary-dark text-sm">
            <input
              type="checkbox"
              name="isDiplomaToDegree"
              checked={formData.isDiplomaToDegree}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="ml-2">Is Diploma to Degree</span>
          </label>
        </div>

        {Object.keys(formData)
          .filter((key) => key.includes("semester"))
          .map((semesterKey) => (
            <fieldset
              key={semesterKey}
              className="border border-primary-lighter p-4 mb-6 rounded-md"
            >
              <legend className="font-semibold text-primary-dark mb-2">
                {semesterKey}
              </legend>
              <div className="mb-4">
                <label className="block text-primary-dark text-sm font-medium mb-2">
                  CGPA:
                </label>
                <input
                  type="number"
                  step="0.01"
                  name={`${semesterKey}.cgpa`}
                  value={formData[semesterKey].cgpa}
                  onChange={handleChange}
                  className="w-full p-3 border border-primary-lighter rounded-md text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-dark text-sm font-medium mb-2">
                  Live Backlogs:
                </label>
                <input
                  type="number"
                  name={`${semesterKey}.liveBacklogs`}
                  value={formData[semesterKey].liveBacklogs}
                  onChange={handleChange}
                  className="w-full p-3 border border-primary-lighter rounded-md text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-dark text-sm font-medium mb-2">
                  Closed Backlogs:
                </label>
                <input
                  type="number"
                  name={`${semesterKey}.closedBacklogs`}
                  value={formData[semesterKey].closedBacklogs}
                  onChange={handleChange}
                  className="w-full p-3 border border-primary-lighter rounded-md text-sm"
                />
              </div>
            </fieldset>
          ))}

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-dark text-white p-3 rounded-md w-1/2 mr-2 hover:bg-primary-darker disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-primary-light text-primary-dark p-3 rounded-md w-1/2 ml-2 hover:bg-primary-lighter"
          >
            Reset
          </button>
        </div>
      </form>

      {success && <p className="text-green-600 text-center mt-4">{success}</p>}
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </div>
  );
};

export default AcademicDetailsForm;
