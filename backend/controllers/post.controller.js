import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';
import { v2 as cloudinary } from 'cloudinary';
export const createPost= async(req,res)=>{
    try{
        const {text}= req.body;
        let {img}= req.body;
        const userId =  req.user._id.toString();

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        if(!text && !img){
            return res.status(400).json({error:"Post must have either text or image"});
        }
         if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url;
         }

        const newPost = new Post({
            user:userId,
            text,
            img
        })
        await newPost.save();
        res.status(201).json(newPost)

    }
    catch(error){
        res.status(500).json({error: "Internal server error while creating post"});
        console.log("Error creating post:", error);

    }
}
 export const deletePost = async (req, res) => {
    
    try{
        const post  = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"Post not found"});

        }
        if(post.user.toString()!== req.user._id.toString()){
            return res.status(403).json({error:"You are not authorized to delete this post"});
        }

         if(post.img){
            const imgId= post.img.split('/').pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
         }
          await Post.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Post deleted successfully"});


    }
    catch(error){
        console.log("Error deleting post:", error);
        res.status(500).json({error: "Internal server error while deleting post"});

    }}


export const commentOnPost = async (req, res) => {
  try{
    const {text}= req.body;
    const postId = req.params.id;
    const userId = req.user._id;
     if(!text){
        return res.status(400).json({error:"Comment text is required"});
     }
     const post = await Post.findById(postId);
     if(!post){
        return res.status(404).json({error:"Post not found"});
     }
      const comment = {user: userId,text};
       post.comments.push(comment);
       await post.save();
       res.status(201).json({message:"Comment added successfully", post});

  }
  catch(error){
    console.log("Error commenting on post:", error);
    res.status(500).json({error: "Internal server error while commenting on post"});

  }
     
 }

  export const likeUnlikePost = async(req,res)=>{
    try{
            const userId = req.user._id;
            const {id:postId} = req.params;

            const post = await Post.findById(postId);
            if(!post){
                return res.status(404).json({error:"Post not found"});
            }
             const userLikedPost = post.likes.includes(userId);
                if(userLikedPost){
                    // User has already liked the post, so we will unlike it
                    await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
                    await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});

                    const updatedLikes= post.likes.filter((id)=>id.toString()!==userId.toString())
                    return res.status(200).json({likes: updatedLikes, message:"Post unliked successfully"});
                    
           }
           else{
            //like post
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await post.save();

             const notification=  new Notification({
                from :userId,
                to: post.user,
                type:"like"


           })
            await notification.save();
            const updatedLikes = post.likes;
            return res.status(200).json({likes: updatedLikes, message:"Post liked successfully"})
        }
}
    catch(error){
        console.log("Error liking/unliking post:", error);
        res.status(500).json({error: "Internal server error while liking/unliking post"});
    }
  }

  export const getAllPosts = async(req,res)=>{
    try{
            const posts = await Post.find().sort({createdAt: -1}).populate({
                path: "user",
                select: "-password"
            })
            .populate({
               path: "comments.user",
                select: "-password" 
            })


            if(posts.length===0){
                return res.status(404).json({message:"No post found"})
                 
            }
            res.status(200).json(posts);

        
    }
    catch(error){
        console.log("Error getting all posts:", error);
        res.status(500).json({error: "Internal server error while getting all posts"});
    }
  }

  export const getLikedPost = async(req,res)=>{
    const userId = req.params.id;
    try{
        const user = await User.findById(userId)
        if(!user)
{
    return res.status(404).json({error:"User not found"});
      
}
       const  likedPosts= await Post.find({_id: {$in: user.likedPosts}})
       .populate({
        path:"user",
        select: "-password"
       });

        res.status(200).json(likedPosts);

   
   
    }
    catch(error){
        console.log("Error getting liked posts:", error);
        res.status(500).json({error: "Internal server error while getting liked posts"});
    }

  }
  export const getFollowingPosts = async(req,res)=>{
    try{
        
            const userId= req.user._id;
            const user = await User.findById(userId).populate('following');
            if(!user){
                return res.status(404).json({error:"User not found"});
            }
             const following = user.following;
             const feedPosts = await Post.find({user: {$in: following}})
                .sort({createdAt: -1})
                .populate({
                    path: "user",
                    select: "-password"
                })
                .populate({             
                    path: "comments.user",
                    select: "-password"
                });
                    res.status(200).json(feedPosts);
           

    }
    catch(error){
        console.log("Error getting following posts:",error);
        res.status(500).json({error:"Internal server error"})
    }
  }

  export const getUserPosts = async(req,res)=>{
    try{
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        const posts = await Post.find({user: user._id})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })      
            .populate({     
                path: "comments.user",
                select: "-password"
            }); 
            res.status(200).json(posts);
    }
    catch(error){
        console.log("Error getting user posts:", error);
        res.status(500).json({error: "Internal server error while getting user posts"});
    }
  }