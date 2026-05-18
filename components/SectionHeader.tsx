type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ee6224]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-zinc-950 dark:text-orange-50 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-zinc-650 dark:text-orange-100/80">
          {description}
        </p>
      ) : null}
    </div>
  );
}
