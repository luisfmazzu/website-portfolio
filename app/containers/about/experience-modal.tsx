import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/app/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/modal";
import { Badge } from "@/app/components/badge";
import { useTranslation } from "@/hooks/use-translation";

interface ExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: {
    title: string;
    company: string;
    period: string;
    description: string;
    responsibilities: string[];
    website?: string;
  };
}

export default function ExperienceModal({ open, onOpenChange, experience }: ExperienceModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{t(experience.title)}</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span className="text-indigo-600 dark:text-indigo-300 text-base">
              {t(experience.company)} • {t(experience.period)}
            </span>
            {experience.website && (
              <Button variant="ghost" size="sm" asChild className="ml-auto">
                <Link href={experience.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t("visitWebsite")}
                </Link>
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="mb-4 text-muted-foreground">{t(experience.description)}</p>

          <h4 className="font-medium text-cool-700 dark:text-cool-300 mb-2">{t("responsibilities")}</h4>
          <ul className="space-y-2">
            {experience.responsibilities.map((responsibility, i) => (
              <li key={i} className="flex items-start">
                <Badge variant="outline" className="mr-2">
                  {i + 1}
                </Badge>
                <span>{t(responsibility)}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}