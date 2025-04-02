"use client"

import { Button } from "@/app/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/dropdown-menu"
import { Globe } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-cool-600 dark:text-cool-300">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`hover:bg-cool-100 hover:text-cool-700 ${language === "en" ? "bg-cool-100 dark:bg-cool-900/40 font-medium" : ""}`}
        >
          {t("language.english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("pt")}
          className={`hover:bg-cool-100 hover:text-cool-700 ${language === "pt" ? "bg-cool-100 dark:bg-cool-900/40 font-medium" : ""}`}
        >
          {t("language.portuguese")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

