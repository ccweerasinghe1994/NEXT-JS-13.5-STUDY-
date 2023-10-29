import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopInteractiveTags } from "@/lib/actions/tag.action";
import { Badge } from "@/components/ui/badge";
import RenderTags from "@/components/shared/tags/RenderTags";

type TUserCardProps = {
  user: {
    name: string;
    _id: string;
    clerkId: string;
    picture: string;
    username: string;
  };
};

const UserCard: FC<TUserCardProps> = async ({
  user: { name, picture, username, clerkId, _id },
}) => {
  const interactedTags = await getTopInteractiveTags({ userId: _id });
  return (
    <Link
      href={`/profile/${_id}`}
      className={
        "w-full border shadow-xl dark:border-none max-xs:min-w-full xs:w-[260px]"
      }
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={picture}
          alt={"profile picture"}
          width={100}
          height={100}
          className={"rounded-full"}
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className={"flex items-center gap-2"}>
              {interactedTags.map((tag) => (
                <RenderTags key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
