import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {deleteVideo, getAllVideos, getVideoById, publishVideo, retrieveVideosFromDB, togglePublishStatus, updateVideo} from "../controllers/video.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes except /allvideos
router.use((req, res, next) => {
    const isPublicReadRoute =
      req.path === "/allvideos" ||
      (req.method === "GET" && /^\/[^/]+$/.test(req.path));

    if (isPublicReadRoute) {
      // If the request path is /allvideos, skip the middleware and move to the next handler
      next();
    } else {
      // For all other routes, apply verifyJWT middleware
      verifyJWT(req, res, next);
    }
  });

  
//secure routes due verifyJWT middleware
router.route("/")
    .get(getAllVideos)
    .post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),publishVideo);
    
    
router.route("/allvideos").get(retrieveVideosFromDB)


router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router
