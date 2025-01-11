import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async(req,res) => {
    try {
        const {postedBy, text, img} = req.body;

        if(!text || !postedBy) {
        return res.status(400).json({ message: "postedBy and text field is required" });
        }

        const user = await User.findById(postedBy);

        if(!user){
        return res.status(404).json({ message: "User not found" });
        }
        if(user._id.toString() !== req.user._id.toString()){
        return res.status(401).json({ message: "Unauthorized to create post" });  
        }

        if(text.length > 500){
        return res.status(400).json({ message: "Text must be less than 500 characters"});
        }

        const newPost = new Post({
            postedBy,
            text,
            img
        })

        await newPost.save()
        return res.status(201).json({ message: "post created successfully", newPost});
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in create post", error.message);
    }
}

export const getPost = async(req,res) => {
try {
    const {id} = req.params;
    const post = await Post.findById(id);

    if(!post){
    res.status(404).json({ message: "Post not Found" });
    }

    res.status(200).json({ message: "Post found", post });

} catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in get post", error.message);
}
}

export const deletePost = async(req,res) => {
    try {
        const {id} = req.params;

        const post = await Post.findById(id);

        if(!post){
        return res.status(404).json({ message: "Post not found" });
        }

        if(post.postedBy.toString() !== req.user._id.toString()){
        return res.status(401).json({ message: "Unauthorized to delete post" });  
        }

        await Post.findByIdAndDelete(id)

        return res.status(200).json({ message: "Post deleted successfully" });  

    } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in delete post", error.message);
    }
}