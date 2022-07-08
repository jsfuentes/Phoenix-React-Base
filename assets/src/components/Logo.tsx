import classNames from "classnames";
import React from "react";
import logo from "src/img/logo.png";

interface LogoProps {
  showName?: boolean;
  isWhite?: boolean;
  logo?: string;
  name?: string;
  className?: string;
  imgClassName?: string;
  unclickable?: boolean;
  urlOnClick?: string;
}

Logo.defaultProps = {
  showName: true,
  unclickable: false,
  urlOnClick: "/",
};

export default function Logo(props: LogoProps) {
  const className = classNames({
    "flex items-center": true,
    "text-white": props.isWhite,
    [props.className || ""]: props.className,
    "cursor-default": props.unclickable,
  });

  //if name given, don't show Clayboard logo
  const logoSrc = props.logo ? props.logo : !props.name && logo;

  return (
    <a className={className} href={props.unclickable ? "#" : props.urlOnClick}>
      {/* if has name. dont show logo */}
      {logoSrc && (
        <img
          className={classNames({
            "w-7 h-7": true,
            [props.imgClassName || ""]: props.imgClassName,
          })}
          src={logoSrc}
          alt="Organizer Logo"
          referrerPolicy="no-referrer"
        />
      )}
      {props.showName && (
        <span className="font-medium text-base ml-2.5">
          {props.name || "Clayboard"}
        </span>
      )}
    </a>
  );
}
