"use client";
import { FC, useState } from "react";
import { IUser } from "@/database/user.model";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileFormSchema, TProfileFormSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";

type TProfileProps = {
  clerkId: string;
  user: string;
};

const Profile: FC<TProfileProps> = ({ user, clerkId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedUser: IUser = JSON.parse(user);
  const router = useRouter();
  const pathName = usePathname();
  const form = useForm<TProfileFormSchema>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  const onSubmit = async (values: TProfileFormSchema) => {
    setIsSubmitting(true);

    try {
      await updateUser({
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        clerkId,
        path: pathName,
      });

      router.back();
      console.log(values);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
    console.log("submit");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={"mt-9 flex w-full flex-col gap-9"}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className={"space-y-3.5 "}>
              <FormLabel>
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className={
                    "text-dark300_light700 background-light700_dark300 no-focus paragraph-regular light-border-2 min-h-[56px] border"
                  }
                  placeholder="your name"
                  {...field}
                />
              </FormControl>
              <FormMessage
                className={
                  "rounded bg-red-500/10 py-2 text-center text-red-500"
                }
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className={"space-y-3.5 "}>
              <FormLabel>
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className={
                    "text-dark300_light700 background-light700_dark300 no-focus paragraph-regular light-border-2 min-h-[56px] border"
                  }
                  placeholder="your username"
                  {...field}
                />
              </FormControl>
              <FormMessage
                className={
                  "rounded bg-red-500/10 py-2 text-center text-red-500"
                }
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className={"space-y-3.5 "}>
              <FormLabel>Portfolio website</FormLabel>
              <FormControl>
                <Input
                  type={"url"}
                  className={
                    "text-dark300_light700 background-light700_dark300 no-focus paragraph-regular light-border-2 min-h-[56px] border"
                  }
                  placeholder="your portfolio URL"
                  {...field}
                />
              </FormControl>
              <FormMessage
                className={
                  "rounded bg-red-500/10 py-2 text-center text-red-500"
                }
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className={"space-y-3.5 "}>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  type={"text"}
                  className={
                    "text-dark300_light700 background-light700_dark300 no-focus paragraph-regular light-border-2 min-h-[56px] border"
                  }
                  placeholder="where are you from?"
                  {...field}
                />
              </FormControl>
              <FormMessage
                className={
                  "rounded bg-red-500/10 py-2 text-center text-red-500"
                }
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className={"space-y-3.5 "}>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  className={
                    "text-dark300_light700 background-light700_dark300 no-focus paragraph-regular light-border-2 min-h-[56px] border"
                  }
                  placeholder="what's your story?"
                  {...field}
                />
              </FormControl>
              <FormMessage
                className={
                  "rounded bg-red-500/10 py-2 text-center text-red-500"
                }
              />
            </FormItem>
          )}
        />
        <div className="mt-7 justify-end">
          <Button
            disabled={isSubmitting}
            className={"primary-gradient w-fit"}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
