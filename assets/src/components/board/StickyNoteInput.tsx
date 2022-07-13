import classNames from "classnames";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Button from "src/components/Button";
import BoardContext from "src/contexts/BoardContext";
import { useAppDispatch } from "src/redux/hooks";
import { logChannelPushError, logErrorMessage } from "src/redux/notification";
import { pushChannelAsync } from "src/utils/channel/channel";
const debug = require("debug")("app:StickyNoteInput");

interface StickyNoteInputProps {
  className?: string;
  fullRounding?: boolean;
  stickyGroup?: StickyGroup;
}

export default function StickyNoteInput(props: StickyNoteInputProps) {
  const { boardChannel } = useContext(BoardContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ title: string; description: string }>({
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit(async (data) => {
    debug("Submit Sticky", data);

    if (!boardChannel) {
      dispatch(
        logErrorMessage(
          "Submitting sticky note failed, try again or contact support - invalid board connection"
        )
      );
      return;
    }

    try {
      const resp = await pushChannelAsync(boardChannel, "add_sticky", {
        title: data.title,
        description: data.description,
      });
      debug("add_sticky resp", resp);
    } catch (err) {
      dispatch(logChannelPushError(err, "Submitting Sticky"));
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className={classNames({
        [props.className || ""]: props.className,
        "rounded-lg": props.fullRounding,
        "rounded-t-lg": !props.fullRounding,
        "w-96 h-56 overflow-hidden bg-sticky rounded-t-lg flex flex-col justify-between shadow-xl":
          true,
      })}
    >
      {/* TODO: match background to group color */}
      {props.stickyGroup && (
        <div className={"bg-pink-100 px-4 py-1 text-pink-800"}>
          <span className={"text-pink-800/[0.5]"}>Add to </span>
          <span>{props.stickyGroup.title}</span>
        </div>
      )}
      <div className={"p-3 w-full flex-1"}>
        <input
          {...register("title", { required: true })}
          placeholder={"Type idea here..."}
          className="w-full text-gray-700 text-2xl font-medium block bg-transparent resize-none border-none focus:border-none focus:ring-transparent outline-none focus:outline-none placeholder-gray-700/[.40] py-1 px-3 rounded-md"
        />
        <textarea
          {...register("description")}
          placeholder={"Description (optional)"}
          className="w-full text-gray-700 font-medium block bg-transparent resize-none border-none focus:border-none focus:ring-transparent outline-none focus:outline-none placeholder-gray-700/[.40] py-1 px-3 rounded-md"
        />
        {/*{errors.note?.type === "required" && "This is required"}*/}
        <Button
          type="submit"
          variant="primary"
          className="mt-2 self-start"
          size="xl"
        >
          Add Idea
        </Button>
      </div>
    </form>
  );
}
