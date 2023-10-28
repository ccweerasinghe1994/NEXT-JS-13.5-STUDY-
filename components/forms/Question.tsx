"use client";
import React, { FC, KeyboardEvent, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema, TQuestionsSchema } from "@/lib/validations";
import { Editor } from "@tinymce/tinymce-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";

type TQuestionProps = {};

const formType = "edit";

const Question: FC<TQuestionProps> = () => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const editorRef = useRef(null);
  const form = useForm<TQuestionsSchema>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };
  // 2. Define a submit handler.
  async function onSubmit(values: TQuestionsSchema) {
    setIsFormSubmitting(true);

    try {
      console.log(values);
      await createQuestion({});
    } catch (error) {
    } finally {
      setIsFormSubmitting(false);
    }
  }

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<TQuestionsSchema, "tags">,
  ) => {
    if (event.key === "Enter" && field.name === "tags") {
      event.preventDefault();
      const tagInput = event.target as HTMLInputElement;
      const value = tagInput.value.trim();

      if (value !== "") {
        if (value.length > 15) {
          return form.setError("tags", {
            type: "maxLength",
            message: "Tag length must be less than 15 characters",
          });
        }
        if (!field.value.includes(value as never)) {
          form.setValue("tags", [...field.value, value]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger("tags");
      }
    }
  };
  const handleTagRemove = (
    tag: string,
    field: ControllerRenderProps<TQuestionsSchema, "tags">,
  ) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className={"flex w-full flex-col"}>
              <FormLabel
                className={"paragraph-semibold text-dark400_light800 "}
              >
                Question Title <span className={"text-primary-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Input
                  className={
                    "no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  {...field}
                />
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Be specific and imagine you’re asking a question from another
                person
              </FormDescription>
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
          name="explanation"
          render={({ field }) => (
            <FormItem className={"flex w-full flex-col gap-3"}>
              <FormLabel
                className={"paragraph-semibold text-dark400_light800 "}
              >
                Detail explanation of your problem
                <span className={"text-primary-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link image",
                      "charmap",
                      "preview anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | codesample | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist",
                    content_style: "body { font-family:Inter; font-size:16px }",
                  }}
                />
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Introduce the problem and expand on what you want to put in the
                title Minimum 20 characters
              </FormDescription>
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
          name="tags"
          render={({ field }) => (
            <FormItem className={"flex w-full flex-col"}>
              <FormLabel
                className={"paragraph-semibold text-dark400_light800 "}
              >
                Question Title <span className={"text-primary-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <>
                  <Input
                    className={
                      "no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    }
                    placeholder={'Add tags (e.g. "javascript" "react")'}
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className={"flex-start mt-2.5 gap-2.5"}>
                      {field.value.map((tag) => {
                        return (
                          <Badge
                            key={tag}
                            className={
                              "subtle-medium background-light800_dark300 text-dark400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                            }
                            onClick={() => handleTagRemove(tag, field)}
                          >
                            {tag}
                            <Image
                              src={"/assets/icons/close.svg"}
                              alt={"close icons"}
                              width={16}
                              height={16}
                              className={
                                "cursor-pointer object-contain invert-0 dark:invert"
                              }
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage
                className={
                  "rounded bg-red-500/10 py-2 text-center text-red-500"
                }
              />
            </FormItem>
          )}
        />

        <Button
          className={"primary-gradient w-fit text-light-900"}
          type="submit"
          disabled={isFormSubmitting}
        >
          {isFormSubmitting ? (
            <> {formType === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{formType === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
