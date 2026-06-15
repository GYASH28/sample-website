import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * SmartLink — handles both internal routes and hash-anchored navigation
 * without full page reloads. If the target is a hash on the current page,
 * it smooth-scrolls to the element. If the target is a different route
 * (with or without a hash), it navigates via react-router and lets
 * ScrollToTop in Layout.jsx handle the hash scroll after mount.
 */
export default function SmartLink({ to, className, onClick, children, ...rest }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse the `to` value
  const hasHash = typeof to === "string" && to.includes("#");
  const [pathname, hash] = hasHash ? to.split("#") : [to, ""];
  const targetPath = pathname || "/";

  const handleClick = useCallback(
    (event) => {
      // Let external onClick handler run (e.g., close mobile menu)
      if (onClick) onClick(event);

      if (!hasHash) return; // Normal Link behaviour for non-hash routes

      event.preventDefault();

      const isSamePage =
        location.pathname === targetPath ||
        (targetPath === "/" && location.pathname === "/");

      if (isSamePage && hash) {
        // Same page → smooth scroll to the element
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // Different page → navigate via router, hash will be handled by ScrollToTop
        navigate(`${targetPath}#${hash}`);
      }
    },
    [hasHash, hash, targetPath, location.pathname, navigate, onClick],
  );

  return (
    <Link to={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
