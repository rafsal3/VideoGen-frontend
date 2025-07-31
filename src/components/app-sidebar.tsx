import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderOpen,
  Rocket,
  Compass,
  Bookmark,
} from "lucide-react";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { NavUser } from "@/components/nav-user";
import iconLogo from "@/assets/icon-logo.svg";

const menuItems = [
  { label: "Recent Projects", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Explore", icon: Compass, to: "/dashboard/explore" },
  { label: "Export", icon: Rocket, to: "/dashboard/export" },
  { label: "My Folder", icon: FolderOpen, to: "/dashboard/folder" },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { token } = useAuth();

  const { data: savedTemplates = [] } = useQuery({
    queryKey: ["savedTemplates"],
    queryFn: () => {
      if (!token) throw new Error("No token for saved templates");
      return apiService.getSavedTemplates(token);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => {
      if (!token) throw new Error("No token for current user");
      return apiService.getCurrentUser(token);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-center w-full px-2">
          <div className="flex items-center gap-2">
            <img src={iconLogo} alt="Main Logo" className="w-8 h-8" />
            {state === "expanded" && (
              <span className="font-bold text-lg tracking-tight text-gray-900">
                AutoVideoGen
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.to}>
                    <Link to={item.to} className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {savedTemplates.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Saved Templates</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {savedTemplates.map((template) => (
                  <SidebarMenuItem key={template.template_id}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={`/dashboard/template/${template.template_id}`}
                        className="flex items-center gap-3"
                      >
                        <Bookmark size={18} />
                        <span>{template.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.full_name,
              email: user.email,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`,
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
