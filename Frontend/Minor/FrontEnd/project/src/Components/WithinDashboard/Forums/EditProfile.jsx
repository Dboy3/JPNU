import { useNavigate, Outlet, useLocation } from "react-router-dom";

const Editprofile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current section from the URL
  const pathSections = location.pathname.split("/").filter(Boolean);
  console.log(pathSections);
  const currentSection = pathSections[pathSections.length - 1] || "general";

  const handleSectionChange = (section) => {
    if (section === "general") {
      navigate("/d/editprofile");
    } else {
      navigate(`/d/editprofile/${section}`);
    }
  };

  const handleGenerateResume = () => {
    console.log("btn is clicked");
    navigate("/d/resumes")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex">
        {/* Left Section: Navigation */}
        <div className="w-1/5 bg-primary-lightest rounded-lg text-white p-4">
          {/* <h2 className="text-xl font-bold mb-4">Job Management Portal</h2> */}
          <nav className="space-y-3">
            {["general", "experience", "projects"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                    currentSection === section
                      ? "bg-primary-lighter text-black"
                      : "bg-gray hover:bg-primary-lightest"
                  }`}
                >
                  {capitalizeFirstLetter(section) } Details
                </button>
              )
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-4/5 p-6 bg-gray-100 flex flex-col">
          {/* Navigation Bar Above Outlet */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 shadow rounded">
            <h2 className="text-2xl font-semibold">
              {capitalizeFirstLetter(currentSection)} Details
              {console.log(currentSection)}
            </h2>
            <button className="bg-primary-dark text-white py-2 px-4 rounded-lg"
            onClick={handleGenerateResume}>
              Generate Resume
            </button>
          </div>

          {/* Right Section: Dynamic Form */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to capitalize the first letter of a section
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Editprofile;
