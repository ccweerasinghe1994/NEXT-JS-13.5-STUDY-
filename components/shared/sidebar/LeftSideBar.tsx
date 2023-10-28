"use client";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const LeftSideBar = () => {
  const pathName = usePathname();
  return (
    <section
      className={
        "background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]"
      }
    >
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            pathName === link.route ||
            (pathName.includes(link.route) && link.route.length > 0);
          return (
            <div key={link.route}>
              <Link
                href={link.route}
                className={`${
                  isActive
                    ? "primary-gradient rounded-lg text-light-900"
                    : "text-dark300_light900"
                } flex items-center justify-start gap-4 bg-transparent p-4 max-sm:justify-center max-sm:gap-0 max-sm:px-0`}
              >
                <Image
                  src={link.imgURL}
                  width={20}
                  height={20}
                  alt={link.label}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
                <p
                  className={`${
                    isActive ? "base-medium" : "base-bold"
                  } max-lg:hidden`}
                >
                  {link.label}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
      <SignedIn>
        <Button
          className={
            "small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3"
          }
        >
          <SignOutButton>Logout</SignOutButton>
        </Button>
      </SignedIn>
      <SignedOut>
        <div className={"flex flex-col gap-3"}>
          <Link href={"/sign-in"}>
            <Button
              className={
                "small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3"
              }
            >
              <Image
                src={"/assets/icons/account.svg"}
                alt={"account"}
                width={20}
                height={20}
                className={"invert-colors lg:hidden"}
              />
              <span className={"primary-text-gradient max-lg:hidden"}>
                Log In
              </span>
            </Button>
          </Link>

          <Link href={"/sign-up"}>
            <Button
              className={
                "small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3"
              }
            >
              <Image
                src={"/assets/icons/sign-up.svg"}
                alt={"sign up"}
                width={20}
                height={20}
                className={"invert-colors lg:hidden"}
              />
              <span className={"max-lg:hidden"}>Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSideBar;
