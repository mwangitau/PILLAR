"use client"

import * as React from "react"
import { ChevronsLeft, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"

// #region Sidebar Context
type SidebarContextProps = {
  isCollapsed: boolean
  isMobile: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
// #endregion

// #region Sidebar Provider
type SidebarProviderProps = {
  children: React.ReactNode
  collapsible?: "icon" | "button"
}

function SidebarProvider({
  children,
  collapsible = "icon",
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsSheetOpen(false)
    } else {
      setIsCollapsed(true)
    }
  }

  const contextValue = React.useMemo(
    () => ({
      isCollapsed: isMobile ? false : isCollapsed,
      isMobile,
      toggleSidebar,
      closeSidebar,
    }),
    [isCollapsed, isMobile]
  )

  const sidebarContent = (
    <TooltipProvider delayDuration={0}>
      <SidebarContext.Provider value={contextValue}>
        {children}
      </SidebarContext.Provider>
    </TooltipProvider>
  )

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {collapsible === "button" && (
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
        )}
        <SheetContent side="left" className="w-60 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return sidebarContent
}
// #endregion

// #region Sidebar Components
const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { collapsible?: "icon" | "button" }
>(({ className, children, collapsible = "icon", ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <aside
      ref={ref}
      className={cn(
        "relative z-20 hidden h-full flex-col border-r bg-background transition-[width] duration-300 md:flex",
        isCollapsed ? "w-14" : "w-60",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between",
          collapsible === "icon" ? "h-14 p-2" : "h-[57px] p-2"
        )}
      >
        {!isCollapsed && collapsible === "button" && <div />}
        {collapsible === "icon" && <SidebarCollapse />}
      </div>
      {children}
    </aside>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-b p-2",
        isCollapsed ? "justify-center" : "",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isMobile } = useSidebar()
  const El = isMobile ? SheetHeader : "div"
  return (
    <El
      ref={ref}
      className={cn(
        "flex h-full flex-1 flex-col overflow-y-auto",
        isMobile ? "p-2" : "",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto flex flex-col", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col", className)} {...props} />
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  return (
    <SheetTrigger ref={ref} asChild>
      <Button {...props} />
    </SheetTrigger>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

type SidebarMenuButtonProps = ButtonProps & {
  isActive?: boolean
  tooltip?: string
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, tooltip, children, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()

  const buttonContent = (
    <Button
      ref={ref}
      variant={isActive ? "secondary" : "ghost"}
      className={cn("w-full", isCollapsed ? "justify-center" : "justify-start", className)}
      {...props}
    >
      {children}
    </Button>
  )

  if (isCollapsed && !isMobile && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    )
  }
  return buttonContent
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarCollapse = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, ...props }, ref) => {
  const { toggleSidebar, isCollapsed } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(isCollapsed && "rotate-180", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <ChevronsLeft />
    </Button>
  )
})
SidebarCollapse.displayName = "SidebarCollapse"
// #endregion

export {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarCollapse,
  SidebarTrigger,
  useSidebar,
}
