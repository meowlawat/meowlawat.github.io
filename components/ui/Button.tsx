import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const base =
  "group inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ease-settle focus-visible:outline-none";

const variants = {
  filled: "bg-button text-button-foreground hover:bg-button-hover",
  outline: "border border-border-strong text-foreground hover:border-accent hover:text-accent",
} as const;

function Icon({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <ArrowUpRight className="size-4 transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  );
}

type Variant = keyof typeof variants;

export function Button({
  variant = "filled",
  icon = true,
  className,
  children,
  ...props
}: {
  variant?: Variant;
  icon?: boolean;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn(base, variants[variant], className)} {...props}>
      {children}
      <Icon show={icon} />
    </button>
  );
}

export function LinkButton({
  variant = "filled",
  icon = true,
  external,
  className,
  children,
  ...props
}: {
  variant?: Variant;
  icon?: boolean;
  external?: boolean;
  className?: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(base, variants[variant], className)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
      <Icon show={icon} />
    </a>
  );
}
