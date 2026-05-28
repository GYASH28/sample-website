import {
  BadgeCheck,
  BadgeIndianRupee,
  Blocks,
  Cable,
  CircleDot,
  Factory,
  Flower2,
  Gem,
  Handshake,
  Heart,
  Layers,
  MapPinned,
  MessageCircle,
  PackageCheck,
  Paintbrush,
  Palette,
  ScrollText,
  ShieldCheck,
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
  Factory,
  Flower2,
  Gem,
  Handshake,
  Heart,
  Layers,
  MapPinned,
  MessageCircle,
  PackageCheck,
  Paintbrush,
  Palette,
  ScrollText,
  ShieldCheck,
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
