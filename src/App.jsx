import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Enquiry from "./pages/Enquiry.jsx";
import Gallery from "./pages/Gallery.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="enquiry" element={<Enquiry />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
