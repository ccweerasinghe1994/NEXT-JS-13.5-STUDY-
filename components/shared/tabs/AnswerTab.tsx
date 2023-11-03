import { FC } from "react";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "@/components/cards/AnswerCard";

type TAnswerTabProps = {
  userId: string;
  clerkId?: string | null;
  searchParams: { [key: string]: string | undefined };
};

const AnswerTab: FC<TAnswerTabProps> = async ({
  searchParams,
  clerkId,
  userId,
}) => {
  const result = await getUserAnswers({ userId, page: 1 });
  return (
    <>
      {result.answers.map((answer) => {
        return (
          <AnswerCard key={answer._id} answer={answer} clerkId={clerkId} />
        );
      })}
    </>
  );
};

export default AnswerTab;
