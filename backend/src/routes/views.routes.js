import { Router } from "express";
import {views} from "../controllers/views.controller.js";


const router = Router();

router.route("/:videoId").post(views)

export default router