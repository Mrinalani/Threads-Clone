import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generatrTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "user alredy exist" });
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
        });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in signup user", error.message);
  }
};

export const loginUser = async(req,res) => {
try {
    const  {username, password} = req.body;
    const user = await User.findOne({username});

    const isPasswordcorrect = await bcrypt.compare(password, user?.password || "") ;

    if(!user || !isPasswordcorrect){
       return res.status(400).json({ message: "Invalid username or password"});
    }
    generatrTokenAndSetCookies(user._id, res)

    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
     });

} catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in login user", error.message);
}

}

export const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    console.log("error in logout user", error.message);
    }
}

export const followUnFollowuser = async(req, res) => {
   try {
    const {id} = req.params;

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id)

    if(id === req.user._id.toString()) return res.status(400).json({message: "you cannot follow or unfollow yourself"});

    if(!userToModify || !currentUser) return res.status(400).json({message: "User not found"});

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
    res.status(500).json({ message: error.message });
    console.log("error in follow unfollow user", error.message);
   }
}

export const updateuser = async(req, res) => {
    try {
      const {name, email, username, password, profilePic, bio} = req.body;
      const userId = req.user._id;
     
      console.log(userId.toString())
      console.log(req.params.id)

      let user = await User.findById(userId);

      if(!user){
      return res.status(400).json({ message: "User not found" });
      }

      if(req.params.id !== userId.toString()){
        return res.status(400).json({message: "You cannot update other users profile"})
      }

      if(password){
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        user.password = hashedpassword
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.username = username || user.username;
      user.profilePic = profilePic || user.profilePic;
      user.bio = bio || user.bio;

      user = await user.save();

      return res.status(200).json({message: "Profile Updated Successfully", user})

    } catch (error) {
      res.status(500).json({ message: error.message });
    console.log("error in update  user", error.message);
    }
}

export const getUserProfile = async(req, res) => {
  try {
    const {username} = req.params;

    const user = await User.findOne({username}).select("-password").select("-updatedAt");

    if(!user){
      return res.status(400).json({message: "User not found"})
    }

    return res.status(200).json({user})

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in getUserProfile  user", error.message);
  }
}


