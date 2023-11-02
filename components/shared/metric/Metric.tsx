import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

type TMetricProps = {
  imageUrl: string;
  alt: string;
  value: number | string;
  title: string;
  textStyles?: string;
  isAuthor?: boolean;
  href?: string;
};
const Metric: FC<TMetricProps> = ({
  textStyles,
  title,
  imageUrl,
  value,
  alt,
  isAuthor,
  href,
}) => {
  const FormattedViews =
    title === " Views" && typeof value === "number" && value !== 0 && value / 2;
  const metric = (
    <>
      <Image
        src={imageUrl}
        alt={alt}
        height={16}
        width={16}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {typeof value === "number"
          ? formatNumber(FormattedViews || value)
          : value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={"flex-center gap-1"}>
        {metric}
      </Link>
    );
  }
  return <div className={"flex-center flex-wrap gap-1"}>{metric}</div>;
};

export default Metric;
