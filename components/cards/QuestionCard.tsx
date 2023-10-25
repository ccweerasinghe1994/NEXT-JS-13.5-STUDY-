import { FC } from "react";
import { TQuestion } from "@/types/types";
import Link from "next/link";
import RenderTags from "@/components/shared/tags/RenderTags";
import Metric from "@/components/shared/metric/Metric";
import { getTimStamp } from "@/lib/utils";

export type TQuestionCardProps = {
  question: TQuestion;
};

const QuestionCard: FC<TQuestionCardProps> = ({
  question: { _id, author, tags, title, upVotes, views, createdAt, answers },
}) => {
  return (
    <div
      className={
        "card-wrapper rounded-[10px] border-2 p-9 dark:border-none sm:px-11"
      }
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className=" ">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3
              className={
                "sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1"
              }
            >
              {title}
            </h3>
          </Link>
        </div>
        {/*  if signed in add edit delete actions */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTags key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 flex w-full flex-wrap gap-3">
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
          alt={"message"}
          value={upVotes}
          title={" Votes"}
          textStyles={"text-dark400_light800 small-medium"}
        />
        <Metric
          imageUrl={"/assets/icons/message.svg"}
          alt={"Upvotes"}
          value={answers}
          title={" Answers"}
          textStyles={"text-dark400_light800 small-medium"}
        />
        <Metric
          imageUrl={"/assets/icons/eye.svg"}
          alt={"eye"}
          value={views}
          title={" Views"}
          textStyles={"text-dark400_light800 small-medium"}
        />
      </div>
    </div>
  );
};
export default QuestionCard;