
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useUser, useDoc, useMemoFirebase, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import type { UserProfile } from "@/lib/types";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import { Skeleton } from "../ui/skeleton";

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
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'userProfiles', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isLoading = isUserLoading || isUserProfileLoading;

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
                <SidebarMenuButton tooltip="Log out" onClick={handleLogout}>
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-3 p-2 mt-2">
            {isLoading ? (
                <>
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                </>
            ) : (
                <>
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${userProfile?.email}`} />
                      <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate">{userProfile?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{userProfile?.email || ""}</p>
                    </div>
                </>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
