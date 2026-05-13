import {
  BadgeCheck,
  Boxes,
  Cable,
  Cog,
  Factory,
  Flower2,
  Gem,
  PackageCheck,
  Palette,
  Scissors,
  ShieldCheck,
  Shirt,
  Sparkles,
  Store,
  Triangle,
} from "lucide-react";

const icons = {
  BadgeCheck,
  Boxes,
  Cable,
  Cog,
  Factory,
  Flower2,
  Gem,
  PackageCheck,
  Palette,
  Scissors,
  ShieldCheck,
  Shirt,
  Sparkles,
  Store,
  Triangle,
};

export default function IconBadge({ name = "Sparkles", tone = "gold" }) {
  const Icon = icons[name] || Sparkles;

  return (
    <span className={`icon-badge tone-${tone}`} aria-hidden="true">
      <Icon size={22} strokeWidth={1.9} />
    </span>
  );
}
