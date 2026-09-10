type BrandMarkProps = {
  className?: string;
};

/**
 * Temporary text mark. Replace this component with the approved DNS SVG asset
 * when the corporate export is added to the repository.
 */
export default function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      aria-label="DNS"
      className={`brand-mark ${className}`.trim()}
      data-brand-source="temporary-text-mark"
      role="img"
    >
      <span aria-hidden="true">DNS</span>
    </span>
  );
}
