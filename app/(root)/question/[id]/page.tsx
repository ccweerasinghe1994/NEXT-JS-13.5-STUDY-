import { getQuestionById } from "@/lib/actions/question.action";
import Image from "next/image";
import Link from "next/link";
import Metric from "@/components/shared/metric/Metric";
import { getTimStamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/parseHtml/ParseHTML";
import RenderTag from "@/components/shared/tags/RenderTag";
import { FC } from "react";
import Answer from "@/components/forms/Answer";

type TPageProps = {
  params: {
    id: string;
  };
};

const Page: FC<TPageProps> = async ({ params }) => {
  const { question } = await getQuestionById({ questionId: params.id });

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
          <div className="flex justify-end">VOTING</div>
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
      <Answer />
    </>
  );
};

export default Page;