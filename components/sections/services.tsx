import { TrackedLink } from "@/components/analytics/tracked-link";
import { LogoMark } from "@/components/brand/logo";
import { SectionShell } from "@/components/layout/section-shell";
import { services } from "@/content/services";

function ServiceSketch({ index }: { index: number }) {
  if (index === 3)
    return (
      <svg
        viewBox="0 0 160 72"
        aria-hidden
        className="h-16 w-36"
        fill="none"
        stroke="currentColor"
      >
        <rect x="24" y="8" width="108" height="14" />
        <rect x="24" y="29" width="108" height="14" />
        <rect x="24" y="50" width="108" height="14" />
        <circle cx="120" cy="15" r="2" fill="currentColor" />
        <circle cx="120" cy="36" r="2" fill="currentColor" />
        <circle cx="120" cy="57" r="2" fill="currentColor" />
      </svg>
    );
  if (index === 4)
    return (
      <svg
        viewBox="0 0 160 72"
        aria-hidden
        className="h-16 w-36"
        fill="none"
        stroke="currentColor"
      >
        <rect x="18" y="8" width="32" height="20" />
        <circle cx="86" cy="20" r="12" />
        <path d="M50 18h24M86 32v16m0 0-24 14m24-14 24 14" />
        <circle cx="60" cy="62" r="8" />
        <circle cx="112" cy="62" r="8" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 160 72"
      aria-hidden
      className="h-16 w-36"
      fill="none"
      stroke="currentColor"
    >
      <rect x="12" y="8" width="136" height="56" />
      <path d="M12 20h136M50 20v44" />
      <circle cx="20" cy="14" r="1.8" fill="currentColor" />
      <circle cx="28" cy="14" r="1.8" fill="currentColor" />
      <path
        d={
          index === 1
            ? "M62 34h70M62 43h52M62 52h62"
            : index === 2
              ? "M66 31h58v25H66zM76 36v15m12-15v15m12-15v15"
              : "M61 31l25 18 28-22 22 18"
        }
      />
    </svg>
  );
}

export function ServicesSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <SectionShell
      id="services"
      className="bg-base-950 text-[#f4f0e6]"
      containerClassName="!max-w-none !px-0"
    >
      <div className="mx-auto grid max-w-[94rem] lg:grid-cols-[25rem_1fr]">
        <div className="paper-grid relative min-h-[34rem] border-r border-[#181a17]/40 p-8 text-[#181a17] sm:p-12 lg:min-h-full">
          <p className="font-heading text-6xl text-accent-blue">02</p>
          <Heading className="mt-6 max-w-xs font-heading text-6xl leading-[.9] tracking-[-.05em]">
            What I can build
          </Heading>
          <p className="mt-7 max-w-xs text-lg leading-relaxed text-[#686860]">
            Practical digital work, scoped around what your business needs next.
          </p>
          <div className="absolute bottom-10 left-10 right-10 hidden text-[#77766e] lg:block">
            <p className="mb-3 rotate-[-4deg] font-heading text-lg italic text-accent-orange">
              Clear structure. Useful work.
            </p>
            <LogoMark className="mx-auto h-52 w-52" />
            <p className="mt-2 text-right font-heading text-lg italic">
              Built for local business.
            </p>
          </div>
        </div>

        <div className="relative px-6 sm:px-10 lg:px-12">
          <div className="flex justify-between border-b border-white/25 py-4 text-[.6rem] font-bold uppercase tracking-[.18em] text-accent-orange">
            <span>The Design Hutch</span>
            <span>Founder-led web design</span>
          </div>
          <ol>
            {services.map((service, index) => (
              <li
                key={service.title}
                className={`grid grid-cols-[3.5rem_1fr] items-center gap-4 border-b py-5 sm:grid-cols-[5rem_11rem_1fr_2rem] sm:gap-6 ${index === 1 ? "border-accent-blue text-[#7f98ff]" : "border-white/25"}`}
              >
                <span className="font-heading text-4xl sm:text-5xl">
                  0{index + 1}
                </span>
                <span className="hidden text-[#a8a79f] sm:block">
                  <ServiceSketch index={index} />
                </span>
                <div>
                  <h2 className="font-heading text-3xl leading-none sm:text-4xl">
                    {service.title}
                  </h2>
                  <p
                    className={`mt-2 text-sm ${index === 1 ? "text-[#c8c9c3]" : "text-[#aaa9a2]"}`}
                  >
                    {service.summary}
                  </p>
                  {index === 1 ? (
                    <p className="mt-3 max-w-xl border-t border-white/20 pt-3 text-xs leading-relaxed text-white/70">
                      <strong className="mr-2 uppercase tracking-[.12em] text-[#9aafff]">
                        Best for
                      </strong>
                      {service.bestFor}
                    </p>
                  ) : null}
                </div>
                <span aria-hidden className="text-3xl font-light">
                  {index === 1 ? "−" : "+"}
                </span>
              </li>
            ))}
          </ol>
          <TrackedLink
            href="/contact"
            className="my-8 flex items-center justify-between border border-[#7f98ff] px-7 py-5 font-heading text-3xl text-[#7f98ff] transition hover:bg-accent-blue hover:text-white sm:text-4xl"
            tracking={{
              ctaId: "services_custom_scope",
              source: "services",
              destination: "/contact",
            }}
          >
            Discuss your project <span>→</span>
          </TrackedLink>
        </div>
      </div>
    </SectionShell>
  );
}
