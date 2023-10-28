import Question from "@/components/forms/Question";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";

const AskQuestionPage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  console.table(mongoUser);
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify("653c791cc9e6e4ed1b36e755")} />
      </div>
    </div>
  );
};

export default AskQuestionPage;
