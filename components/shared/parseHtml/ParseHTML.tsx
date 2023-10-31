import { FC } from "react";

type TParseHTMLProps = {
  data: string;
};

const ParseHTML: FC<TParseHTMLProps> = ({ data }) => {
  return <div>{data}</div>;
};

export default ParseHTML;
