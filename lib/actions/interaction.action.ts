"use server";

import { ViewQuestionParams } from "@/lib/actions/shared";
import { connectToDatabase } from "@/lib/mogoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    await connectToDatabase();
    const { userId, questionId } = params;
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (existingInteraction) return console.log("Already viewed");
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
