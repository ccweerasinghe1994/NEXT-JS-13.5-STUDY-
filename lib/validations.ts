import * as z from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "UserName must be at least 5 characters",
    })
    .max(130, {
      message: "UserName can't be more than 130 characters",
    }),
  explanation: z.string().min(100),
  tags: z
    .array(
      z
        .string()
        .min(1, "tag must be at least 1 character")
        .max(15, "cannot have more than 15 characters"),
    )
    .min(1, "must have at least 1 tag")
    .max(3, "cannot have more than 3 tags"),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export type TQuestionsSchema = z.infer<typeof QuestionsSchema>;
export type TAnswerSchema = z.infer<typeof AnswerSchema>;
