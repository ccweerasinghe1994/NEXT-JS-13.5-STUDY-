import { FC } from "react";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/shared/filters/Filter";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import TagCard from "@/components/cards/TagCard";
import NoResult from "@/components/shared/noResult/NoResult";
import { SearchParamsProps } from "@/types/types";

const TagsPage: FC<SearchParamsProps> = async ({ searchParams }) => {
  const results = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });
  return (
    <div>
      <h1 className={"h1-bold text-dark100_light900"}>Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imageSrc={"/assets/icons/search.svg"}
          route={"/tags"}
          iconPosition={"left"}
          placeholder={"Search for amazing minds"}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={TagFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className={"mt-12 flex flex-wrap gap-4 "}>
        {results.tags.length > 0 ? (
          results.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <NoResult
            title={"No Tags Found"}
            description={"It seems that there are no tags yet"}
            LinkText={"Ask a question"}
            LinkHref={"/ask-question"}
          />
        )}
      </section>
    </div>
  );
};

export default TagsPage;
