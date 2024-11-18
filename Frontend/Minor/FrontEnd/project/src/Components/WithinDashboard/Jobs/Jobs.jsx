import React from "react";
import {
  useNavigate,
  Routes,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";


function Jobs() {
  const navigate = useNavigate();
  const location = useLocation();


  // Highlight the active category based on the current path
  const getCurrentCategory = () => {
    if (location.pathname.includes("applications")) return "Applications";
    if (location.pathname.includes("offers")) return "Offers";
    return "Opportunities";
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-primary-dark">
        Available Job Opportunities
      </h1>
      <div className="mb-8">
        <div className="flex space-x-2 overflow-scroll scrollbar-hide">
          <button
            onClick={() => navigate("/d/jobs/")}
            className={`py-2 px-4 rounded-full ${
              getCurrentCategory() === "Opportunities"
                ? "bg-primary-dark text-white"
                : "bg-gray-200 text-primary-dark"
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => navigate("/d/jobs/applications")}
            className={`py-2 px-4 rounded-full ${
              getCurrentCategory() === "Applications"
                ? "bg-primary-dark text-white"
                : "bg-gray-200 text-primary-dark"
            }`}
          >
            Applications
          </button>
          {/* <button
            onClick={() => navigate("/d/jobs/offers")}
            className={`py-2 px-4 rounded-full ${
              getCurrentCategory() === "Offers"
                ? "bg-primary-dark text-white"
                : "bg-gray-200 text-primary-dark"
            }`}
          >
            Offers
          </button> */}
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default Jobs;
