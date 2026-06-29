"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  getPressButtonMotion,
  getPressButtonVariant,
  type PressButtonVariant,
} from "./pressButtonConfig";

type BaseProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: PressButtonVariant;
};

type LinkButtonProps = BaseProps &
  Omit<ComponentProps<typeof Link>, "children" | "className"> & {
    href: string;
  };

type NativeButtonProps = BaseProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className" | "disabled"
  > & {
    href?: undefined;
  };

type PressButtonProps = LinkButtonProps | NativeButtonProps;

export default function PressButton(props: PressButtonProps) {
  if ("href" in props && props.href) {
    const {
      variant = "primary",
      children,
      className = "",
      disabled = false,
      href,
      ...linkProps
    } = props;
    const buttonVariant = getPressButtonVariant(variant);
    const motionState = getPressButtonMotion(variant, disabled);
    const buttonClassName = twMerge(
      "inline-flex cursor-pointer items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-semibold",
      "transition-colors duration-150",
      "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
      buttonVariant.base,
      className,
    );

    return (
      <Link href={href} {...linkProps}>
        <motion.span
          aria-disabled={disabled}
          className={buttonClassName}
          style={{ boxShadow: buttonVariant.shadow }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          whileHover={motionState.whileHover}
          whileTap={motionState.whileTap}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  const {
    variant = "primary",
    children,
    className = "",
    disabled = false,
    type = "button",
    onClick,
    ...buttonProps
  } = props;
  const buttonVariant = getPressButtonVariant(variant);
  const motionState = getPressButtonMotion(variant, disabled);
  const buttonClassName = twMerge(
    "inline-flex cursor-pointer items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-semibold",
    "transition-colors duration-150",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
    buttonVariant.base,
    className,
  );

  return (
    <motion.button
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      style={{ boxShadow: buttonVariant.shadow }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      type={type}
      whileHover={motionState.whileHover}
      whileTap={motionState.whileTap}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
