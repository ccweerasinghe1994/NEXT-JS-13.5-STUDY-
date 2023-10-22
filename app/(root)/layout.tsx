import { FC, ReactNode } from "react";
import NavBar from "@/components/shared/navbar/NavBar";

type TLayout = {
  children: ReactNode;
};

const Layout: FC<TLayout> = ({ children }) => {
  return (
    <main className={"background-light850_dark100 relative"}>
      <NavBar />
      <div className="flex">
        LEFT SIDE BAR
        <section
          className={
            "flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14"
          }
        >
          <div className={"mx-auto w-full max-w-5xl"}>{children}</div>
        </section>
        Right Side Bar
      </div>
      Toaster
    </main>
  );
};

export default Layout;
