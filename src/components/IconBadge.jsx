import {
  ChatCircleDots,
  Circle,
  CurrencyInr,
  Diamond,
  Handshake,
  Heart,
  LinkSimpleHorizontal,
  MagicWand,
  PaintBrush,
  Palette,
  Scroll,
  SealCheck,
  ShoppingBag,
  Sparkle,
  SquaresFour,
  Stack,
  Storefront,
  Swatches,
  Truck,
  TShirt,
  Waves,
} from "@phosphor-icons/react";

const icons = {
  BadgeCheck: SealCheck,
  BadgeIndianRupee: CurrencyInr,
  Blocks: SquaresFour,
  Cable: LinkSimpleHorizontal,
  CircleDot: Circle,
  Gem: Diamond,
  Handshake,
  Heart,
  Layers: Stack,
  MessageCircle: ChatCircleDots,
  Paintbrush: PaintBrush,
  Palette,
  ScrollText: Scroll,
  Shirt: TShirt,
  ShoppingBag,
  Sparkles: Sparkle,
  Store: Storefront,
  SwatchBook: Swatches,
  Truck,
  WandSparkles: MagicWand,
  Waves,
};

export default function IconBadge({ name = "Sparkles", tone = "teal" }) {
  const Icon = icons[name] || Sparkle;

  return (
    <span className={`icon-badge tone-${tone}`} aria-hidden="true">
      <Icon size={22} weight="regular" />
    </span>
  );
}
