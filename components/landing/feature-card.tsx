type FeatureCardProps = {
  label: string;
  title: string;
  description: string;
};

export function FeatureCard({ label, title, description }: FeatureCardProps) {
  return (
    <article className="rounded-[12px] border border-white/18 bg-white/12 p-5 backdrop-blur-[24px] sm:p-6">
      <p className="text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/52">
        {label}
      </p>
      <h2 className="mt-5 text-[20px] font-normal leading-[1.2] tracking-[-0.02em] text-white">
        {title}
      </h2>
      <p className="mt-3 text-[14px] font-normal leading-[1.45] tracking-[-0.01em] text-white/72">
        {description}
      </p>
    </article>
  );
}
