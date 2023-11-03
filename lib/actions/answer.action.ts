"use server";

import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "@/lib/actions/shared";
import { connectToDatabase } from "@/lib/mogoose";
import { revalidatePath } from "next/cache";
import Answer, { IAnswer } from "@/database/answer.model";
import Question from "@/database/question.model";
import { throwError } from "@/lib/utils";
import Interaction from "@/database/interaction.model";

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

export const upVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDatabase();
    const { userId, path, answerId, hasUpVoted, hasDownVoted } = params;
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
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error("Answer not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDatabase();
    const { userId, path, answerId, hasUpVoted, hasDownVoted } = params;
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
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error("Answer not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    await connectToDatabase();
    const { answerId, path } = params;

    const answer: IAnswer | null = await Answer.findById(answerId);

    if (answer === null) {
      throwError("Answer not found");
      return;
    }

    await Answer.deleteOne({ _id: answerId });

    await Question.updateMany(
      { _id: answer.question },
      {
        $pull: { answers: answerId },
      },
    );

    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
