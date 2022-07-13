import React from "react";
import { useForm, useWatch } from "react-hook-form";

interface BoardTimerProps {}

export default function BoardTimer(props: BoardTimerProps) {
  const { register, control } = useForm<{ seconds: number }>({
    defaultValues: {
      seconds: 60,
    },
  });

  const watchSeconds = useWatch({ control, name: "seconds" });

  return <div></div>;
}
