// src/App.jsx
// Route definitions. All routes are code-split via React.lazy.
// Vendor chunks (react-vendor, motion-vendor) are split in vite.config.js.

import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { useJsonLd, localBusinessJsonLd } from "./hooks/useJsonLd.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const Catalogue = lazy(() => import("./pages/Catalogue.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Enquiry = lazy(() => import("./pages/Enquiry.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function SiteMeta() {
  useJsonLd(localBusinessJsonLd());
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <SiteMeta />
        <Layout />
      </>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Catalogue /> },
      { path: "products/:slug", element: <ProductDetail /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "enquiry", element: <Enquiry /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
