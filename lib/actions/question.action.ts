"use server";

import { connectToDatabase } from "@/lib/mogoose";
import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import {
  ICreateQuestionParams,
  IGetQuestionsParams,
} from "@/lib/actions/shared";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function createQuestion(params: ICreateQuestionParams) {
  try {
    await connectToDatabase();
    const { title, content, tags, author, path } = params;
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments: ITag[] = [];
    //   create the tag document if it doesn't exist or get the existing one
    for (const tag of tags) {
      const existingTag: ITag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        {
          $setOnInsert: {
            name: tag,
          },
          $push: {
            questions: question._id,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );
      tagDocuments.push(existingTag);
    }
    //   let's update the question with the tags
    await Question.findByIdAndUpdate(question._id, {
      $push: {
        tags: { $each: tagDocuments },
      },
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getQuestions(params: IGetQuestionsParams) {
  try {
    await connectToDatabase();
    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort({ createdAt: -1 });
    return { questions };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
