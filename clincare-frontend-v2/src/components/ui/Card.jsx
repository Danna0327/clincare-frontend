export function Card({ className = "", children, ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action, children }) {
  return (
    <div className="card-header">
      <h2>{title}</h2>
      {action}
      {children}
    </div>
  );
}
