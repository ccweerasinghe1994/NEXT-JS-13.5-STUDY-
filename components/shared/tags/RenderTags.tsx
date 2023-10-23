import { FC } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type TRenderTagsProps = {
  _id: number;
  name: string;
  totalQuestions: number;
  showCount?: boolean;
};

const RenderTags: FC<TRenderTagsProps> = ({
  name,
  totalQuestions,
  showCount,
  _id,
}) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge
        className={
          "subtle-medium background-light800_dark300 rounded-md border-none px-4 py-2 uppercase text-light-400"
        }
      >
        {name}
      </Badge>
      {showCount && (
        <p className={"small-medium text-dark500_light700"}>{totalQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTags;
