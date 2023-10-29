"use server";

import { connectToDatabase } from "@/lib/mogoose";
import User from "@/database/user.model";
import {
  GetAllTagsParams,
  GetTopInteractedTagsParams,
} from "@/lib/actions/shared";
import Tag from "@/database/tag.model";

export const getTopInteractiveTags = async (
  params: GetTopInteractedTagsParams,
) => {
  try {
    const { userId } = params;
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // find interactions for user and group by tags...
    //   Interactions

    return [
      {
        _id: "1",
        name: "tag1",
      },
      {
        _id: "2",
        name: "tag2",
      },
      {
        _id: "3",
        name: "tag3",
      },
    ];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectToDatabase();
    const tags = await Tag.find({});
    return { tags };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
