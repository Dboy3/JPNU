import "./App.css";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Home from "./Components/WithinDashboard/Home/Home";
import Jobs from "./Components/WithinDashboard/Jobs/Jobs";
import Resume from "./Components/WithinDashboard/Reumes/Resume";
import Editprofile from "./Components/WithinDashboard/Forums/EditProfile";
import Opportunites from "./Components/WithinDashboard/Jobs/JobCategories/Opportunites";
import Application from "./Components/WithinDashboard/Jobs/JobCategories/Application";
import Offers from "./Components/WithinDashboard/Jobs/JobCategories/Offers";
import JD from "./Components/WithinDashboard/Jobs/JobDescription/JD";
import AcademicDetailsForm from "./Components/WithinDashboard/Forums/Forms/AcademicDetailsForm";
import GeneralDetailsForm from "./Components/WithinDashboard/Forums/Forms/GeneralDetailsForm";
import ExperienceDetailFrom from "./Components/WithinDashboard/Forums/Forms/ExperienceDetailFrom";
import ProjectDetialForm from "./Components/WithinDashboard/Forums/Forms/ProjectDetailForm";
import AdminLayout from "./Components/AdminDashboard/Layout/AdminLayout";
import JobPost from "./Components/AdminDashboard/JobPost/JobPost";
import SPCLayout from "./Components/SPC/SPCLayout";
import StudentList from "./Components/AdminDashboard/StudentList/StudentList";
import ExpenseList from "./Components/AdminDashboard/ExpenseList/ExpenseList";
import AddNotifications from "./Components/AdminDashboard/AddNotification/AddNotifications";
import PlacedStudents from "./Components/AdminDashboard/PlacedStudent/PlacedStduent";

import { selectUser } from "./Pages/auth";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector(selectUser);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {!user ? (
          // Redirect to login page if user is null
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : user.role === "Admin" ? (
          // Routes accessible to admin role
          <Route path="/" element={<AdminLayout />}>
            <Route path="" element={<JobPost />} />
            <Route path="studentlist" element={<StudentList />} />
            <Route path="expenselist" element={<ExpenseList />} />
            <Route path="notification" element={<AddNotifications />} />
            <Route path="placedstudents" element={<PlacedStudents />} />
          </Route>
        ) : user.role === "Student" ? (
          // Routes accessible to student role
          <Route path="" element={<Dashboard />}>
            <Route path="/" element={<Home />} />
            <Route path="/d/jobs" element={<Jobs />}>
              <Route path="" element={<Opportunites />} />
              <Route path="applications" element={<Application />} />
              <Route path="offers" element={<Offers />} />
              <Route path=":id" element={<JD />} />
            </Route>
            <Route path="/d/resumes" element={<Resume />} />
            <Route path="/d/editprofile" element={<Editprofile />}>
              <Route path="" element={<GeneralDetailsForm />} />
              <Route path="academic" element={<AcademicDetailsForm />} />
              <Route path="experience" element={<ExperienceDetailFrom />} />
              <Route path="projects" element={<ProjectDetialForm />} />
            </Route>
          </Route>
        ) : user.role === "SPC" ? (
          <Route path="/" element={<SPCLayout />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
