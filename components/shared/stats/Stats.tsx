import { FC } from "react";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";

type TStatsCard = {
  imageUrl: string;
  value: number;
  title: string;
};
const StatsCard: FC<TStatsCard> = ({ imageUrl, value, title }) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imageUrl} alt={title} height={50} width={40} />
      <div className="">
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light900">{title}</p>
      </div>
    </div>
  );
};

type TStats = {
  totalQuestions: number;
  totalAnswers: number;
};

const Stats: FC<TStats> = ({ totalAnswers, totalQuestions }) => {
  return (
    <div className={"mt-10"}>
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4 ">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div className="">
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light900">Questions</p>
          </div>
          <div className="">
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light900">Answers</p>
          </div>
        </div>
        <StatsCard
          value={0}
          title={"Gold Badges"}
          imageUrl={"/assets/icons/gold-medal.svg"}
        />{" "}
        <StatsCard
          value={0}
          title={"Silver Badges"}
          imageUrl={"/assets/icons/silver-medal.svg"}
        />{" "}
        <StatsCard
          value={0}
          title={"Bronze Badges"}
          imageUrl={"/assets/icons/bronze-medal.svg"}
        />
      </div>
    </div>
  );
};

export default Stats;
