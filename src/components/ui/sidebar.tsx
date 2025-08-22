import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { sidebarVariants } from "./sidebar-variants"

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

function Sidebar({ className, variant, ...props }: SidebarProps) {
  return (
    <div className={cn(sidebarVariants({ variant }), className)} {...props} />
  )
}

export { Sidebar }
