import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Theme from "@/components/shared/navbar/Theme";

type TNavBar = {};
const NavBar: FC<TNavBar> = () => {
  return (
    <nav
      className={
        "flex-between background-light900_dark200 fixed z-50 flex w-full gap-5  p-6 shadow-light-300 dark:shadow-none sm:px-12"
      }
    >
      <Link href={"/"} className={"flex items-center gap-1"}>
        <Image
          src={"/assets/images/site-logo.svg"}
          width={23}
          height={23}
          alt={"StackFlow"}
        />
        <p
          className={
            "h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden"
          }
        >
          Stack <span className={"text-primary-500"}>Flow</span>
        </p>
      </Link>
      {/*  GLOBAL SEARCH COMPONENT */}
      <div className={"flex-between gap-5"}>
        <Theme />
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
            afterSignOutUrl="/"
          />
        </SignedIn>
        {/* Mobile Navigation */}
      </div>
    </nav>
  );
};

export default NavBar;
