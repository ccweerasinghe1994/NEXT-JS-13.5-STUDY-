import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/shared/filters/Filter";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/noResult/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { TQuestion } from "@/types/types";
import { getSavedQuestion } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();

  if (!userId) return null;

  const { questions } = await getSavedQuestion({
    clerkId: userId,
  });
  return (
    <>
      <h1 className={"h1-bold text-dark100_light900"}>Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imageSrc={"/assets/icons/search.svg"}
          route={"/"}
          iconPosition={"left"}
          placeholder={"Search Questions ..."}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={QuestionFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
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
            title={"There is no saved questions to show"}
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
    </>
  );
}
