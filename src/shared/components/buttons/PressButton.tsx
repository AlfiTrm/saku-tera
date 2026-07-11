"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  MouseEvent,
  ReactNode,
} from "react";
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
    "children" | "className" | "disabled" | "onClick"
  > & {
    href?: undefined;
    onClick?: (
      event: MouseEvent<HTMLButtonElement>,
    ) => void | Promise<unknown>;
  };

type PressButtonProps = LinkButtonProps | NativeButtonProps;

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

export default function PressButton(props: PressButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const isPendingRef = useRef(false);

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
  const isDisabled = disabled || isPending;
  const buttonVariant = getPressButtonVariant(variant);
  const motionState = getPressButtonMotion(variant, isDisabled);
  const shouldFillWidth = /\bw-full\b/.test(className);
  const buttonClassName = twMerge(
    "inline-flex select-none items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-semibold touch-manipulation",
    "transition-colors duration-150 [-webkit-tap-highlight-color:transparent]",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
    buttonVariant.base,
    isDisabled ? "cursor-not-allowed opacity-55 shadow-none" : "",
    className,
  );

  function releasePending() {
    isPendingRef.current = false;
    setIsPending(false);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled || isPendingRef.current) {
      event.preventDefault();
      return;
    }

    if (!onClick) {
      return;
    }

    isPendingRef.current = true;
    setIsPending(true);

    try {
      const result = onClick(event);

      if (isPromiseLike(result)) {
        void Promise.resolve(result).finally(releasePending);
        return;
      }

      releasePending();
    } catch (error) {
      releasePending();
      throw error;
    }
  }

  return (
    <button
      aria-busy={isPending}
      className={twMerge(
        "cursor-pointer rounded-[10px] border-0 bg-transparent p-0 disabled:cursor-not-allowed",
        shouldFillWidth ? "w-full" : "",
      )}
      disabled={isDisabled}
      onClick={handleClick}
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
        {isPending ? (
          <span
            aria-hidden="true"
            className="mr-2 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : null}
        {children}
      </motion.span>
    </button>
  );
}
