"use server";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "@/lib/mogoose";
import User, { IUser } from "@/database/user.model";
import {
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ICreateUserParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "@/lib/actions/shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { throwError } from "@/lib/utils";

type TGetUserById = {
  userId: string;
};
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
    const { page = 1, pageSize = 20, searchQuery, filter } = params;
    console.log(page, pageSize, searchQuery, filter);
    await connectToDatabase();
    const users = await User.find({}).sort({
      createdAt: -1,
    });

    return {
      users,
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
    const { page = 1, pageSize = 10, searchQuery, filter, clerkId } = params;
    console.log(page, pageSize, searchQuery, filter);
    await connectToDatabase();
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: {
          createdAt: -1,
        },
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
      },
    });

    if (!user) {
      throwError("User not found");
    }

    const savedQuestions = user.saved;

    return {
      questions: savedQuestions,
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
