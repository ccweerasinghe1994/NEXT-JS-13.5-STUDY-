"use server";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "@/lib/mogoose";
import User, { IUser } from "@/database/user.model";
import {
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ICreateUserParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "@/lib/actions/shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { throwError } from "@/lib/utils";
import Answer from "@/database/answer.model";

type TGetUserById = {
  userId: string;
};

type TFilterOptions = "new_users" | "old_users" | "top_contributors";
type TFilterUserOptions =
  | "most_recent"
  | "oldest"
  | "most_voted"
  | "most_viewed"
  | "most_answered";

export async function getUserById(params: TGetUserById): Promise<IUser | null> {
  try {
    const { userId } = params;
    await connectToDatabase();
    return await User.findOne({ clerkId: userId });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUser(userData: ICreateUserParams): Promise<IUser> {
  try {
    await connectToDatabase();
    return await User.create(userData);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDatabase();
    await User.findOneAndUpdate(
      { clerkId: params.clerkId },
      params.updateData,
      {
        new: true,
      },
    );

    revalidatePath(params.path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDatabase();
    const findUser = await User.findOne({
      clerkId: params.clerkId,
    });

    if (!findUser) {
      throwError("User not found");
    }

    // delete user from database
    // cleanup user's questions
    // cleanup user's answers
    // cleanup user's comments

    // const userQuestions = await Question.find({
    //   author: findUser._id,
    // }).distinct("_id");

    await Question.deleteMany({
      author: findUser._id,
    });
    return await User.findByIdAndDelete(findUser._id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    await connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 2 } = params;

    const skip = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
          username: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};

    switch (filter as TFilterOptions) {
      case "new_users":
        sortOptions = {
          joinedAt: -1,
        };
        break;
      case "old_users":
        sortOptions = {
          joinedAt: 1,
        };
        break;
      case "top_contributors":
        sortOptions = {
          reputation: -1,
        };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skip + pageSize;
    return {
      users,
      isNext,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    const { userId, questionId, path } = params;
    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      throwError("User not found");
    }

    const isSaved = user.saved.includes(questionId);
    if (isSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            saved: questionId,
          },
        },
        {
          new: true,
        },
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            saved: questionId,
          },
        },
        {
          new: true,
        },
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSavedQuestion = async (params: GetSavedQuestionsParams) => {
  try {
    await connectToDatabase();
    const { searchQuery, clerkId, filter, pageSize = 2, page = 1 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let filterOptions = {};

    switch (filter as TFilterUserOptions) {
      case "most_recent":
        filterOptions = {
          createdAt: -1,
        };
        break;
      case "oldest":
        filterOptions = {
          createdAt: 1,
        };
        break;
      case "most_voted":
        filterOptions = {
          upvotes: -1,
        };
        break;
      case "most_viewed":
        filterOptions = {
          views: -1,
        };
        break;
      case "most_answered":
        filterOptions = {
          answers: -1,
        };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "name _id",
        },
        {
          path: "author",
          model: User,
          select: "name _id clerkId picture",
        },
      ],
      options: {
        sort: filterOptions,
        limit: pageSize + 1,
        skip: skipAmount,
      },
    });

    if (!user) {
      throwError("User not found");
    }

    const savedQuestions = user.saved;

    const isNext = user.saved.length > pageSize;
    return {
      questions: savedQuestions,
      isNext,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    const { userId } = params;
    await connectToDatabase();
    const user = await User.findOne({
      clerkId: userId,
    });
    if (!user) {
      throwError("User not found");
    }
    const totalQuestions = await Question.countDocuments({
      author: user._id,
    });
    const totalAnswers = await Answer.countDocuments({
      author: user._id,
    });
    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();
    const { page = 1, pageSize = 2, userId } = params;
    const skip = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({
      author: userId,
    });

    const userQuestions = await Question.find({
      author: userId,
    })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate({
        path: "tags",
        model: Tag,
        select: "name _id",
      })
      .populate({
        path: "author",
        model: User,
        select: "name _id picture clerkId",
      })
      .skip(skip)
      .limit(pageSize);
    const isNext = totalQuestions > skip + userQuestions.length;
    return {
      totalQuestions,
      questions: userQuestions,
      isNext,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();
    const { page = 1, pageSize = 2, userId } = params;
    const skip = (page - 1) * pageSize;
    console.log(page, pageSize, userId);
    const totalAnswers = await Answer.countDocuments({
      author: userId,
    });

    const userAnswers = await Answer.find({
      author: userId,
    })
      .sort({
        upvotes: -1,
      })
      .populate({
        path: "question",
        model: Question,
        select: "title _id",
      })
      .populate({
        path: "author",
        model: User,
        select: "name _id picture clerkId",
      })
      .skip(skip)
      .limit(pageSize);
    const isNext = totalAnswers > skip + userAnswers.length;
    return {
      totalAnswers,
      answers: userAnswers,
      isNext,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const getAllUsers = async (params: GetAllUsersParams) => {
//   try {
//     const { page, pageSize, searchQuery, filter } = params;
//     await connectToDatabase();
//     return await User.find({});
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
