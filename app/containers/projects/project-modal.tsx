import Link from "next/link"
import Image from "next/image"
import { Download, ExternalLink, Github, Briefcase } from "lucide-react"
import { Button } from "@/app/components/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/modal"
import { Badge } from "@/app/components/badge"
import type { Project } from "@/app/data/projects"
import { Separator } from "@/app/components/separator"
import { useTranslation } from "@/hooks/use-translation"

interface ProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export default function ProjectModal({ open, onOpenChange, project }: ProjectModalProps) {
  const { t } = useTranslation()
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{project.title}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Company information section */}
          {project.company && (
            <div className="mb-6 p-4 bg-cool-50/50 dark:bg-cool-900/30 rounded-lg border border-cool-200 dark:border-cool-800">
              <div className="flex items-center gap-3">
                {project.company.logo && (
                  <div className="flex-shrink-0">
                    <Image
                      src={project.company.logo || "/placeholder.svg"}
                      alt={project.company.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h4 className="font-medium text-cool-700 dark:text-cool-300 flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-indigo-500" />
                    {t("projects.companyLabel")} {project.company.name}
                  </h4>
                  {project.role && (
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                      {t("projects.roleLabel")} <span className="font-medium">{project.role}</span>
                    </p>
                  )}
                </div>
                {project.company.website && (
                  <div className="flex-shrink-0">
                    <Button variant="ghost" size="sm" asChild className="text-cool-600 dark:text-cool-400">
                      <Link href={project.company.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t("projects.companySiteLabel")}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* My contribution section */}
              {project.contribution && project.contribution.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-cool-700 dark:text-cool-300 mb-2">{t("projects.contributionLabel")}</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {project.contribution.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <p className="mb-4 text-muted-foreground">{project.description}</p>

          <h4 className="font-medium text-cool-700 dark:text-cool-300 mb-2">{t("projects.detailsLabel")}</h4>
          <ul className="space-y-2 mb-6">
            {project.details.map((detail, i) => (
              <li key={i} className="flex items-start">
                <Badge
                  variant="outline"
                  className="mr-2 bg-cool-50 text-cool-700 border-cool-200 dark:bg-cool-900/30 dark:text-cool-300 dark:border-cool-800 shrink-0"
                >
                  {i + 1}
                </Badge>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          {/* Action buttons */}
          {(project.websiteUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-3 mb-6">
              {project.websiteUrl && (
                <Button
                  variant="default"
                  asChild
                  className="bg-gradient-to-r from-cool-600 to-indigo-600 hover:from-cool-700 hover:to-indigo-700"
                >
                  <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t("projects.cta.moreInfo")}
                  </Link>
                </Button>
              )}

              {project.githubUrl && (
                <Button variant="outline" asChild className="gradient-border">
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {t("projects.cta.sourceCode")}
                  </Link>
                </Button>
              )}
            </div>
          )}

          {project.files && project.files.length > 0 && (
            <div>
              <Separator className="my-4" />
              <h4 className="font-medium text-cool-700 dark:text-cool-300 mb-2">{t("projects.downloadsLabel")}</h4>
              <div className="grid gap-2">
                {project.files.map((file, i) => (
                  <Button key={i} variant="outline" asChild className="justify-start">
                    <Link href={file.url} download>
                      <Download className="mr-2 h-4 w-4" />
                      {file.name}
                      {file.size && <span className="ml-2 text-xs text-muted-foreground">({file.size})</span>}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

