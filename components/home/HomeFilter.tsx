"use client";
import { HOME_PAGE_FILTERS } from "@/constants/filters";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { formatUrlQuery } from "@/lib/utils";
import { TFilterValueType } from "@/types/types";

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<TFilterValueType | undefined>("newest");
  const router = useRouter();
  const handleTypeClick = (type: TFilterValueType) => {
    if (active === type) {
      setActive(undefined);
      const newUrl = formatUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(type);
      const newUrl = formatUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: type ?? null,
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex ">
      {HOME_PAGE_FILTERS.map((filter) => (
        <Button
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === filter.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-500/20 dark:bg-dark-400 "
              : "bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
          key={filter.value}
          onClick={() => {
            handleTypeClick(filter.value as TFilterValueType);
          }}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};
export default HomeFilter;
