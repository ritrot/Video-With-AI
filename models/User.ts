import mongoose , {Schema , model , models} from "mongoose";
import bcrypt from "bcryptjs";

interface UserI  {
    email:string,
    password:string,
    createdAt:Date,
    updatedAt:Date,
    _id:mongoose.Types.ObjectId
}

const userSchema = new Schema<UserI>(
    {
        email:{type:String , required:true , unique:true},
        password:{type:String , required:true }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save" , async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10);
    }
    next();
})

const User = models?.User || model<UserI>("User" , userSchema);

export default User;
