import express from 'express';
import { createPost, deletePost, getFeedPost, getPost, likeUnLikePost, replyToPost } from '../controllers/postController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);         
router.post("/create", protectRoute, createPost);       
router.put("/like/:id", protectRoute, likeUnLikePost); 
router.put("/reply/:id", protectRoute, replyToPost);   
router.delete("/:id", protectRoute, deletePost);        
router.get("/:id", getPost);                           





export default router;