import { FC } from "react";
import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/shared/pagination/Pagination";
import { TQuestion } from "@/types/types";

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
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: 2,
  });
  return (
    <div>
      {result.questions.map((question) => {
        return (
          <QuestionCard
            clerkId={clerkId}
            question={question as TQuestion}
            key={question._id}
          />
        );
      })}
      <div className="mt-10">
        <Pagination
          pageNumbers={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default QuestionTab;
