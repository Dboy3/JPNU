import express from "express";
import { createGeneralDetails,addProject , getGeneralDetails } from "../controller/Profile.controller.js";
const router = express.Router();
router.post("/createdetails",createGeneralDetails);
router.post("/adProj",addProject);
router.get("/getdetails",getGeneralDetails);
export default router;