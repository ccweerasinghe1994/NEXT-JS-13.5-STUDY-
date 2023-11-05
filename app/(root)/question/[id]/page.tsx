import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers/AllAnswers";
import Metric from "@/components/shared/metric/Metric";
import ParseHTML from "@/components/shared/parseHtml/ParseHTML";
import RenderTag from "@/components/shared/tags/RenderTag";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getTimStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Votes from "@/components/shared/votes/Votes";
import { URLProps } from "@/types/types";

const Page: FC<URLProps> = async ({ params, searchParams }) => {
  const { question } = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();
  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            className={"flex items-center justify-start gap-1"}
            href={`/profile/${question.author.clerkId}`}
          >
            <Image
              className={"rounded-full"}
              src={question.author.picture}
              alt={"profile picture"}
              height={22}
              width={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type={"question"}
              itemId={question._id.toString()}
              userId={mongoUser?._id.toString() ?? ""}
              upvotes={question.upvotes.length}
              hasUpVoted={question.upvotes.includes(mongoUser?._id.toString())}
              downVotes={question.downvotes.length}
              hasDownVoted={question.downvotes.includes(
                mongoUser?._id.toString(),
              )}
              hasSaved={mongoUser?.saved.includes(question?._id ?? "") ?? false}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className=" mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imageUrl={"/assets/icons/clock.svg"}
          alt={"clock icons"}
          value={` asked ${getTimStamp(question.createdAt)}`}
          title={""}
          textStyles={"text-dark400_light800 small-medium"}
        />
        <Metric
          imageUrl={"/assets/icons/message.svg"}
          alt={"Upvotes"}
          value={question.answers.length}
          title={" Answers"}
          textStyles={"text-dark400_light800 small-medium"}
        />
        <Metric
          imageUrl={"/assets/icons/eye.svg"}
          alt={"eye"}
          value={question.views}
          title={" Views"}
          textStyles={"text-dark400_light800 small-medium"}
        />
      </div>
      <ParseHTML data={question.content} />
      <div className="mt-8 flex flex-wrap gap-4">
        {question.tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <AllAnswers
        questionId={question._id}
        userId={mongoUser?._id ?? ""}
        totalAnswers={question.answers.length}
        page={Number(searchParams?.page)}
        filter={searchParams?.filter}
      />
      <Answer
        question={question.title}
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(mongoUser?._id ?? "")}
      />
    </>
  );
};

export default Page;
