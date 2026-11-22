export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "light",
  align = "left",
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow ? (
        <p data-reveal className={`eyebrow ${tone === "dark" ? "text-mist" : "text-red-deep"} ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>
      ) : null}
      <Tag data-reveal style={{ ["--reveal-delay" as string]: "80ms" }} className={`${Tag === "h1" ? "display-lg" : "display-md"} mt-4`}>
        {title}
      </Tag>
      {lede ? (
        <p data-reveal style={{ ["--reveal-delay" as string]: "160ms" }} className={`lede mt-5 ${tone === "dark" ? "text-mist" : "text-steel-2"}`}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
