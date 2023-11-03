import { FC } from "react";
import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "@/components/cards/QuestionCard";

type TQuestionTabProps = {
  userId: string;
  clerkId?: string | null;
  searchParams: { [key: string]: string | undefined };
};

const QuestionTab: FC<TQuestionTabProps> = async ({
  userId,
  searchParams,
  clerkId,
}) => {
  const result = await getUserQuestions({ userId, page: 1 });
  console.log(result);
  return (
    <div>
      {result.questions.map((question) => {
        return (
          <QuestionCard
            clerkId={clerkId}
            question={question}
            key={question._id}
          />
        );
      })}
    </div>
  );
};

export default QuestionTab;
