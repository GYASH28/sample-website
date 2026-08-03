import { WhatsappLogo } from "@phosphor-icons/react";

export default function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <WhatsappLogo
      size={size}
      className={className}
      weight="fill"
      aria-hidden="true"
    />
  );
}
