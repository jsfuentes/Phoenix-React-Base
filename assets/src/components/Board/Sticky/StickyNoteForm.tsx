import classNames from "classnames";
import React from "react";
import { toast } from "react-toastify";
import useStickyForm from "src/components/Board/Sticky/useStickyForm";
import Button from "src/components/Button";
import AutoExpandingTextArea from "src/components/Form/AutoExpandingTextArea";

const debug = require("debug")("app:StickyNoteForm");

interface StickyNoteFormProps {
  showCloseButton?: boolean;
  fullRounding?: boolean;
  className?: string;
  onClose?: () => void;
  stickyGroups?: string[];
  selectedStickyGroup?: string | null;
  setSelectedStickyGroup?: React.Dispatch<React.SetStateAction<string | null>>;
  onSubmit: (title: string, description: string) => Promise<void>;
  defaultVals?: {
    title?: string;
    description?: string;
  };
  onCancel?: () => void;
  resetOnSubmit?: boolean;
  isEdit?: boolean;
}

export default function StickyNoteForm(props: StickyNoteFormProps) {
  const { register, handleSubmit, setValue, reset, errors, clearErrors } =
    useStickyForm(props.defaultVals);

  const onSubmit = handleSubmit(
    async (data) => {
      debug("Submit Sticky", data);

      props.onSubmit(data.title, data.description);
      props.resetOnSubmit && reset();
    },
    async (err) => {
      if (err.title) {
        toast("You are missing a field. Please add an idea then try again!");
      }
    }
  );

  return (
    <form
      onSubmit={onSubmit}
      className={classNames({
        [props.className || ""]: props.className,
        "rounded-md": props.fullRounding,
        "rounded-t-md": !props.fullRounding,
        "bg-sticky rounded-t-md flex flex-col justify-between border border-gray-200 z-[100]":
          true,
      })}
      onKeyPress={(ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          onSubmit();
        }
      }}
    >
      {props.showCloseButton && (
        <div
          onClick={props.onClose}
          className="cursor-pointer flex items-center justify-center p-1 absolute right-0 top-0 bg-gray-900 rounded-full translate-x-1/2 -translate-y-1/2"
        >
          <i className="bx bx-x text-gray-200 tet-sm" />
        </div>
      )}

      <div className={"px-3 py-3 md:px-6 md:py-6 w-full flex-1 flex flex-col"}>
        <AutoExpandingTextArea
          suppressErrors={true}
          placeholder="Type idea here..."
          errors={errors}
          register={register}
          name="title"
          autoFocus={true}
          required={true}
          bottomBorder={false}
          textColorCls="text-gray-700 placeholder-gray-300"
          className="text-3xl font-medium "
        />
        {/*<input*/}
        {/*  {...register("title", { required: true })}*/}
        {/*  placeholder={"Type idea here..."}*/}
        {/*  className="w-full text-gray-700 text-2xl font-medium block bg-transparent resize-none border-none focus:border-none focus:ring-transparent outline-none focus:outline-none placeholder-gray-700/[.40] py-1 px-3 rounded-md"*/}
        {/*/>*/}
        <textarea
          {...register("description")}
          placeholder={"Description (optional)"}
          className="mt-3 w-full text-gray-500 block bg-transparent resize-none p-0 border-none focus:border-none focus:ring-transparent outline-none focus:outline-none placeholder-gray-300 flex-1  "
        />
        {/*{errors.note?.type === "required" && "This is required"}*/}
        <div className="flex gap-2">
          <Button
            type="submit"
            variant={"secondary"}
            className="mt-2 self-start !px-5 !py-3.5"
            size="xl"
          >
            {props.isEdit ? "Update Idea" : "Add Idea"}
          </Button>
          {props.onCancel && (
            <Button
              onClick={props.onCancel}
              variant="secondary"
              className="mt-2 self-start !px-5 !py-3.5"
              size="xl"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
