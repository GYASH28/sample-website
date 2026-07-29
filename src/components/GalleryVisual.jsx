const imageByType = {
  balls: "/assets/images/cat_ganga.webp",
  spools: "/assets/images/cat_bliss.webp",
  cords: "/assets/images/cat_macrame.webp",
  shade: "/assets/images/cat_embroidery.webp",
  tools: "/assets/images/cat_accessories.webp",
  beads: "/assets/images/cat_beads.webp",
  purse: "/assets/images/editorial/crochet-bag-worktable.webp",
  stock: "/assets/images/editorial/craft-stock-room.webp",
};

export default function GalleryVisual({ item }) {
  return (
    <div className="gallery-visual">
      <img
        src={imageByType[item.type] || "/assets/images/editorial/shade-library.webp"}
        alt=""
        loading="lazy"
        width="720"
        height="540"
      />
    </div>
  );
}
