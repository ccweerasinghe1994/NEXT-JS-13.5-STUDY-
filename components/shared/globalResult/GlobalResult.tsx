"use client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "@/components/shared/search/GlobalFilters";
import { globalSearch, TGlobalSearchTypes } from "@/lib/actions/general.action";

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    if (global || type) {
      const fetchResults = async () => {
        setResults([]);
        setIsLoading(true);

        try {
          const result = await globalSearch({
            type,
            query: global,
          });
          console.log("result", result);
          setResults(JSON.parse(result ?? "[]"));
        } catch (e) {
          console.log(e);
          throw e;
        } finally {
          setIsLoading(false);
        }
      };
      if (global) {
        fetchResults();
      }
    }
  }, [global, type]);
  const renderLink = (type: TGlobalSearchTypes, id: string) => {
    switch (type) {
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      default:
        return `/`;
    }
  };
  return (
    <div
      className={
        "absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400"
      }
    >
      <GlobalFilters />
      <div className={"my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"} />
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isLoading ? (
          <div className={"flex-center flex-col px-5"}>
            <ReloadIcon
              className={"my-2 h-10 w-10 animate-spin text-primary-500"}
            />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire app
            </p>
          </div>
        ) : (
          <div className={"flex flex-col gap-2"}>
            {results.length > 0 ? (
              results.map(
                (
                  result: { type: string; title: string; id: string },
                  index,
                ) => (
                  <Link
                    href={renderLink(
                      result.type as TGlobalSearchTypes,
                      result.id,
                    )}
                    key={result.type + result.id + index}
                    className={
                      "flex w-full cursor-pointer items-start gap-3 rounded-xl px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                    }
                  >
                    <Image
                      src={"/assets/icons/tag.svg"}
                      alt={"tag"}
                      width={18}
                      height={18}
                      className={"invert-colors mt-1 object-contain"}
                    />
                    <div className="flex flex-col">
                      <p className="body-medium text-dark200_light800  small-medium mt-1 line-clamp-1 font-bold capitalize">
                        {result.title}
                      </p>
                      <p className="text-light400_light500 small-medium mt-1  font-bold capitalize">
                        {result.type}
                      </p>
                    </div>
                  </Link>
                ),
              )
            ) : (
              <div className={"flex-center flex-col px-5"}>
                <p className={"text-dark200_light800 body-regular px-5 py-2.5"}>
                  Oops no result found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
