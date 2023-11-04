"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { formatUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type TPaginationProps = {
  pageNumbers: number;
  isNext: boolean;
};

const Pagination: FC<TPaginationProps> = ({ isNext, pageNumbers }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleNavigation = (direction: "previous" | "next") => {
    const nextPageNumber =
      direction === "previous" ? pageNumbers - 1 : pageNumbers + 1;
    const newUrl = formatUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };
  return (
    <div className={"flex w-full items-center justify-center gap-2"}>
      <Button
        className={
          "light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        }
        onClick={() => handleNavigation("previous")}
        disabled={pageNumbers === 1}
      >
        <p className="text-dark200_light800 body-medium">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumbers}</p>
      </div>
      <Button
        className={
          "light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        }
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
      >
        <p className="text-dark200_light800 body-medium">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
