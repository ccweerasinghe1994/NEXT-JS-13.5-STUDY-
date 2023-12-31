"use client";
import { FC } from "react";
import { TFilterItem } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type TFilterProps = {
  filters: TFilterItem[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter: FC<TFilterProps> = ({
  filters,
  otherClasses,
  containerClasses,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsFilter = searchParams.get("filter");
  const handleUpdateParams = (value: string) => {
    const newUrl = formatUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className={"line-clamp-1 flex-1 text-left"}>
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
