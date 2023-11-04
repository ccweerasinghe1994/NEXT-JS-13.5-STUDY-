import { BADGE_CRITERIA } from "@/constants";
import { ObjectId } from "mongoose";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}
export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}
export interface Country {
  name: {
    common: string;
  };
}
export interface ParamsProps {
  params: { id: string };
}
export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}
export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}
export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}
export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export type TFilterItem = {
  name: string;
  value: "newest" | "recommended" | "frequent" | "unanswered";
};

export type TTag = {
  _id: number;
  name: string;
};

export type TAuthor = {
  _id: number;
  name: string;
  picture: string;
  clerkId: string;
};

export type TQuestion = {
  _id: string;
  title: string;
  tags: TTag[];
  author: TAuthor;
  upvotes: [ObjectId];
  views: number;
  answers: [ObjectId];
  createdAt: Date;
};

export type TAnswer = {
  _id: string;
  author: {
    name: string;
    picture: string;
    _id: string;
    clerkId: string;
  };
  question: {
    title: string;
    _id: string;
  };
  content: string;
  upvotes: ObjectId[];
  downvotes: ObjectId[];
  createdAt: Date;
};
