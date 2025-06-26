import express from 'express';
import {getUserPosts,getFollowingPosts,getLikedPost,getAllPosts,createPost,deletePost,commentOnPost,likeUnlikePost } from '../controllers/post.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getFollowingPosts)
router.get("/likes/:id",protectRoute,getLikedPost) 
router.get("/user/:username",protectRoute,getUserPosts) 
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,commentOnPost)
router.delete("/:id",protectRoute,deletePost)


export default router