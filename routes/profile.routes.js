import express from "express";
import { createGeneralDetails,addProject , getGeneralDetails , getProjectDetails , isprofileComplete} from "../controller/Profile.controller.js";
const router = express.Router();
router.post("/createdetails",createGeneralDetails);
router.post("/adProj",addProject);
router.get("/getdetails",getGeneralDetails);
router.get( "/getProj", getProjectDetails);
router.get("/isProf",isprofileComplete);
export default router;