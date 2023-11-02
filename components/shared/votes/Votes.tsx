"use client";
import { FC, useEffect } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { viewQuestion } from "@/lib/actions/interaction.action";

type TVotesProps = {
  type: "question" | "answer";
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downVotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
};
const Votes: FC<TVotesProps> = ({
  hasUpVoted,
  upvotes,
  downVotes,
  hasDownVoted,
  itemId,
  type,
  hasSaved,
  userId,
}) => {
  const pathName = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    try {
      if (type !== "question") return;
      await toggleSaveQuestion({
        questionId: itemId,
        userId,
        path: pathName,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const handleVote = async (action: "upvote" | "downVote") => {
    if (!userId) return;

    if (action === "upvote") {
      if (type === "question") {
        await upVoteQuestion({
          questionId: itemId,
          userId,
          hasUpVoted,
          hasDownVoted,
          path: pathName,
        });
      } else if (type === "answer") {
        await upVoteAnswer({
          answerId: itemId,
          userId,
          hasUpVoted,
          hasDownVoted,
          path: pathName,
        });
      }
    }

    if (action === "downVote") {
      if (type === "question") {
        await downVoteQuestion({
          questionId: itemId,
          userId,
          hasUpVoted,
          hasDownVoted,
          path: pathName,
        });
      } else if (type === "answer") {
        await downVoteAnswer({
          answerId: itemId,
          userId,
          hasUpVoted,
          hasDownVoted,
          path: pathName,
        });
      }
    }
  };

  useEffect(() => {
    viewQuestion({ questionId: itemId, userId });
  }, [itemId, userId, router, pathName]);
  return (
    <div className={"flex gap-5"}>
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt={"upvote icon"}
            width={18}
            height={18}
            className={"cursor-pointer"}
            onClick={() => handleVote("upvote")}
          />
          <div className="background-light700_dark400 flex min-w-[18px] items-center rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt={"upvote icon"}
            width={18}
            height={18}
            className={"cursor-pointer"}
            onClick={() => handleVote("downVote")}
          />
          <div className="background-light700_dark400 flex min-w-[18px] items-center rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt={"upvote icon"}
          width={18}
          height={18}
          className={"cursor-pointer"}
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
