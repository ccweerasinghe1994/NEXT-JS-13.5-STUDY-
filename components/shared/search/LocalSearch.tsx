"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatUrlQuery, removeKeysFromQuery } from "@/lib/utils";

type TLocationProps = {
  route: string;
  iconPosition: "left" | "right";
  imageSrc: string;
  placeholder: string;
  otherClasses?: string;
};

const LocalSearch: FC<TLocationProps> = ({
  otherClasses,
  route,
  imageSrc,
  iconPosition,
  placeholder,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formatUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathName === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["q"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathName, router, searchParams, query, route]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imageSrc}
          alt={"search icon"}
          width={24}
          height={24}
          className={"cursor-pointer"}
        />
      )}
      <Input
        type={"text"}
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className={
          "paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        }
      />
      {iconPosition === "right" && (
        <Image
          src={imageSrc}
          alt={"search icon"}
          width={24}
          height={24}
          className={"cursor-pointer"}
        />
      )}
    </div>
  );
};

export default LocalSearch;
