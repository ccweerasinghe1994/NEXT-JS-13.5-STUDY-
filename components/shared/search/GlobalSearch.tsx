"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "@/components/shared/globalResult/GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    setIsOpen(false);
    setSearch("");
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [pathName]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formatUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["global", "key"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathName, router, searchParams, query]);
  return (
    <div
      ref={popupRef}
      className={"relative w-full max-w-[600px] max-lg:hidden"}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center  gap-1 rounded-xl px-4">
        <Image
          src={"/assets/icons/search.svg"}
          alt={"search"}
          width={24}
          height={24}
          className={"cursor-pointer"}
        />
        <Input
          className={
            "paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
          }
          type={"text"}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          placeholder={"Search Globally"}
          value={search}
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
