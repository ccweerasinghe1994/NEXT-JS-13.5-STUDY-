"use client";
import { HOME_PAGE_FILTERS } from "@/constants/filters";
import { Button } from "@/components/ui/button";

const HomeFilter = () => {
  const isActive = "newest";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex ">
      {HOME_PAGE_FILTERS.map((filter) => (
        <Button
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            isActive === filter.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-light-500 hover:bg-light-900 dark:bg-dark-300 dark:text-light-500"
          }`}
          key={filter.value}
          onClick={() => {}}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};
export default HomeFilter;
