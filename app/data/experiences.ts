import { useTranslation } from "@/hooks/use-translation"

export interface TimelineJob {
  id: number
  year: number
  title: string
  company: string
  period: string
  description: string
  responsibilities: string[]
  website?: string
  color: string
  concurrent?: boolean
  timeframe?: "2021-2023" | "2023-2024" | "2024-2025" | "2025-present" | "2017-2020" | "2016-2017"
}

// Create a function to generate jobs with translations
export function getJobs() {
  const { t } = useTranslation()

  const jobs: TimelineJob[] = [
    {
      id: 7,
      year: 2025,
      title: t("experience.job7.title"),
      company: t("experience.job7.company"),
      period: t("experience.job7.period"),
      description: t("experience.job7.description"),
      responsibilities: [
        t("experience.job7.responsibility1"),
        t("experience.job7.responsibility2"),
        t("experience.job7.responsibility3"),
        t("experience.job7.responsibility4"),
        t("experience.job7.responsibility5"),
      ],
      website: "https://www.ocarinastudios.com",
      color: "indigo",
      timeframe: "2025-present",
    },
    {
      id: 6,
      year: 2023,
      title: t("experience.job6.title"),
      company: t("experience.job6.company"),
      period: t("experience.job6.period"),
      description: t("experience.job6.description"),
      responsibilities: [
        t("experience.job6.responsibility1"),
        t("experience.job6.responsibility2"),
        t("experience.job6.responsibility3"),
        t("experience.job6.responsibility4"),
        t("experience.job6.responsibility5"),
        t("experience.job6.responsibility6"),
      ],
      website: "https://elixir.xyz",
      color: "purple",
      timeframe: "2023-2024",
    },
    {
      id: 5,
      year: 2021,
      title: t("experience.job5.title"),
      company: t("experience.job5.company"),
      period: t("experience.job5.period"),
      description: t("experience.job5.description"),
      responsibilities: [
        t("experience.job5.responsibility1"),
        t("experience.job5.responsibility2"),
        t("experience.job5.responsibility3"),
      ],
      website: "https://luisfmazzu.com",
      color: "teal",
      concurrent: true,
      timeframe: "2021-2023",
    },
    {
      id: 4,
      year: 2021,
      title: t("experience.job4.title"),
      company: t("experience.job4.company"),
      period: t("experience.job4.period"),
      description: t("experience.job4.description"),
      responsibilities: [
        t("experience.job4.responsibility1"),
        t("experience.job4.responsibility2"),
        t("experience.job4.responsibility3"),
      ],
      website: "https://karat.com",
      color: "cool",
      concurrent: true,
      timeframe: "2021-2023",
    },
    {
      id: 3,
      year: 2021,
      title: t("experience.job3.title"),
      company: t("experience.job3.company"),
      period: t("experience.job3.period"),
      description: t("experience.job3.description"),
      responsibilities: [
        t("experience.job3.responsibility1"),
        t("experience.job3.responsibility2"),
        t("experience.job3.responsibility3"),
        t("experience.job3.responsibility4"),
      ],
      website: "https://ocarinastudios.com",
      color: "blue",
      concurrent: true,
      timeframe: "2021-2023",
    },
    {
      id: 2,
      year: 2020,
      title: t("experience.job2.title"),
      company: t("experience.job2.company"),
      period: t("experience.job2.period"),
      description: t("experience.job2.description"),
      responsibilities: [
        t("experience.job2.responsibility1"),
        t("experience.job2.responsibility2"),
        t("experience.job2.responsibility3"),
        t("experience.job2.responsibility4"),
        t("experience.job2.responsibility5"),
        t("experience.job2.responsibility6"),
        t("experience.job2.responsibility7"),
        t("experience.job2.responsibility8"),
      ],
      website: "https://en.agres.com.br/",
      color: "blue",
      timeframe: "2017-2020",
    },
    {
      id: 1,
      year: 2016,
      title: t("experience.job1.title"),
      company: t("experience.job1.company"),
      period: t("experience.job1.period"),
      description: t("experience.job1.description"),
      responsibilities: [
        t("experience.job1.responsibility1"),
        t("experience.job1.responsibility2"),
        t("experience.job1.responsibility3"),
        t("experience.job1.responsibility4"),
      ],
      website: "https://www.thalesgroup.com/en",
      color: "amber",
      timeframe: "2016-2017",
    },
  ]

  return jobs;
}

// For backward compatibility
export const jobs = [
  // Default placeholder values in English
  {
    id: 7,
    year: 2025,
    title: "Software Engineering Manager",
    company: "Ocarina Studios",
    period: "2024 - 2025",
    description: "Managing software developers to develop applications ranging from gaming, blockchain and AI.",
    responsibilities: [
      "Collaborated with executive leadership to define and implement technology strategies that supported business growth, optimized resources, and maximized ROI.",
      "Created comprehensive roadmaps, backlogs, and risk assessments for major products, maintaining stakeholder alignment and delivering high-quality releases on schedule.",
      "Initiated technical training sessions and professional development plans, boosting team retention rates and improving skill diversity within the engineering team.",
      "Introduced comprehensive documentation practices for systems and codebases, improving knowledge transfer and reducing onboarding time by 40%.",
      "Established rapid prototyping and feedback processes, accelerating the development of new features and reducing the average time from concept to prototype by 50%.",
    ],
    website: "https://www.ocarinastudios.com",
    color: "indigo",
    timeframe: "2025-present",
  },
  // ... more jobs if needed for backward compatibility
]