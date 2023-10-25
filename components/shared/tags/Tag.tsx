import { FC } from "react";
import { Badge } from "@/components/ui/badge";

type TTagsProps = {
  name: string;
};

const Tag: FC<TTagsProps> = ({ name }) => {
  return (
    <Badge
      className={
        "small-semibold background-light800_dark300 rounded-lg  border-none px-6 py-3 capitalize text-light-400"
      }
    >
      {name}
    </Badge>
  );
};

export default Tag;
