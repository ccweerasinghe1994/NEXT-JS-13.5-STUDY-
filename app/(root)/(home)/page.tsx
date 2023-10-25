import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/shared/filters/Filter";
import { HOME_PAGE_FILTERS } from "@/CONSTANTS/filters";
import HomeFilter from "@/components/home/HomeFilter";
import NoResult from "@/components/shared/noResult/NoResult";
import { TQuestion } from "@/types/types";
import QuestionCard from "@/components/cards/QuestionCard";

const questions: TQuestion[] = [
  {
    _id: 1,
    title: "How to use React Query?",
    tags: [
      {
        _id: 1,
        name: "react",
      },
      {
        _id: 2,
        name: "react-query",
      },
    ],
    author: {
      _id: 1,
      name: "John Doe",
      picture: "/assets/icons/avatar.svg",
    },
    upVotes: 1000000,
    views: 4000000,
    answers: 12222222,
    createdAt: new Date("2021-09-01T12:00:00.000Z"),
  },
  {
    _id: 2,
    title: "How to use add a new route in Next.js?",
    tags: [
      {
        _id: 1,
        name: "next.js",
      },
      {
        _id: 2,
        name: "react",
      },
    ],
    author: {
      _id: 1,
      name: "John Doe",
      picture: "/assets/icons/avatar.svg",
    },
    upVotes: 10,
    views: 100,
    answers: 2,
    createdAt: new Date("2023-09-01T12:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className={"h1-bold text-dark100_light900"}>All Questions</h1>
        <Link
          href={"/ask-question"}
          className={"flex justify-end max-sm:w-full"}
        >
          <Button
            className={
              "primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
            }
          >
            Ask Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imageSrc={"/assets/icons/search.svg"}
          route={"/"}
          iconPosition={"left"}
          placeholder={"Search Questions ..."}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={HOME_PAGE_FILTERS}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
          containerClasses={"hidden max-md:flex"}
        />
      </div>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            // <QuestionCard key={question._id} question={question} />
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <NoResult
            title={"There is no questions to show"}
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
