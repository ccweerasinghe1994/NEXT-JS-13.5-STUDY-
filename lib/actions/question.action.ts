"use server";

import { connectToDatabase } from "@/lib/mogoose";
import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import {
  GetQuestionByIdParams,
  ICreateQuestionParams,
  IGetQuestionsParams,
  QuestionVoteParams,
} from "@/lib/actions/shared";
import User, { IUser } from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";

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

export const getQuestionById = async (
  params: GetQuestionByIdParams,
): Promise<{
  question: {
    _id: ObjectId;
    views: number;
    title: string;
    upvotes: any;
    downvotes: any;
    author: IUser;
    tags: ITag[];
    answers: any;
    createdAt: Date;
    content: string;
  };
}> => {
  const { questionId } = params;
  try {
    await connectToDatabase();
    const result = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id name picture clerkId",
      });
    return { question: result };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDatabase();
    const { questionId, path, hasUpVoted, hasDownVoted, userId } = params;
    let updateQuery: any = {};
    if (hasUpVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDatabase();
    const { questionId, path, hasUpVoted, hasDownVoted, userId } = params;
    let updateQuery: any = {};
    if (hasDownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
