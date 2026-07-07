// src/components/ErrorBoundary.jsx
// Phase 6 item 7: ErrorBoundary — catches render errors, shows friendly fallback.
// Wraps <Routes> in App.jsx so a single page crash doesn't blank the whole app.

import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontFamily: "var(--font-display, serif)", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "var(--muted, #544C43)", marginBottom: "2rem", maxWidth: "400px" }}>
            An unexpected error occurred. Try refreshing the page, or go back to the home page.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "var(--teal-dark, #14766F)",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
