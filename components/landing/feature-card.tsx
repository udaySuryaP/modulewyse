type FeatureCardProps = {
  label: string;
  title: string;
  description: string;
};

export function FeatureCard({ label, title, description }: FeatureCardProps) {
  return (
    <article className="mw-card mw-card-hover p-5 sm:p-6">
      <p className="mw-label">
        {label}
      </p>
      <h2 className="mt-5 text-[20px] font-medium leading-[1.25] text-[var(--mw-ink)]">
        {title}
      </h2>
      <p className="mt-3 text-[14px] font-normal leading-[1.5] text-[var(--mw-body)]">
        {description}
      </p>
    </article>
  );
}
