import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FC } from "react";

type TNoResultProps = {
  title: string;
  description: string;
  LinkText: string;
  LinkHref: string;
};

const NoResult: FC<TNoResultProps> = ({
  LinkHref,
  LinkText,
  title,
  description,
}) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={"/assets/images/light-illustration.png"}
        alt={"no result"}
        width={270}
        height={200}
        className={"block object-contain dark:hidden"}
      />
      <Image
        src={"/assets/images/dark-illustration.png"}
        alt={"no result"}
        width={270}
        height={200}
        className={"hidden object-contain dark:flex"}
      />
      <h2 className={"h2-bold text-dark200_light900 mt-8"}>{title}</h2>
      <p
        className={
          "body-regular text-dark500_light700 my-3.5 max-w-md text-center"
        }
      >
        {description}
      </p>
      <Link href={LinkHref}>
        <Button
          className={
            "paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 "
          }
        >
          {LinkText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
