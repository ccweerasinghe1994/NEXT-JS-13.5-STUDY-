import Filter from "@/components/shared/filters/Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswerByQuestionId } from "@/lib/actions/answer.action";
import { getTimStamp } from "@/lib/utils";
import { ObjectId } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import ParseHTML from "../parseHtml/ParseHTML";
import Votes from "@/components/shared/votes/Votes";
import Pagination from "@/components/shared/pagination/Pagination";

type TAllAnswerProps = {
  questionId: ObjectId;
  userId: ObjectId;
  totalAnswers: number;
  page?: number;
  filter?: string;
};

const AllAnswers: FC<TAllAnswerProps> = async ({
  totalAnswers,
  userId,
  questionId,
  page,
  filter,
}) => {
  const result = await getAnswerByQuestionId({
    questionId,
    page: page ? +page : 1,
    pageSize: 10,
    sortBy: filter,
  });
  const { answers } = result;
  return (
    <div className={"mt-11"}>
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div className="">
        {answers.map((answer) => (
          <article className={"light-border border-b py-10"} key={answer._id}>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className={"flex flex-1 items-start gap-1 sm:items-center"}
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt={"profile"}
                    className={"rounded-full object-cover max-sm:mt-0.5"}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-dark400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      <span className="max-sm:hidden"> -</span>
                      answered {getTimStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
              </div>
              <div className="flex justify-end">
                <Votes
                  type={"answer"}
                  itemId={answer._id.toString()}
                  userId={userId.toString()}
                  upvotes={answer.upvotes.length}
                  hasUpVoted={answer.upvotes.includes(userId)}
                  downVotes={answer.downvotes.length}
                  hasDownVoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-10">
        <Pagination pageNumbers={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
