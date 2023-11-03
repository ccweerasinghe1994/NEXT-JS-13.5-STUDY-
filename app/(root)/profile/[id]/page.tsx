import { FC } from "react";
import { URLProps } from "@/types/types";
import { getUserInfo } from "@/lib/actions/user.action";
import Image from "next/image";
import { auth, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/profileLink/ProfileLink";
import Stats from "@/components/shared/stats/Stats";
import QuestionTab from "@/components/shared/tabs/QuestionTab";
import AnswerTab from "@/components/shared/tabs/AnswerTab";

const Page: FC<URLProps> = async ({ params, searchParams }) => {
  const result = await getUserInfo({ userId: params.id });
  const { userId: clerkId } = auth();
  return (
    <>
      <div
        className={
          "flex flex-col-reverse items-start justify-between sm:flex-row"
        }
      >
        <div className={"flex flex-col items-start gap-4 lg:flex-row"}>
          <Image
            src={result.user.picture}
            alt={"profile picture"}
            height={128}
            width={128}
            className={"rounded-full object-cover"}
          />
          <div className="mt-3">
            <h2 className={"h2-bold text-dark100_light900"}>
              {result.user.name}
            </h2>
            <p className={"paragraph-regular text-dark200_light800"}>
              @{result.user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {result.user?.location && (
                <ProfileLink
                  imageUrl={"/assets/icons/location.svg"}
                  title={result.user?.location}
                />
              )}
              {result.user?.portfolioWebsite && (
                <ProfileLink
                  imageUrl={"/assets/icons/link.svg"}
                  href={result.user?.portfolioWebsite}
                  title={"Portfolio"}
                />
              )}
              {
                <ProfileLink
                  imageUrl={"/assets/icons/calendar.svg"}
                  title={convertDate(result.user?.joinedAt)}
                />
              }
            </div>
            {result.user?.bio && (
              <p className={"paragraph-regular text-dark400_light800 mt-8"}>
                {result.user?.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === result.user.clerkId && (
              <Link href={`/profile/edit`}>
                <Button
                  className={
                    "paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[176px] px-4 py-3"
                  }
                >
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={result.totalQuestions}
        totalAnswers={result.totalAnswers}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className={"background-light800_dark400 min-h-[42px] p-1"}>
            <TabsTrigger autoFocus className={"tab "} value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className={"tab"} value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              userId={result.user._id}
              searchParams={searchParams}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className={"flex w-full flex-col gap-6"}>
            <AnswerTab
              userId={result.user._id}
              searchParams={searchParams}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
