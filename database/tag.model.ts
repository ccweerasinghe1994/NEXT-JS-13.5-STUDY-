import type { Document, ObjectId } from "mongoose";
import { model, models, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  questions: ObjectId[];
  followers: ObjectId[];
  createdOn: Date;
}

const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const Tag = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
