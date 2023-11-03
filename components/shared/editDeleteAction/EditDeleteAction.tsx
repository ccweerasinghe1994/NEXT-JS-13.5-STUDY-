"use client";
import { FC } from "react";
import Image from "next/image";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { usePathname, useRouter } from "next/navigation";

type TEditDeleteAction = {
  type: "question" | "answer";
  itemId: string;
};

const EditDeleteAction: FC<TEditDeleteAction> = ({ itemId, type }) => {
  const pathName = usePathname();
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`);
  };

  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({
        path: pathName,
        questionId: itemId,
      });
    } else if (type === "answer") {
      await deleteAnswer({
        path: pathName,
        answerId: itemId,
      });
    }
  };

  return (
    <div className={"flex items-center justify-end gap-3 max-sm:w-full"}>
      {type === "question" && (
        <Image
          src={"/assets/icons/edit.svg"}
          alt={"edit"}
          height={14}
          width={14}
          className={"cursor-pointer object-contain"}
          onClick={handleEdit}
        />
      )}
      <Image
        src={"/assets/icons/trash.svg"}
        alt={"delete"}
        height={14}
        width={14}
        className={"cursor-pointer object-contain"}
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
