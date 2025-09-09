import Link from "next/link";

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  href,
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  let baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  let variantClasses = "";
  if (variant === "default") {
    variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
  } else if (variant === "outline") {
    variantClasses =
      "border border-input hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "secondary") {
    variantClasses =
      "bg-secondary text-secondary-foreground hover:bg-secondary/80";
  } else if (variant === "ghost") {
    variantClasses = "hover:bg-accent hover:text-accent-foreground";
  }

  let sizeClasses = "";
  if (size === "default") sizeClasses = "h-10 py-2 px-4";
  else if (size === "sm") sizeClasses = "h-9 px-3 rounded-md";
  else if (size === "lg") sizeClasses = "h-11 px-8 rounded-md";

  // If href exists, render a Link
  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
