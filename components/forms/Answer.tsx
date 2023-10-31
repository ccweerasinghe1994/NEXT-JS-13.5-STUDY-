"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchema, TAnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Answer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const form = useForm<TAnswerSchema>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });
  const { theme } = useTheme();
  const handleCreateAnswer = async (data: TAnswerSchema) => {
    setIsSubmitting(true);
  };
  return (
    <div>
      <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className={
            "btn  light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
          }
        >
          <Image
            src={"/assets/icons/stars.svg"}
            alt={"AI image"}
            width={12}
            height={12}
            className={"object-contain "}
          />
          Generate AI Answer
        </Button>
      </div>
      <Form {...form}>
        <form
          className={"mt-6 flex w-full flex-col gap-10"}
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className={"flex w-full flex-col gap-3"}>
                <FormControl className={"mt-3.5"}>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
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
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: theme === "dark" ? "oxide-dark" : "oxide",
                      content_css: theme === "dark" ? "dark" : "default",
                    }}
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
          <div className="flex justify-end">
            <Button
              disabled={isSubmitting}
              type={"submit"}
              className={"primary-gradient w-fit text-white"}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
