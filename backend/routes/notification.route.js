import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getnotifications, deletenotifications } from '../controllers/notification.controller.js';

const router = express.Router();
router.get("/",protectRoute,getnotifications)
router.delete("/",protectRoute,deletenotifications)
// router.delete("/:id",protectRoute,deletenotification)

export default router;
