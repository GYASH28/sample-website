// src/pages/NotFound.jsx
// 404 — small, on-brand, low priority.

import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

export default function NotFound() {
  useDocumentMeta({ title: "Page not found" });
  return (
    <div className="not-found">
      <div className="container">
        <h1>404</h1>
        <p>This page unravelled.</p>
        <Link to="/" className="btn btn-primary">Back to home →</Link>
      </div>
    </div>
  );
}
