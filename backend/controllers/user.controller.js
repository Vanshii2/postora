import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';
import Notification from '../models/notification.model.js';


export  const getUserProfile= async(req,res)=>{
    const {username}= req.params;
    try{
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({error:error.message});
        }
      res.status(200).json(user);
    }
    catch(error){
        console.error("Error fetching user profile:", error.message );
        res.status(500).json({error:error.message});
        
    }
}

    export const followUnfollowUser= async(req,res)=>{
        try{
                const {id}= req.params;
                const userToModify = await User.findById(id);
                const currentUser = await User.findById(req.user._id);
                
                if(id===req.user._id.toString()){
                    return res.status(400).json({error:"You cannot follow/unfollow yourself"});
                }

                if(!userToModify|| !currentUser){
                    return res.status(404).json({error:"User not found"});
                }

                const isFollowing = currentUser.following.includes(id);

                 if(isFollowing){
                     await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
                     await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
                     // Unfollow the user--> return the id of the user as a response is not needed
                     res.status(200).json({message:"Unfollowed successfully"});


                 }else{
                    // Follow the user
                   await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
                   await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
                   res.status(200).json({message:"Followed successfully"});
                    //send notification to user 
                    const newNotification= new Notification({
                        type:"follow",
                        from: req.user._id, 
                        to: userToModify._id
                    })

                    await newNotification.save();
                    //todo return the id of user followed


                 
                 }

        }
        catch(error){
            console.error("Error following/unfollowing user:", error.message);
            res.status(500).json({error:error.message});
        }
    }
    export const getSuggestedUsers = async (req, res) => {
        try {
             const userId = req.user._id;
            // Fetch users who are not the current user and not already followed
            const usersFollowedByMe = await User.findById(userId).select("following");
            const users = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: userId }, // Exclude the current user

                    }
                },
                {
                    $sample: { size: 10 } // Randomly select 10 users
                }
            ]);
            const filteredUsers = users.filter((user)=> !usersFollowedByMe.following.includes(user._id))
            const suggestedUsers = filteredUsers.slice(0,4);

            suggestedUsers.forEach((user) => (user.password=null));

            res.status(200).json(suggestedUsers);
        } catch (error) {
            console.error("Error fetching suggested users:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
    export const updateUser = async (req, res) => {
        const {fullName, email, username ,currentPassword, newPassword,bio,link} = req.body;
        let {profileImg, coverImg} = req.body;
        const userId = req.user._id;

        try{
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({error:"User not found"});
            }
            // Check if the current password is correct
            if((!newPassword && currentPassword) || (newPassword && !currentPassword)){
                return res.status(400).json({error:"Both current and new passwords are required"});
            }
            if(currentPassword && newPassword){
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if(!isMatch){
                    return res.status(400).json({error:"Current password is incorrect"});
                }
                if(newPassword.length<6){
                    return res.status(400).json({error:"New password must be at least 6 characters long"});
                }
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword,salt);

            }
            if(profileImg){
                if(user.profileImg){
                    await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
                }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url;
            }
            if(coverImg){

                 if(user.coverImg){
                    await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
                }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url;
            }
            user.fullName= fullName|| user.fullName
            user.email = email|| user.email;
            user.username = username|| user.username;
            user.profileImg = profileImg || user.profileImg;
            user.coverImg = coverImg || user.coverImg;
            user.bio = bio || user.bio;
            user.link = link || user.link;
            await user.save();
            //pass should be nulll
             user.password = null;
            return res.status(200).json({message:"User updated successfully", user});
        }
        catch(error){

        }
    }
