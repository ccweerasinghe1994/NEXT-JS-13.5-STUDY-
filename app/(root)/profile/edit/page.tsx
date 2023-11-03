import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { FC } from "react";
import { URLProps } from "@/types/types";
import Profile from "@/components/forms/Profile";

const Page: FC<URLProps> = async ({ params, searchParams }) => {
  const { userId } = auth();

  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  if (!mongoUser) return null;

  return (
    <>
      <h1 className={"h1-bold text-dark100_light900"}>Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default Page;
