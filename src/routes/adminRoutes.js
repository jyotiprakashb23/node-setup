import { Router } from "express";

import { createAdmin, getAllUsers,getAdmin, refreshAccessToken } from "../controllers/adminController.js";
import { deleteAdmin } from "../controllers/adminController.js";
import { adminLogin } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
const adminRouter = Router();

adminRouter.get("/", (req, res) => {
    res.json({
        message: "Welcome to Admin section.",
    });
});

adminRouter.get("/getallusers", verifyAdmin, getAllUsers);
adminRouter.post("/createadmin",verifyAdmin, createAdmin);
adminRouter.delete("/deleteadmin/:id",verifyAdmin, deleteAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/getadmin/:id", getAdmin);
adminRouter.post("/refreshtoken", refreshAccessToken);

export default adminRouter;