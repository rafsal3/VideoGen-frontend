import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { LayoutDashboard, FolderOpen, Rocket, Compass, Settings, User, Bookmark } from "lucide-react";
import { apiService, Template } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext"; // ✅ use the token from context

const menuItems = [
  {
    label: "Recent Projects",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "Explore",
    icon: Compass,
    to: "/dashboard/explore",
  },
  {
    label: "Rendering",
    icon: Rocket,
    to: "/dashboard/rendering",
  },
  {
    label: "My Folder",
    icon: FolderOpen,
    to: "/dashboard/folder",
  },
];

const bottomItems = [
  {
    label: "Settings",
    icon: Settings,
    to: "/dashboard/settings",
  },
  {
    label: "Account",
    icon: User,
    to: "/dashboard/account",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { token } = useAuth(); // ✅ Correct token source
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!token) {
        console.warn("No token found for fetching saved templates.");
        return;
      }

      try {
        console.log("Fetching saved templates with token:", token);
        const templates = await apiService.getSavedTemplates(token);
        console.log("Saved templates fetched:", templates);
        setSavedTemplates(templates);
      } catch (error) {
        console.error("Failed to load saved templates:", error);
      }
    };

    fetchTemplates();
  }, [token]);

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-center w-full px-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-5 h-5 bg-black rounded-full flex-shrink-0"
              style={{ boxShadow: "0 0 0 2px #fff" }}
            />
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
                        to={`/dashboard/template/${template.template_id}`} // customize this route if needed
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
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={location.pathname === item.to}>
                <Link to={item.to} className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
