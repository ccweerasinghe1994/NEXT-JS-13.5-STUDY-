import Question from "@/components/forms/Question";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { FC } from "react";
import { URLProps } from "@/types/types";

const Page: FC<URLProps> = async ({ params, searchParams }) => {
  const { userId } = auth();

  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({
    questionId: params.id,
  });
  if (!mongoUser) return null;

  return (
    <>
      <h1 className={"h1-bold text-dark100_light900"}>Edit question</h1>
      <div className="mt-9">
        <Question
          type={"edit"}
          mongoUserId={mongoUser._id.toString()}
          questionDetails={JSON.stringify(result.question)}
        />
      </div>
    </>
  );
};

export default Page;
