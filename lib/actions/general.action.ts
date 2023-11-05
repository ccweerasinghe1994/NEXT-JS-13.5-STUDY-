"use server";

import { SearchParams } from "@/lib/actions/shared";
import { connectToDatabase } from "@/lib/mogoose";
import { FilterQuery } from "mongoose";
import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import Answer, { IAnswer } from "@/database/answer.model";
import User, { IUser } from "@/database/user.model";
import { throwError } from "@/lib/utils";

export type TGlobalSearchTypes =
  | "answer"
  | "question"
  | "tag"
  | "user"
  | undefined;
export const globalSearch = async (params: SearchParams) => {
  try {
    await connectToDatabase();
    const { type, query } = params;
    const regex: FilterQuery<IQuestion | ITag | IAnswer | IUser> = {
      $regex: query,
      $options: "i",
    };

    let result = [];
    const modelAndType = [
      {
        model: Question,
        type: "question",
        searchField: "title",
      },
      {
        model: User,
        type: "user",
        searchField: "name",
      },
      {
        model: Answer,
        type: "answer",
        searchField: "content",
      },
      {
        model: Tag,
        type: "tag",
        searchField: "name",
      },
    ];

    const typeLower: TGlobalSearchTypes =
      type?.toLowerCase() as TGlobalSearchTypes;

    if (
      !typeLower ||
      !["answer", "question", "tag", "user"].includes(typeLower)
    ) {
      //     search all
      for (const { searchField, type, model } of modelAndType) {
        const queryResult = await model
          .find({
            [searchField]: regex,
          })
          .limit(2);
        result.push(
          ...queryResult.map((item) => ({
            title:
              type === "user"
                ? `Answer containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question
                : item._id,
          })),
        );
      }
    } else {
      //     search specific type
      const modelInfo = modelAndType.find((m) => m.type === typeLower);

      if (!modelInfo) {
        throwError("Invalid type");
        return;
      }

      const queryResult = await modelInfo.model
        .find({
          [modelInfo.searchField]: regex,
        })
        .limit(8);

      result = queryResult.map((item) => ({
        title:
          typeLower === "user"
            ? `Answer containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          typeLower === "user"
            ? item.clerkId
            : typeLower === "answer"
            ? item.question
            : item._id,
      }));
    }
    return JSON.stringify(result);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
