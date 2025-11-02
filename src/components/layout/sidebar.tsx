"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookText,
  BookUser,
  Landmark,
  LayoutDashboard,
  LogOut,
  Repeat,
  Settings,
  Users,
} from "lucide-react";
import { PillarLogo } from "@/components/icons/logo";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manual", icon: BookUser, label: "Manual" },
  { href: "/habits", icon: Repeat, label: "Habits" },
  { href: "/journal", icon: BookText, label: "Journal" },
  { href: "/accountability", icon: Users, label: "Accountability" },
  { href: "/finances", icon: Landmark, label: "Finances" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="md:hidden p-2 bg-background border-b sticky top-0 z-10">
        <SidebarTrigger />
      </div>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <PillarLogo className="w-8 h-8 text-primary" />
            <span className="font-headline text-xl font-semibold">Pillar</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/settings" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === "/settings"}
                  tooltip="Settings"
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Log out">
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-3 p-2 mt-2">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026703d" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">Alex Doe</p>
                <p className="text-xs text-muted-foreground truncate">alex@example.com</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
