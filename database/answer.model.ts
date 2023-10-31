import type { Document, ObjectId } from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IAnswer extends Document {
  author: ObjectId;
  question: ObjectId;
  content: string;
  upvotes: ObjectId[];
  downvotes: ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  upvotes: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  downvotes: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const Question = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Question;
