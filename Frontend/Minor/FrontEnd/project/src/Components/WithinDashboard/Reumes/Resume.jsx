import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Pages/auth";

const Resume = () => {
  const [resumeData, setResumeData] = useState(null);
  const [projects, setProjects] = useState([]);
  const resumeRef = useRef();
  const user = useSelector(selectUser);

  // Fetch resume details from API
  useEffect(() => {
    // Fetch data from getdetails API
    const fetchDetails = async () => {
      const response = await fetch(
        "http://localhost:8000/api/profile/getdetails",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setResumeData(data.data);
      console.log( "resumeData ", resumeData);
    };

    // Fetch data from getProj API
    const fetchProjects = async () => {
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
      setProjects(data.data);
      console.log("projects " , projects);
    };

    fetchDetails();
    fetchProjects();
  }, []);

  // Function to download PDF
  const downloadPDF = () => {
    const input = resumeRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    });
  };

  // If data is not yet fetched, show loading
  if (!resumeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Resume</h1>
        <button
          className="bg-primary-dark text-white py-2 px-4 rounded hover:bg-primary-darker"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>
      <div ref={resumeRef} className="mt-6 p-6 shadow-lg bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black">
            {resumeData.firstName} {resumeData.middleName} {resumeData.lastName}
          </h1>
          <div className="text-black mt-2">
            {resumeData.githubLink && (
              <a
                href={resumeData.githubLink}
                className="text-primary-dark hover:underline"
              >
                {resumeData.githubLink}
              </a>
            )}
            {resumeData.contactNumber && <p>{resumeData.contactNumber}</p>}
            {resumeData.email && <p>{resumeData.email}</p>}
          </div>
          {resumeData.intro && (
            <p className="mt-4 text-black">{resumeData.intro}</p>
          )}
        </div>

        <hr className="my-4 border-black" />

        {/* Skills Section */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-black">Skills</h2>
            <ul className="flex flex-wrap gap-4 mt-2">
              {resumeData.skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-primary-lighter text-primary-darkest px-3 py-1 rounded"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr className="my-4 border-black" />

        {/* Education Section */}
        {resumeData.course && (
          <div>
            <h2 className="text-2xl font-semibold text-black">
              Academic Details
            </h2>
            <div className="mt-2 text-black">
              {resumeData.course && <p>{resumeData.course}</p>}
              {resumeData.rollNo && <p>Roll No: {resumeData.rollNo}</p>}
            </div>
          </div>
        )}

        <hr className="my-4 border-black" />

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-black">Projects</h2>
            {projects.map((project, index) => (
              <div key={index} className="mt-2 text-black">
                <h3 className="font-semibold">{project.title}</h3>
                <a
                  href={project.link}
                  className="text-primary-dark hover:underline"
                >
                  {project.link || "No link provided"}
                </a>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        )}

        <hr className="my-4 border-black" />

        {/* Achievements Section */}
        {resumeData.achievements && resumeData.achievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-black">Achievements</h2>
            <ul className="list-disc ml-6 mt-2 text-black">
              {resumeData.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
