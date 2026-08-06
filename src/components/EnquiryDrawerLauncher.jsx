import { ShoppingBagOpen } from "@phosphor-icons/react";
import { useState } from "react";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import EnquiryDrawer from "./EnquiryDrawer.jsx";

export default function EnquiryDrawerLauncher() {
  const [open, setOpen] = useState(false);
  const { itemsCount } = useEnquiryBasket();

  return (
    <>
      <button
        type="button"
        className="enquiry-launcher"
        onClick={() => setOpen(true)}
        aria-label={`Open enquiry basket with ${itemsCount} ${itemsCount === 1 ? "item" : "items"}`}
      >
        <ShoppingBagOpen size={20} />
        <span>Enquiry list</span>
        {itemsCount > 0 ? <strong>{itemsCount > 99 ? "99+" : itemsCount}</strong> : null}
      </button>
      <EnquiryDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
