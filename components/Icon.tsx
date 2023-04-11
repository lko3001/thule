import Link from "next/link";
import { ReactNode } from "react";

interface IconProps {
  link?: string;
  handleClick?: () => void;
  icon: ReactNode;
  parent?: string;
  child?: string;
  buttonType?: "button" | "submit" | "reset" | undefined;
}

export default function Icon({
  link,
  handleClick,
  icon,
  buttonType,
  parent,
  child,
}: IconProps) {
  const childClasses = child || " [&>*]:h-6 [&>*]:w-6";

  const classes = `hover:bg-blueberry/20 transition-colors duration-[150ms] p-2 rounded-full -mb-[1px] ${
    parent || ""
  } ${childClasses}`;

  if (link)
    return (
      <Link className={classes} href={link}>
        {icon}
      </Link>
    );

  return (
    <button
      className={classes}
      type={buttonType || "button"}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
}
