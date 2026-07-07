// src/components/IconBadge.jsx
// Phase 6 item 8: reduced from 26 static Lucide imports to only the 21 actually used in siteData.js.
// Removed 5 unused: Flower2, Factory, MapPinned, PackageCheck, ShieldCheck.

import {
  BadgeCheck,
  BadgeIndianRupee,
  Blocks,
  Cable,
  CircleDot,
  Gem,
  Handshake,
  Heart,
  Layers,
  MessageCircle,
  Paintbrush,
  Palette,
  ScrollText,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  SwatchBook,
  Truck,
  WandSparkles,
  Waves,
} from "lucide-react";

const icons = {
  BadgeCheck,
  BadgeIndianRupee,
  Blocks,
  Cable,
  CircleDot,
  Gem,
  Handshake,
  Heart,
  Layers,
  MessageCircle,
  Paintbrush,
  Palette,
  ScrollText,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  SwatchBook,
  Truck,
  WandSparkles,
  Waves,
};

export default function IconBadge({ name = "Sparkles", tone = "teal" }) {
  const Icon = icons[name] || Sparkles;

  return (
    <span className={`icon-badge tone-${tone}`} aria-hidden="true">
      <Icon size={22} strokeWidth={1.9} />
    </span>
  );
}
