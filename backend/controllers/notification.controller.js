import Notification from "../models/notification.model.js";

export const getnotifications = async(req,res)=>{
    try{
        const  userId = req.user._id; 
        const notifications = await Notification.find({to:userId}).populate({
            "path": "from",
            select : "username profileImg"

        })

         await Notification.updateMany({to: userId},{read:true});
        res.status(200).json(notifications);

    }
    catch(error){
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deletenotifications = async(req,res)=>{
    try{
         const userID= req.user._id;
         await Notification.deleteMany({to:userID});
            res.status(200).json({ message: "Notifications deleted successfully" });

    }
    catch(error){
        console.error("Error deleting notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// export const deletenotification = async(req,res)=>{
//     try{
//         const notificationId = req.params.id;
//         const userId = req.user._id;
//         const notification =  await Notification.findById(notificationId)
//         if(!notification){
//             return res.status(404).json({ message: "Notification not found" });
//         }
        

//         if(notification.to.toString()!== userId.toString())
//             return res.status(403).json({ message: "You are not authorized to delete this notification" });

//         await Notification.findByIdAndDelete(notificationId);

//         res.status(200).json({ message: "Notification deleted successfully" });

//     }
//     catch(error){
//         console.error("Error deleting Notification")
//         res.status(500).json({message:"Internal server error"});
//     }
// }