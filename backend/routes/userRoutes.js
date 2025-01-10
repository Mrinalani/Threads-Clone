import express from 'express';
import { followUnFollowuser, getUserProfile, loginUser, logoutUser, signupUser, updateuser } from '../controllers/userController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile)
router.post('/signup',signupUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.post('/follow/:id', protectRoute, followUnFollowuser)
router.post('/update/:id', protectRoute, updateuser)




export default router;