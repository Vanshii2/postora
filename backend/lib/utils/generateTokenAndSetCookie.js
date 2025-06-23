  import jwt from 'jsonwebtoken';
   
  
   const generateTokenAndSetCookie=(userId,res)=>{
    if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET is missing!");
}

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d' // Token will expire in 30 days
    })
    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
   //prevent XSS attacks cross-site scrinpting attacks
        sameSite:'strict', // Helps prevent CSRF attacks
        secure: process.env.NODE_ENV !== 'development' // Use secure cookies in production
 });//https
    
  } 
  export default generateTokenAndSetCookie;