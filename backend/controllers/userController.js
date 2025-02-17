import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generatrTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import {v2 as cloudinary} from 'cloudinary'
import mongoose from "mongoose";
import Post from "../models/postModel.js";


export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "user alredy exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedpassword,
    });

    await newUser.save();

    if (newUser) {
      generatrTokenAndSetCookies(newUser._id, res);
      return res
        .status(201)
        .json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          bio: newUser.bio,
          profilePic: newUser.profilePic
        });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in signup user", error.message);
  }
};

export const loginUser = async(req,res) => {
try {
    const  {username, password} = req.body;
    const user = await User.findOne({username});

    const isPasswordcorrect = await bcrypt.compare(password, user?.password || "") ;

    if(!user || !isPasswordcorrect){
       return res.status(400).json({ error: "Invalid username or password"});
    }
    if(user.isFrozen){
      user.isFrozen = false;
    }
    await user.save();
    generatrTokenAndSetCookies(user._id, res)

    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic
     });

} catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in login user", error.message);
}

}

export const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    console.log("error in logout user", error.message);
    }
}

export const followUnFollowuser = async(req, res) => {
   try {
    const {id} = req.params;

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id)

    if(id === req.user._id.toString()) return res.status(400).json({error: "you cannot follow or unfollow yourself"});

    if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"});

    const isFollowing = currentUser.following.includes(id);

    if(isFollowing){
       await User.findByIdAndUpdate(req.user._id, { $pull: {following: id}});
       await User.findByIdAndUpdate(id, {$pull:{followers:req.user._id}})
       return res.status(200).json({message: "User unfollowed successfully"})
    }else{
      await User.findByIdAndUpdate(req.user._id, { $push: {following: id}});
      await User.findByIdAndUpdate(id, {$push:{followers:req.user._id}})
      return res.status(200).json({message: "User followed successfully"})
    }
   } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in follow unfollow user", error.message);
   }
}

export const updateuser = async(req, res) => {
    try {
      const {name, email, username, password, bio} = req.body;
      let {profilePic} = req.body
      const userId = req.user._id;
     
      let user = await User.findById(userId);

      if(!user){
      return res.status(400).json({ error: "User not found" });
      }

      if(req.params.id !== userId.toString()){
        return res.status(400).json({error: "You cannot update other users profile"})
      }

      if(password){
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        user.password = hashedpassword
      }

      if(profilePic){
        if(user.profilePic){
          await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
        }
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        profilePic = uploadedResponse.secure_url
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.username = username || user.username;
      user.profilePic = profilePic || user.profilePic;
      user.bio = bio || user.bio;

      user = await user.save();
// find all posts that this user replied and update username ans userprofilepic fields
      await Post.updateMany(
        {"replies.user_id": userId},
        {
          $set:{
            "replies.$[reply].username": user.username,
            "replies.$[reply].userProfilePic": user.profilePic
          }
        },
        {arrayFilters:[{"reply.userId": userId}]}
      )

      user.password = null;
      return res.status(200).json(user)

    } catch (error) {
      res.status(500).json({ error: error.message });
    console.log("error in update  user", error.message);
    }
}

export const getUserProfile = async(req, res) => {
  try {
    const {query} = req.params;
    let user;
    if(mongoose.Types.ObjectId.isValid(query)){
      user = await User.findOne({_id: query}).select("-password").select("-updatedAt");
    }else{
      user = await User.findOne({username: query}).select("-password").select("-updatedAt");
    }
    if(!user){
      return res.status(400).json({error: "User not found"})
    }

    return res.status(200).json(user)

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in getUserProfile  user", error.message);
  }
}

export const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));
		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
    console.log(error)
	}
};

export const freezAccount = async(req, res) => {
 try {
  const user = await User.findById(req.user._id);
  if(!user){
    return res.status(400).json({error: "User not found"});
  }
  user.isFrozen = true;

  await user.save();
  return res.status(200).json({success: true});

 } catch (error) {
  res.status(500).json({ error: error.message });
    console.log(error)
 }
}



