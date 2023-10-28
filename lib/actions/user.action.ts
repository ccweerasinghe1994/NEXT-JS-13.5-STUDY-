"use server";

import { connectToDatabase } from "@/lib/mogoose";
import User, { IUser } from "@/database/user.model";
import {
  DeleteUserParams,
  ICreateUserParams,
  UpdateUserParams,
} from "@/lib/actions/shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

type TGetUserById = {
  userId: string;
};
export async function getUserById(params: TGetUserById): Promise<IUser> {
  try {
    const { userId } = params;
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    return user;
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
      throw new Error("User not found");
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
