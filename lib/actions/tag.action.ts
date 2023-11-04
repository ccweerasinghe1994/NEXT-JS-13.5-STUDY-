"use server";

import { connectToDatabase } from "@/lib/mogoose";
import User from "@/database/user.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "@/lib/actions/shared";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import { throwError } from "@/lib/utils";
import Question, { IQuestion } from "@/database/question.model";

export const getTopInteractiveTags = async (
  params: GetTopInteractedTagsParams,
) => {
  try {
    const { userId } = params;
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      throwError("User not found");
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
type TGetAllTags = "popular" | "recent" | "name" | "old";
export const getAllTags = async (params: GetAllTagsParams) => {
  const { searchQuery, filter } = params;
  const query: FilterQuery<ITag> = {};
  if (searchQuery) {
    query.$or = [
      {
        name: { $regex: new RegExp(searchQuery, "i") },
      },
    ];
  }

  let sortObject = {};

  switch (filter as TGetAllTags) {
    case "popular":
      sortObject = { questions: -1 };
      break;
    case "recent":
      sortObject = { createdOn: -1 };
      break;
    case "name":
      sortObject = { name: 1 };
      break;
    case "old":
      sortObject = { createdOn: 1 };
      break;
    default:
      break;
  }

  try {
    await connectToDatabase();
    const tags = await Tag.find(query).sort(sortObject);
    return { tags };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getQuestionByTagId = async (params: GetQuestionsByTagIdParams) => {
  try {
    await connectToDatabase();
    const { tagId, searchQuery } = params;
    const query: FilterQuery<IQuestion> = {};

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const tag = await Tag.findOne({
      _id: tagId,
    }).populate({
      path: "questions",
      model: Question,
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

    if (!tag) {
      throwError("Tag not found");
    }

    const questions = tag.questions;

    return {
      tagTitle: tag.name,
      questions,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getPopularTags = async () => {
  try {
    await connectToDatabase();
    const tags = await Tag.aggregate([
      {
        $project: { name: 1, numberOsQuestions: { $size: "$questions" } },
      },
      { $sort: { numberOsQuestions: -1 } },
      { $limit: 10 },
    ]);
    return tags;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
