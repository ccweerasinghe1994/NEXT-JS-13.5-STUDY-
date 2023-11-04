import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/shared/filters/Filter";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import UserCard from "@/components/cards/UserCard";
import { SearchParamsProps } from "@/types/types";
import { FC } from "react";

const CommunityPage: FC<SearchParamsProps> = async ({ searchParams }) => {
  const results = await getAllUsers({
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className={"h1-bold text-dark100_light900"}>All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imageSrc={"/assets/icons/search.svg"}
          route={"/community"}
          iconPosition={"left"}
          placeholder={"Search for amazing minds"}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={UserFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className={"mt-12 flex flex-wrap gap-4 "}>
        {results.users.length > 0 ? (
          results.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div
            className={
              "paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center"
            }
          >
            <p>No users Yet</p>
            <Link
              href={"/sign-up"}
              className={"mt-2 font-bold text-accent-blue"}
            >
              Join To Be The First
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default CommunityPage;
