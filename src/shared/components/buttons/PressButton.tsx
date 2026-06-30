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
    const shouldFillWidth = /\bw-full\b/.test(className);
    const buttonClassName = twMerge(
      "inline-flex select-none items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-semibold touch-manipulation",
      "transition-colors duration-150 [-webkit-tap-highlight-color:transparent]",
      "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
      buttonVariant.base,
      className,
    );

    return (
      <Link className={shouldFillWidth ? "w-full" : undefined} href={href} {...linkProps}>
        <motion.span
          aria-disabled={disabled}
          className={buttonClassName}
          style={{ boxShadow: buttonVariant.shadow }}
          transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.9 }}
          whileHover={motionState.whileHover}
          whileTap={motionState.whileTap}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  const nativeProps = props as NativeButtonProps;
  const {
    variant = "primary",
    children,
    className = "",
    disabled = false,
    type = "button",
    onClick,
    ...buttonProps
  } = nativeProps;
  const buttonVariant = getPressButtonVariant(variant);
  const motionState = getPressButtonMotion(variant, disabled);
  const shouldFillWidth = /\bw-full\b/.test(className);
  const buttonClassName = twMerge(
    "inline-flex select-none items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-semibold touch-manipulation",
    "transition-colors duration-150 [-webkit-tap-highlight-color:transparent]",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
    buttonVariant.base,
    className,
  );

  return (
    <button
      className={twMerge(
        "cursor-pointer rounded-[10px] border-0 bg-transparent p-0 disabled:cursor-not-allowed",
        shouldFillWidth ? "w-full" : "",
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...buttonProps}
    >
      <motion.span
        className={buttonClassName}
        style={{ boxShadow: buttonVariant.shadow }}
        transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.9 }}
        whileHover={motionState.whileHover}
        whileTap={motionState.whileTap}
      >
        {children}
      </motion.span>
    </button>
  );
}
