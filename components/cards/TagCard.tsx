import { FC } from "react";
import Link from "next/link";

type TTageProps = {
  tag: {
    _id: string;
    createdOn: Date;
    followers: string[];
    name: string;
    questions: Array<string>;
  };
};

const TagCard: FC<TTageProps> = ({ tag }) => {
  const { _id, questions } = tag;
  return (
    <Link href={`/tags/${_id}`} className={"shadow-2xl dark:shadow-none"}>
      <article
        className={
          "background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]"
        }
      >
        <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
          <p className="paragraph-semibold text-dark300_light900">{tag.name}</p>
        </div>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions.length}+
          </span>{" "}
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
