import { model, models, ObjectId, Schema } from "mongoose";

export interface IInteraction extends Document {
  user: ObjectId;
  action: string;
  question: ObjectId;
  answer: ObjectId;
  tags: ObjectId[];
  createdAt: Date;
}

const interactionSchema = new Schema<IInteraction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Interaction =
  models.Interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;
