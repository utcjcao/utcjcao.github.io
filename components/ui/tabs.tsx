"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("grid gap-10 lg:grid-cols-[220px_1fr]", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "h-fit w-full text-[11px] uppercase lg:sticky lg:top-10",
        "flex flex-col gap-2",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group inline-flex w-full items-center gap-2 border-l-2 border-transparent px-3 py-2 text-left",
        "text-[11px] uppercase text-[color:var(--fn-margin)] transition-colors",
        "data-[state=active]:border-[color:var(--fn-margin)]",
        "data-[state=active]:bg-[color:var(--fn-highlight)]",
        "data-[state=active]:text-[color:var(--fn-ink)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--fn-rule)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="text-[10px] text-[color:var(--fn-rule)] group-data-[state=active]:text-[color:var(--fn-ink)]">
        •
      </span>
      {props.children}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
