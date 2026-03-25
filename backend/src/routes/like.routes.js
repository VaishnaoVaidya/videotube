import { Router } from 'express';
import {
    toggleTweetLike,
    getTweetLikes,
    getVideoLikes,
    toggleVideoLikeDislike,
    toggleCommentLikeDislike,
    getAllCommentLikes,
    getLikedVideos,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


router.route("/toggle/video/:videoId").post(toggleVideoLikeDislike);
router.route("/toggle/comment/:commentId").post(toggleCommentLikeDislike);
router.route("/toggle/tld/:tweetId").post(toggleTweetLike);
router.route('/video/:videoId').get(getVideoLikes);


// router.route('/comment/:commentId').get(getAllCommentLikes);
router.route('/comments').get(getAllCommentLikes);

router.route('/tweet/:tweetId').get(getTweetLikes);

router.route('/likedVideos/:userId').get(getLikedVideos);

export default router