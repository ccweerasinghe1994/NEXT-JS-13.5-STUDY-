"use server";

import { CreateAnswerParams, GetAnswersParams } from "@/lib/actions/shared";
import { connectToDatabase } from "@/lib/mogoose";
import { revalidatePath } from "next/cache";
import Answer, { IAnswer } from "@/database/answer.model";
import Question from "@/database/question.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  const { content, author, question, path } = params;
  try {
    await connectToDatabase();
    const newAnswer: IAnswer = await Answer.create({
      content,
      author,
      question,
    });
    // add answer to question
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    revalidatePath(path);
    return newAnswer;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAnswerByQuestionId = async (params: GetAnswersParams) => {
  const { questionId } = params;

  try {
    const answers = await Answer.find({
      question: questionId,
    })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId picture name",
      })
      .sort({
        createdAt: -1,
      });
    return {
      answers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
