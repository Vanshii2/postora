import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import  generateTokenAndSetCookie  from "../lib/utils/generateTokenAndSetCookie.js";


export const signup =async(req,res)=>{
    console.log("Incoming data:", req.body);
    
    // Check if req.body exists
    // if (!req.body) {
    //     console.log("req.body is undefined");
    //     return res.status(400).json({
    //         error: "Request body is missing"
    //     });
    // }
    
   try{
        const {username,fullName,password,email} = req.body;
        
        // Validate required fields
        if (!username || !fullName || !password || !email) {
            console.log("Missing required fields:", { username, fullName, password: password ? "provided" : "missing", email });
            return res.status(400).json({
                error: "All fields are required: username, fullName, password, email"
            });
        }
        
        // Add more detailed logging
        // console.log("Checking for username:", username);
        // console.log("Checking for email:", email);
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                error: "Invalid email format"
            })
        }
        const existingUser = await User.findOne({username});
        console.log("Existing user found:", existingUser);
        if(existingUser){
            return res.status(400).json({
                error: "Username already exists"
            })
        }
        const existingEmail = await User.findOne({email});
        console.log("Existing email found:", existingEmail);
        if(existingEmail){
            return res.status(400).json({
                error: "Email already exists"
            })
        }
        if(password.length<6){
            return res.status(400).json({
                error: "Password must be at least 6 characters long"
            })
        }
        //now to hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt); 

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        })

        if(newUser){//agar new user successfully bna h 
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link,
                followers: newUser.followers,
                following: newUser.following,

            })
        }
        else
       { res.status(500).json({
            error: "User not created"
        });
    }
    
   }
   catch(error){
    console.log("Error in signup controller:", error);
    res.status(500).json({error:"Internal server error"});

   }

}

export const login =async(req,res)=>{
   try{
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                error: "Request body is missing"
            });
        }
        
        const {username,password}= req.body;
        
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }
        
        console.log("Login attempt for username:", username);
        
        const user= await User.findOne({username});
        
        if (!user) {
            return res.status(400).json({
                error: "Invalid username or password"
            });
        }
        
        console.log("User password field:", user.password);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if(!isPasswordCorrect){
            return res.status(400).json({
                error: "Invalid username or password"
            });
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg

        });

   }
   catch(error){
    console.log("Error in signup controller:", error);
    res.status(500).json({error:"Internal server error"});

   }

}


export const logout =async(req,res)=>{
    try{
            res.cookie("jwt","",{maxAge:0})
            res.status(200).json({message:"Logged out successfully"})
    }catch(error){
        console.log("error in logout controller",error.message);
        res.status(500).json({error:"Internal server error"});
    }

}

export const getMe=async(req,res)=>{
    try{
            const user = await User.findById(req.user._id).select("-password");
            res.status(200).json(user);
    }
    catch(error){
        console.log("error in getMe controller",error.message);
        res.status(500).json({error:"Internal server error"});

    }
}