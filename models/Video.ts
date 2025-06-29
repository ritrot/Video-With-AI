import mongoose , {Schema , model , models} from "mongoose";

export const VIDEO_DIMENTIONS = {
    width:1080,
    height:1920
}

export interface IVideo {
    _id?:mongoose.Types.ObjectId,
    title:string,
    description:string,
    videoUrl:string,
    thumbnailUrl:string,
    controles?:boolean,
    transformation?:{
        height:number,
        width:number,
        quality:number
    }
}

const VideoSchema = new Schema<IVideo> (
    {
        title:{type:String , required:true},
        description:{type:String , required:true},
        videoUrl:{type:String , required:true},
        thumbnailUrl:{type:String , required:true},
        controles:{type:Boolean , required:true},
        transformation:{
            height:{type:Number , default:VIDEO_DIMENTIONS.height},
            width:{type:Number , default:VIDEO_DIMENTIONS.width},
            quality:{type:Number , min:1 , max:100}
        }
    },
    {
        timestamps:true
    }
)

const Video = models?.Video || model<IVideo>("Video" , VideoSchema);

export default Video;