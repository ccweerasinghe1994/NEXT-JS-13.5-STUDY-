import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

type TProfileLinkProps = {
  imageUrl: string;
  title: string;
  href?: string;
};

const ProfileLink: FC<TProfileLinkProps> = ({ imageUrl, title, href }) => {
  return (
    <div className={"flex-center gap-1"}>
      <Image src={imageUrl} alt={"icon"} height={20} width={20} />
      {href ? (
        <Link
          href={href}
          target={"_blank"}
          className={"paragraph-medium text-accent-blue"}
        >
          {title}
        </Link>
      ) : (
        <p className={"paragraph-medium text-dark400_light700"}>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
