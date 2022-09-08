import classNames from "classnames";
import { useEffect, useState } from "react";
import Logo from "src/img/logo.png";

interface LoadingProps {
  full?: boolean;
  hasNoColor?: boolean;
  animateClass?: "heartBeat" | "animate-pulse";
}

Loading.defaultProps = {
  full: false,
  hasNoColor: false,
  animateClass: "heartBeat",
};

export default function Loading(props: LoadingProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={classNames({
        "flex justify-center items-center bg-transparent": true,
        "w-full h-full": props.full,
        "w-screen h-screen": !props.full,
      })}
    >
      {show && (
        <img
          className={`${props.animateClass} w-10 h-auto`}
          src={Logo}
          alt="Clayboard | The Simplest Webinar & Events Platform"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}
