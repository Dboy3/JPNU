import React, { useState, useEffect } from "react";

const ProjectDetailForm = () => {
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // change - note
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:8000/api/profile/getProj",
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           credentials: "include",
  //         }
  //       );
  //       const data = await response.json();

  //       // If data.data exists and is not empty, set projects, else set as an empty array
  //       if (data && data.data) {
  //         setProjects(data.data);
  //       } else {
  //         setProjects([]); // Ensure projects is always an array
  //       }

  //       console.log("Fetched projects:", data.data);
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //       setProjects([]); // In case of error, reset projects to an empty array
  //     }
  //   };

  //   fetchProjects();
  // }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/profile/getProj",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();

        // Ensure projects is an array
        if (data && Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          setProjects([]); // Fallback to an empty array
        }

        console.log("Fetched projects:", data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // Reset projects to an empty array on error
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);

    // Clear validation errors for the field
    if (errors[index]?.[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[index][field];
      setErrors(updatedErrors);
    }
  };

  const addProjectField = () => {
    setProjects([...projects, { title: "", link: "", description: "" }]);
  };

  const removeProjectField = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);

    // Remove errors for the removed project
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  };

  const validateFields = () => {
    const validationErrors = {};
    const urlRegex = /^(https?:\/\/)?localhost(:\d+)?(\/[a-zA-Z0-9%_./-]*)?$/;

    projects.forEach((project, index) => {
      const projectErrors = {};

      if (!project.title) {
        projectErrors.title = "Title is required.";
      }

      if (!project.description) {
        projectErrors.description = "Description is required.";
      }

      // Validate URL if a link is provided
      if (project.link && !urlRegex.test(project.link)) {
        projectErrors.link = "Please enter a valid URL.";
      }

      if (Object.keys(projectErrors).length > 0) {
        validationErrors[index] = projectErrors;
      }
    });

    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Printing the projects before submit", projects);

    // Submit the form to the API
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/profile/adProj", {
        method: "POST", // or PUT if updating an existing record
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projects: projects }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Projects submitted successfully:", data.message);
      } else {
        console.error("Failed to submit projects:", data.message);
        alert("you have enter duplicate project title");
      }
    } catch (error) {
      console.error("Error submitting projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-gray-700">Projects</label>
      {/* Only render if projects array has items */}
      {projects && projects.length > 0 ? (
        projects.map((project, index) => (
          <div key={index} className="border p-2 mb-4 rounded">
            <div className="mb-2">
              <input
                type="text"
                value={project.title}
                onChange={(e) =>
                  handleProjectChange(index, "title", e.target.value)
                }
                className={`w-full p-2 border rounded ${
                  errors[index]?.title ? "border-red-500" : ""
                }`}
                placeholder={`Enter project title ${index + 1}`}
              />
              {errors[index]?.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].title}
                </p>
              )}
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={project.link}
                onChange={(e) =>
                  handleProjectChange(index, "link", e.target.value)
                }
                className={`w-full p-2 border rounded ${
                  errors[index]?.link ? "border-red-500" : ""
                }`}
                placeholder={`Enter project link (optional)`}
              />
              {errors[index]?.link && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].link}
                </p>
              )}
            </div>
            <div className="mb-2">
              <textarea
                value={project.description}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                className={`w-full p-2 border rounded ${
                  errors[index]?.description ? "border-red-500" : ""
                }`}
                placeholder={`Enter project description ${index + 1}`}
              />
              {errors[index]?.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeProjectField(index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>No projects to display</p> // This message will appear if the projects array is empty or null
      )}
      <button
        type="button"
        onClick={addProjectField}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Project
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default ProjectDetailForm;
