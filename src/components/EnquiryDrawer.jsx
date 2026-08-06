import {
  ArrowRight,
  ChatCircleDots,
  ShoppingBagOpen,
  Trash,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  businessInfo,
  createWhatsAppLink,
} from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";

export default function EnquiryDrawer({ open, onClose }) {
  const { basket, itemsCount, remove, clear } = useEnquiryBasket();

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add("commerce-drawer-open");

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("commerce-drawer-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const whatsappLink = useMemo(() => {
    if (!basket.length) return createWhatsAppLink();
    const lines = basket.map((item, index) => {
      const shade = item.shade?.name ? `, shade: ${item.shade.name}` : "";
      const variant = item.variant ? `, variant: ${item.variant}` : "";
      return `${index + 1}. ${item.name} — ${item.quantity} ${item.unit || "pcs"}${shade}${variant}`;
    });
    const message = [
      `Hello ${businessInfo.shortName}, I would like availability and quantity-based pricing for:`,
      "",
      ...lines,
      "",
      "Please confirm current shades, pack details, delivery charges and expected dispatch time.",
    ].join("\n");
    return createWhatsAppLink(message);
  }, [basket]);

  return (
    <>
      <button
        type="button"
        className={`enquiry-drawer-backdrop ${open ? "is-open" : ""}`}
        aria-label="Close enquiry basket"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={`enquiry-drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Enquiry basket"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="enquiry-drawer__header">
          <div>
            <span className="eyebrow">Saved enquiry</span>
            <h2>Your material list</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close enquiry basket">
            <X size={23} />
          </button>
        </div>

        {basket.length ? (
          <>
            <div className="enquiry-drawer__items">
              {basket.map((item, index) => (
                <article className="enquiry-drawer__item" key={`${item.slug}-${item.shade?.name || "default"}-${item.variant || "standard"}`}>
                  <img src={item.image} alt="" width="76" height="76" loading="lazy" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.category}</span>
                    <small>
                      {item.quantity} {item.unit || "pcs"}
                      {item.shade?.name ? ` · ${item.shade.name}` : ""}
                      {item.variant ? ` · ${item.variant}` : ""}
                    </small>
                  </div>
                  <button type="button" onClick={() => remove(index)} aria-label={`Remove ${item.name}`}>
                    <Trash size={17} />
                  </button>
                </article>
              ))}
            </div>

            <div className="enquiry-drawer__summary">
              <span>{itemsCount} material {itemsCount === 1 ? "line" : "lines"}</span>
              <button type="button" onClick={clear}>Clear list</button>
            </div>

            <div className="enquiry-drawer__actions">
              <Link className="btn btn-outline" to="/enquiry" onClick={onClose}>
                Review enquiry <ArrowRight size={17} />
              </Link>
              <a className="btn btn-primary" href={whatsappLink} target="_blank" rel="noreferrer">
                <ChatCircleDots size={18} /> Send on WhatsApp
              </a>
            </div>
            <p className="enquiry-drawer__note">
              This is not a payment cart. Fakhri Mart confirms live shades, quantity-based pricing and delivery before the order is final.
            </p>
          </>
        ) : (
          <div className="enquiry-drawer__empty">
            <ShoppingBagOpen size={48} />
            <h3>Your enquiry list is empty</h3>
            <p>Add products while browsing, then send one organised WhatsApp request instead of typing every item again.</p>
            <Link className="btn btn-primary" to="/products" onClick={onClose}>
              Browse catalogue <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
