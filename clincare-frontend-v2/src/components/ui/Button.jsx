import { Loader2 } from "lucide-react";

/**
 * Botón base del sistema de diseño. Nuevas variantes/tamaños se agregan
 * por composición de clases, sin tener que tocar los usos existentes
 * (principio Abierto/Cerrado).
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  className = "",
  children,
  disabled,
  ...props
}) {
  const variantClass =
    {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      "danger-ghost": "btn-danger-ghost",
    }[variant] || "btn-primary";

  const sizeClass = size === "sm" ? "btn-sm" : "";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="spin-icon" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
}
