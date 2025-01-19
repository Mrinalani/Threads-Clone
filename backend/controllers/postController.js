import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as Cloudinary} from 'cloudinary'

export const createPost = async (req, res) => {
  try {
    
    const { postedBy, text } = req.body;
    console.log(postedBy, text)
    let {img} = req.body

    if (!text || !postedBy) {
      return res
        .status(400)
        .json({ error: "postedBy and text field is required" });
    }

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    if (text.length > 500) {
      return res
        .status(400)
        .json({ error: "Text must be less than 500 characters" });
    }

    if(img){
      const uploadedResponse = await Cloudinary.uploader.upload(img)
      img = uploadedResponse.secure_url
    }

    const newPost = new Post({
      postedBy,
      text,
      img,
    });

    await newPost.save();
    return res
      .status(201)
      .json({ message: "post created successfully", newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in create post", error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ error: "Post not Found" });
    }

    res.status(200).json({ message: "Post found", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in get post", error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in delete post", error.message);
  }
};

export const likeUnLikePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    const user_id = req.user._id;

    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }

    console.log(post);
    const isLiked = post.likes.includes(user_id);

    if (isLiked) {
      await Post.updateOne({ _id: id }, { $pull: { likes: user_id } });
      res.status(200).json({ message: "Post UnLiked successfully" });
    } else {
      await Post.updateOne({ _id: id }, { $push: { likes: user_id } });
      res.status(200).json({ message: "Post Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in like post", error.message);
  }
};

export const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post Not Found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    return res.status(200).json({ message: "Reply added successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in reply to post", error.message);
  }
};

export const getFeedPost = async(req,res) => {
    try {
        console.log("hello")

        const userId = req.user._id;
        console.log(userId)

        const user = await User.findById(userId)
        console.log(user)


        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
          }

          const following = user.following;
          console.log(following)


          const feedPost = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1});
          console.log(feedPost)


          return res.status(200).json((feedPost))
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    console.log("error in feed post", error.message);
    }
}


