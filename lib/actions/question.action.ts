"use server";

import { connectToDatabase } from "@/lib/mogoose";
import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";

type TCreateQuestion = {
  title: string;
  content: string;
  tags: string[];
  author: string;
  path: string;
};
export async function createQuestion(params: TCreateQuestion) {
  try {
    await connectToDatabase();
    const { title, content, tags, author } = params;
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
  } catch (error) {
    console.error(error);
    throw error;
  }
}
