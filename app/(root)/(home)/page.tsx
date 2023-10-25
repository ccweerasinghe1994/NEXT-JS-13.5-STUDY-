import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/shared/filters/Filter";
import { HOME_PAGE_FILTERS } from "@/CONSTANTS/filters";
import HomeFilter from "@/components/home/HomeFilter";

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
    </>
  );
}
