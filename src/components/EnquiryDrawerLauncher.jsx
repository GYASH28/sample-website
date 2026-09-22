import { ShoppingBagOpen } from "@phosphor-icons/react";
import { Suspense, lazy, useState } from "react";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
const EnquiryDrawer = lazy(() => import("./EnquiryDrawer.jsx"));

export default function EnquiryDrawerLauncher({ compact = false }) {
  const [open, setOpen] = useState(false);
  const { itemsCount } = useEnquiryBasket();

  return (
    <>
      <button
        type="button"
        className={compact ? "icon-button desktop-icon-action header-enquiry-launcher" : "enquiry-launcher"}
        onClick={() => setOpen(true)}
        aria-label={`Open enquiry basket with ${itemsCount} ${itemsCount === 1 ? "item" : "items"}`}
      >
        <ShoppingBagOpen size={20} />
        {compact ? null : <span>Enquiry list</span>}
        {itemsCount > 0 ? <strong className={compact ? "nav-count" : undefined}>{itemsCount > 99 ? "99+" : itemsCount}</strong> : null}
      </button>
      {open ? <Suspense fallback={null}><EnquiryDrawer open={open} onClose={() => setOpen(false)} /></Suspense> : null}
    </>
  );
}
