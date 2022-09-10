import classNames from "classnames";
import { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import Button from "src/components/Button";
import TextBorderlessInput from "src/components/Form/TextBorderlessInput";
import Modal from "src/components/Modal";
import UserContext from "src/contexts/UserContext";

interface BoardJoinModalProps {
  isOpen: boolean;
}

export default function BoardJoinModal(props: BoardJoinModalProps) {
  const { user, updateUser } = useContext(UserContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const onFormSubmit = useCallback(
    async (data: { name: string }) => {
      if (updateUser && user?.id) {
        await updateUser({ ...user, name: data.name });
      }
    },
    [updateUser, user]
  );

  return (
    <Modal
      isOpen={props.isOpen}
      hideX={false}
      className={classNames({
        "py-0 px-0 h-full max-w-full max-h-full overflow-hidden bg-transparent w-full":
          true,
      })}
      shouldCloseOnOverlayClick={false}
      shouldDarkenBackground={true}
      zLevel="super"
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={classNames({
          "flex justify-center w-full items-center overflow-hidden h-full relative":
            true,
        })}
      >
        <div className="-mt-24 px-6 py-6 bg-white rounded-2xl w-full max-w-lg eta-overflow-y-scroll">
          <div className="flex flex-col flex-none">
            <div
              className={classNames({
                "mb-4 text-lg font-medium text-black opacity-60": true,
              })}
            >
              Welcome, what's your full name?
            </div>
          </div>
          <TextBorderlessInput
            className="w-full text-4xl text-gray-800"
            name={"name"}
            disabled={false}
            placeholder={"Carly Clayboard"}
            textColorCls={
              "text-gray-800 focus:text-gray-800 hover:text-gray-700"
            }
            register={register}
            required
            errors={errors}
            autoFocus={true}
          />
          <div className="mt-7">
            <Button
              fullWidth
              type="submit"
              variant={"primary"}
              size="lg"
              className="rounded-xl"
              disabled={false}
              disabledClassName="py-4"
              icon="bx bx-right-arrow-alt mt-0.5 ml-1 arrow-right-animate"
            >
              Enter Session
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
