import express from 'express';
import { followUnFollowuser, freezAccount, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateuser } from '../controllers/userController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/profile/:query', getUserProfile)
router.get('/suggested',protectRoute, getSuggestedUsers)
router.post('/signup',signupUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.post('/follow/:id', protectRoute, followUnFollowuser)
router.put('/update/:id', protectRoute, updateuser)
router.put('/freez', protectRoute, freezAccount)





export default router;