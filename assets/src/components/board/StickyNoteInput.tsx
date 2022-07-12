import classNames from "classnames";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "src/components/Button";

interface StickyNoteInputProps {
  className?: string;
}

export default function StickyNoteInput(props: StickyNoteInputProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ note: string }>({
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log("THOMAS ", data.note);
  });

  return (
    <form
      onSubmit={onSubmit}
      className={classNames({
        [props.className || ""]: props.className,
        "w-96 h-48 absolute mx-auto bottom-0 left-0 right-0 bg-green-100 rounded-t-lg p-3 flex flex-col justify-between shadow-2xl":
          true,
      })}
    >
      <input
        {...register("note", { required: true })}
        placeholder={"Enter your name"}
        className="w-full text-green-800 text-2xl font-medium block bg-transparent resize-none border-none focus:border-none focus:ring-transparent outline-none focus:outline-none placeholder-green-800/[.40] py-1 px-3 rounded-md"
      />
      {/*{errors.note?.type === "required" && "This is required"}*/}
      <Button type="submit" variant="green" className="mt-2 w-full" size="xl">
        Add Idea
      </Button>
    </form>
  );
}
