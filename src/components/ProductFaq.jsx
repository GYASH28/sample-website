import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./ProductFaq.module.css";

function faqIdPart(value) {
  return String(value)
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductFaq({ productSlug, faqs }) {
  const [openState, setOpenState] = useState({
    productSlug,
    index: null,
  });
  const openIndex =
    openState.productSlug === productSlug ? openState.index : null;
  const idBase = `product-faq-${faqIdPart(productSlug)}`;

  const toggle = (index) => {
    setOpenState((current) => ({
      productSlug,
      index:
        current.productSlug === productSlug && current.index === index
          ? null
          : index,
    }));
  };

  return (
    <div className={styles.group} data-product-faq>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${idBase}-question-${index}`;
        const panelId = `${idBase}-answer-${index}`;

        return (
          <div
            key={`${productSlug}-${faq.q}`}
            className={`${styles.item} faq-item-accordion`}
            data-open={isOpen ? "true" : "false"}
          >
            <button
              id={buttonId}
              type="button"
              className={`${styles.question} faq-question-toggle-btn`}
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span>{faq.q}</span>
              <span className={styles.caret} aria-hidden="true">
                <CaretDown size={17} weight="bold" />
              </span>
            </button>
            <div
              id={panelId}
              className={`${styles.panel} faq-answer-collapsible`}
              data-open={isOpen ? "true" : "false"}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              inert={!isOpen}
            >
              <div className={styles.answerClip}>
                <div
                  className={`${styles.answer} faq-answer-content-inner`}
                >
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
