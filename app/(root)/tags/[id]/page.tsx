import { FC } from "react";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { TQuestion, URLProps } from "@/types/types";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/noResult/NoResult";
import Pagination from "@/components/shared/pagination/Pagination";

const Page: FC<URLProps> = async ({ params, searchParams }) => {
  const { questions, tagTitle, isNext } = await getQuestionByTagId({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
    pageSize: 10,
  });

  return (
    <div>
      <h1 className={"h1-bold text-dark100_light900"}>{tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearch
          imageSrc={"/assets/icons/search.svg"}
          route={`/tags/${params.id}`}
          iconPosition={"left"}
          placeholder={"Search Tag Questions ..."}
          otherClasses={"flex-1"}
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question: TQuestion) => (
            // <QuestionCard key={question._id} question={question} />
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <NoResult
            title={"There is no tag questions to show"}
            description={
              "  It appears that there are no saved questions in your collection at the\n" +
              "        moment 😔.Start exploring and saving questions that pique your interest\n" +
              "        🌟"
            }
            LinkHref={"/ask-question"}
            LinkText={"Ask a Question"}
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumbers={searchParams.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </div>
  );
};

export default Page;
