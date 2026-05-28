type FeatureCardProps = {
  label: string;
  title: string;
  description: string;
};

export function FeatureCard({ label, title, description }: FeatureCardProps) {
  return (
    <article className="border-b border-[var(--mw-hairline)] bg-[var(--mw-surface-card)] p-[var(--mw-space-lg)] last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="mw-label">
        {label}
      </p>
      <h2 className="mw-heading-sm mt-[var(--mw-space-lg)] text-[var(--mw-ink)]">
        {title}
      </h2>
      <p className="mw-meta mt-[var(--mw-space-sm)]">
        {description}
      </p>
    </article>
  );
}
