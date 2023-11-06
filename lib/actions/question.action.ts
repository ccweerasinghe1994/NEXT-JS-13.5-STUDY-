"use server";

import { connectToDatabase } from "@/lib/mogoose";
import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import {
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  ICreateQuestionParams,
  IGetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "@/lib/actions/shared";
import User, { IUser } from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { FilterQuery, ObjectId } from "mongoose";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { throwError } from "@/lib/utils";
import { TFilterValueType } from "@/types/types";

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

    // give five points to the user who asked the question

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });
    await User.findByIdAndUpdate(author, {
      $inc: {
        reputation: 5,
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

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const query: FilterQuery<typeof Question> = {};
    const skipAmount = (page - 1) * pageSize;
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    const typedFilter = filter as TFilterValueType;
    switch (typedFilter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "recommended":
        sortOptions = { views: -1 };
        break;
      case "frequent":
        sortOptions = { answers: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort(sortOptions)
      .limit(pageSize)
      .skip(skipAmount);
    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;
    return { questions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type TGetQuestionsByTagParams = {
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
};
export const getQuestionById = async (
  params: GetQuestionByIdParams,
): Promise<TGetQuestionsByTagParams> => {
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

    // increment user reputation by +1 or -1 depending on the action
    const incrementBy = hasUpVoted ? -1 : 1;
    await User.findByIdAndUpdate(userId, {
      $inc: {
        reputation: incrementBy,
      },
    });
    // increment author reputation by +10 or -10 depending on the action
    await User.findOneAndUpdate(question.author, {
      $inc: {
        reputation: incrementBy * 10,
      },
    });

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
    const incrementBy = hasDownVoted ? -1 : 1;
    await User.findByIdAndUpdate(userId, {
      $inc: {
        reputation: incrementBy,
      },
    });
    // increment author reputation by +10 or -10 depending on the action
    await User.findOneAndUpdate(question.author, {
      $inc: {
        reputation: incrementBy * 10,
      },
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    await connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    // delete answers associated with the question
    await Answer.deleteMany({ question: questionId });

    await Interaction.deleteMany({ question: questionId });

    await Tag.updateMany(
      {
        questions: questionId,
      },
      {
        $pull: {
          questions: questionId,
        },
      },
    );
    revalidatePath(path);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const editQuestion = async (params: EditQuestionParams) => {
  try {
    await connectToDatabase();
    const { title, content, questionId, path } = params;
    const question = await Question.findById(questionId);

    if (!question) {
      throwError("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getHotQuestions = async () => {
  try {
    await connectToDatabase();

    const questions = await Question.find({})
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);
    return questions as IQuestion[];
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getRecentQuestions = async (params: RecommendedParams) => {
  try {
    await connectToDatabase();
    const { userId, pageSize = 10, page = 1, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throwError("User not found");
    }

    const skipAmount = (page - 1) * pageSize;
    // find the user interaction
    const interaction = await Interaction.find({
      user: user._id,
    })
      .populate("tags")
      .exec();

    //   extract the tags from the interaction
    const userTags = interaction.reduce((tags: any, interaction: any) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    //   get distinct tags
    // @ts-ignore
    const distinctTags = [...new Set(userTags.map((tag: any) => tag._id))];

    const query: FilterQuery<IQuestion> = {
      $and: [
        {
          tags: { $in: distinctTags },
        },
        {
          author: { $ne: user._id },
        },
      ],
    };
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .limit(pageSize)
      .skip(skipAmount);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
