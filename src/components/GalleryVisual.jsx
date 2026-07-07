export default function GalleryVisual({ item }) {
  return (
    <div className={`gallery-visual gallery-visual--${item.type}`} aria-hidden="true">
      {item.colors.map((color, index) => (
        <span key={`${item.title}-${color}`} style={{ "--gallery-color": color, "--i": index }} />
      ))}
      <div className="gallery-overlay">
        <small>View Range</small>
      </div>
    </div>
  );
}
