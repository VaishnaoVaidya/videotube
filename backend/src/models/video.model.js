import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,  //cloudniary url
            require: true,
        },
        thumbnail: {
            type: String,          //cloudniary url
            require: true,
        },
        title: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            // require: true,
        },
        duration: {
            type: Number,      //cloudniary url
            // required: true,
        },
        views: {
            type: Number,      //cloudniary url
            default: 0,
        },
        isPublished: {
            type: Boolean,      //cloudniary url
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {
        timestamps: true,
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)