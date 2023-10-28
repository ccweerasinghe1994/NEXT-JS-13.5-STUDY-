"use server";

import { connectToDatabase } from "@/lib/mogoose";
import User, { IUser } from "@/database/user.model";

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
