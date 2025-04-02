"use client"

import SectionObserver from "@/app/components/section-observer"
import ExperienceTimeline from "./experience-timeline"
import SectionDivider from "@/app/components/section-divider"
import WhyHireMe from "@/app/containers/about/why-hire-me"
import GitStats from "./git-stats"
import { useTranslation } from "@/hooks/use-translation"

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="relative section-pattern px-4 py-24 md:px-8">
      <SectionDivider variant="waves" position="top" height={30} flip={true} />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-cool-50/20 dark:to-cool-950/20" />

      <div className="container">
        <SectionObserver animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl gradient-text">
              {t("about.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("about.description")}</p>
          </div>
        </SectionObserver>

        <WhyHireMe />

        <div className="mt-16 space-y-8">
          <ExperienceTimeline />
          <GitStats />
        </div>
      </div>

      <SectionDivider variant="peaks" position="bottom" height={30} />
    </section>
  )
}

