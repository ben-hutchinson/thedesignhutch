import Image from "next/image";

import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  founderImage,
  founderCommitments,
  founderProfile,
  proofHighlights,
  trustStats,
} from "@/content/about";

export function AboutSection() {
  return (
    <SectionShell
      id="about"
      className="bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"
    >
      <div className="grid gap-4 md:grid-cols-12 md:items-start lg:gap-5">
        <Reveal className="md:col-span-7">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="About"
              title="Founder-led delivery with direct accountability."
              description="Minimal layers, clear communication, and practical decisions designed to move your business forward."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {founderCommitments.map((commitment) => (
                <div
                  key={commitment}
                  className="flex gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent-blue" />
                  <p className="text-sm text-zinc-200">{commitment}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.08}>
          <Card className="h-full overflow-hidden p-0">
            <div className="relative aspect-[4/5] border-b border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.28),transparent_45%),linear-gradient(135deg,rgba(59,130,246,0.18),rgba(249,115,22,0.12))]">
              {founderImage.src ? (
                <Image
                  src={founderImage.src}
                  alt={founderImage.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover object-[50%_42%]"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
                  <Image
                    src="/brand/design-hutch-logo-icon.png"
                    alt=""
                    width={132}
                    height={114}
                    className="h-24 w-auto drop-shadow-[0_24px_38px_rgba(59,130,246,0.35)]"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100/70">
                      Founder-led studio
                    </p>
                    <p className="mt-2 font-heading text-2xl font-semibold text-white">
                      Direct accountability from first call to launch
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                {founderProfile.role}
              </p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-white">
                {founderProfile.name}
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-zinc-300">
                {founderProfile.summary}
              </p>
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal className="mt-5" delay={0.12}>
        <Card>
          <div className="grid gap-3 sm:grid-cols-3">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  {stat.label}
                </p>
                <p className="mt-2 font-heading text-2xl text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      <Reveal className="mt-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {proofHighlights.map((item) => (
            <Card key={item.title} className="p-5">
              <p className="font-heading text-xl text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
