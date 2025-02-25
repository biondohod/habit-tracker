// filepath: /c:/Programming/habit-tracker/backend/models/Post.ts
import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
  title: string;
  text: string;
}

const postSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model < IPost > ("Post", postSchema);

export default Post;