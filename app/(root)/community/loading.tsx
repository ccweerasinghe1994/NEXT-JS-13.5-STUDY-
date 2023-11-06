import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className={"h1-bold text-dark100_light900"}>All Users</h1>
      <div className="mb-12 mt-11 grid gap-5 xs:grid-cols-1 md:grid-cols-4">
        <Skeleton
          className={"h-14 bg-slate-900/10 dark:bg-slate-700 md:col-span-3"}
        />
        <Skeleton className={"h-14 bg-slate-900/10 dark:bg-slate-700"} />
      </div>
      <div className="grid gap-y-5 xs:grid-cols-1 xs:justify-items-start  md:grid-cols-2 2xl:grid-cols-3">
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <Skeleton
            key={i}
            className={
              "h-[284px] w-[254px] rounded-2xl bg-slate-900/10 dark:bg-slate-700 "
            }
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;
