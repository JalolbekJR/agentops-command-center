import Link from "next/link";

export function ActionButton({
  children,
  disabled,
  className = "",
  href,
  onClick,
  variant = "secondary"
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}) {
  const actionClassName = [
    variant === "primary" ? "primary-action" : "secondary-action",
    "disabled:opacity-55",
    className
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    return (
      <Link href={href} className={actionClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={actionClassName}
    >
      {children}
    </button>
  );
}
