import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    //member since lalala
    username:{type:String,required:true,unique:true},
    fullName:{type:String, required:true},
    password:{type:String,required:true,minlength:6},
    email:{type:String,required:true,unique:true},
    followers:[{type:mongoose.Schema.Types.ObjectId,//16 hcar 123 id
                ref:"User", 
                default:[]}],
    following:[{type:mongoose.Schema.Types.ObjectId,//16 hcar 123 id
                ref:"User", 
                default:[]}],//0 following
    profileImg:{type:String,default:""},
    coverImg:{type:String,default:""},
    bio:{type:String,default:""},
    link:{type:String,default:""},
    likedPosts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[]
        },
    ]


},{timestamps:true});
/*
lets bcrypt the password here
 UserSchema.pre("save",async function(next)=>{
    if(!this.isModified("password"))return next();
    this.password= bcrypt.hash(thisPassword,10)
    next();
 })

 //ab yha p password compare bhi kr dete h 
 userSchema.methods.isPasswordCorrct = async function(password){
   return await  bcrypt.compare(password,this.password)
    }
//JWT token generate krna 
 userSchema.methods.genrateAccessToken= function(){
 jwt.sign({
      _id: this._id,
      email= this.email,
      username= this.username,
      fullName = this.fullName// payload ka nam = database se arhi 
 },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn: pross.env.ACCESSS_TOKEN_EXPIRY
   }
    
 )
 }

  userSchema.methods.genrateRefereshToken= function(){
 jwt.sign({
      _id: this._id,
 },
   process.env.REFRESH_TOKEN_SECRET,
   {
    expiresIn: pross.env.REFRESH_TOKEN_EXPIRY
   }
    
 )
 }
*/

const User= mongoose.model('User',userSchema)

export default User;