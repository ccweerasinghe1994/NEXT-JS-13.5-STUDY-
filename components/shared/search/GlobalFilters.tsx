"use client";
import { GlobalSearchFilters } from "@/constants/filters";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { formatUrlQuery } from "@/lib/utils";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get("type");
  const [active, setActive] = useState(typeParams || "");
  const handleClick = (value: string) => {
    if (active === value) {
      setActive("");
      const newUrl = formatUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(value);
      const newUrl = formatUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: value ?? null,
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className={"flex items-center gap-5 px-5"}>
      <p className="text-dark400_light900 body-medium">Type :</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <Button
            key={filter.value}
            type={"button"}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize text-light-800 dark:text-light-800 dark:hover:text-primary-500 ${
              active === filter.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
            }`}
            onClick={() => handleClick(filter.value)}
          >
            {filter.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
