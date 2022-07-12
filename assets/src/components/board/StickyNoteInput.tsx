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
}

export default function StickyNoteInput(props: StickyNoteInputProps) {
  const { boardChannel } = useContext(BoardContext);
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
  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit(async (data) => {
    if (!boardChannel) {
      dispatch(
        logErrorMessage(
          "Submitting sticky note failed, try again or contact support - invalid board connection"
        )
      );
      return;
    }

    debug("Submit Sticky", data);

    try {
      const resp = await pushChannelAsync(boardChannel, "add_sticky", {
        title: data.note,
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
