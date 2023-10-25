"use client";

import { FC } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

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
        value={""}
        onChange={() => {}}
        className={
          "paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
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