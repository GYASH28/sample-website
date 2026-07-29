/**
 * Lightweight compatibility wrapper kept for existing imports.
 * Motion is handled by CSS reveal utilities so this component adds no runtime.
 */
export const staggerChild = {};

export default function StaggerReveal({
  children,
  className = "",
  as = "div",
}) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
