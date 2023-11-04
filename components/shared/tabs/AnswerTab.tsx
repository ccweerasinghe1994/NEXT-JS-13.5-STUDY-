import { FC } from "react";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "@/components/cards/AnswerCard";
import Pagination from "@/components/shared/pagination/Pagination";
import { TAnswer } from "@/types/types";

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
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: 2,
  });
  return (
    <>
      {result.answers.map((answer) => {
        return (
          <AnswerCard
            key={answer._id}
            answer={answer as TAnswer}
            clerkId={clerkId}
          />
        );
      })}
      <div className="mt-10">
        <Pagination
          pageNumbers={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default AnswerTab;
