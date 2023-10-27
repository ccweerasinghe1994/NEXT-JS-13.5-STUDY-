"use server";

import { connectToDatabase } from "@/lib/mogoose";

export async function createQuestion(params: any) {
  try {
    await connectToDatabase();
  } catch (e) {}
}
