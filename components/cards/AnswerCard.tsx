import { FC } from "react";
import Link from "next/link";
import { TAnswer } from "@/types/types";
import { getTimStamp } from "@/lib/utils";
import Metric from "@/components/shared/metric/Metric";

type TAnswerCardProps = {
  answer: TAnswer;
  clerkId?: string | null;
};

const AnswerCard: FC<TAnswerCardProps> = ({
  answer: { content, createdAt, downvotes, _id, upvotes, question, author },
  clerkId,
}) => {
  return (
    <Link
      href={`/question/${question?._id}/#${_id}`}
      className={"card-wrapper rounded-[10px] px-11 py-9"}
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimStamp(createdAt)}
          </span>
          <h3
            className={
              "sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1"
            }
          >
            {question.title}
          </h3>
        </div>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imageUrl={author.picture}
          alt={"user"}
          value={author.name}
          title={` - asked ${getTimStamp(createdAt)}`}
          textStyles={"text-dark400_light700 body-medium"}
          href={`/profile/${author._id}`}
          isAuthor={true}
        />
        <Metric
          imageUrl={"/assets/icons/like.svg"}
          alt={"like"}
          value={upvotes.length}
          title={" Votes"}
          textStyles={"text-dark400_light800 small-medium"}
        />
      </div>
    </Link>
  );
};

export default AnswerCard;
