import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ProjectDetailForm = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    teamSize: "",
    techStack: [],
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    link: "",
    teamSize: "",
  });

  // Fetch projects on load
  useEffect(() => {
    // fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddProject = () => {
    console.log(formData);
    setCurrentProject(null);
    setFormData({
      title: "",
      link: "",
      teamSize: "",
      techStack: [],
      description: "",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      link: project.link,
      teamSize: project.teamSize,
      techStack: project.techStack.join(", "),
      description: project.description,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDeleteProject = async (id) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Project title is required.";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Project description is required.";
    }

    // Tech Stack validation
    if (!formData.techStack.trim()) {
      errors.techStack = "Tech stack is required.";
    }

    // Link validation (optional but valid if provided)
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (formData.link && !urlRegex.test(formData.link)) {
      errors.link = "Please enter a valid URL.";
    }

    // Team size validation (optional)
    if (
      formData.teamSize &&
      (formData.teamSize < 0 || formData.teamSize > 40)
    ) {
      errors.teamSize = "Team size must be between 0 and 40.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const { title, link, teamSize, mentor, techStack, description } = formData;
    const projectData = {
      title,
      link,
      teamSize,
      mentor,
      techStack: techStack.split(",").map((tech) => tech.trim()),
      description,
    };

    try {
      if (currentProject) {
        // Update project
        // const response = await fetch(`/api/projects/${currentProject.id}`, {
        //   method: "PUT",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(projectData),
        //   credentials : "include"
        // });
        const updatedProject = await response.json();
        setProjects(
          projects.map((proj) =>
            proj.id === currentProject.id ? updatedProject : proj
          )
        );
      } else {
        // Add new project
        console.log(newProject);
        // const response = await fetch("/api/projects", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(projectData),
        //   credentials : "include"
        // });
        const newProject = await response.json();
        setProjects([...projects, newProject]);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleAddProject}
        >
          + Add New
        </button>
      </div>

      {projects.length === 0 ? (
        <p>No projects available. Add one using the button above.</p>
      ) : (
        <div className="grid gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 border rounded-lg shadow-md bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <a
                    href={project.link}
                    className="text-blue-500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.link}
                  </a>
                  <p className="text-gray-500">{project.dates}</p>
                  <p>
                    <strong>Team Size:</strong> {project.teamSize} |{" "}
                    <strong>Mentor:</strong> {project.mentor}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-sm px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4">{project.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl mb-4">
              {currentProject ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Project Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter the project title"
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm">{formErrors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Project Link
                </label>
                <input
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  type="url"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter the project URL"
                />
                {formErrors.link && (
                  <p className="text-red-500 text-sm">{formErrors.link}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Team Size
                </label>
                <input
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  type="number"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter team size (between 0 and 40)"
                />
                {formErrors.teamSize && (
                  <p className="text-red-500 text-sm">{formErrors.teamSize}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Tech Stack (comma separated)
                </label>
                <input
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  type="text"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter the tech stack used"
                />
                {formErrors.techStack && (
                  <p className="text-red-500 text-sm">{formErrors.techStack}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter a brief description of the project (around 200 words)"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded"
                >
                  {currentProject ? "Update Project" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailForm;
