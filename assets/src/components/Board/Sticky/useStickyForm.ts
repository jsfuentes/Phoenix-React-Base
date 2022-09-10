import { useForm } from "react-hook-form";

export default function useStickyForm(
  props: {
    title?: string;
    description?: string;
  } = {}
) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<{ title: string; description: string }>({
    defaultValues: {
      title: props.title || "",
      description: props.description || "",
    },
  });

  return { register, handleSubmit, setValue, reset, errors, clearErrors };
}
