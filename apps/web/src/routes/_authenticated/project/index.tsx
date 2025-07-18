import { createFileRoute } from '@tanstack/react-router'
import Project from '@/features/project'

export const Route = createFileRoute('/_authenticated/project/')({
  component: Project,
})
