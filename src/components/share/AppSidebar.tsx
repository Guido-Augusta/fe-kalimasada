import { NavLink } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface AppSidebarProps {
  items: SidebarItem[];
  label?: string;
}

export function AppSidebar({ items, label = "Menu" }: AppSidebarProps) {
  const { state } = useSidebar();

  const getNavClassName = (active: boolean) =>
    active
      ? "bg-yellow-500 font-medium text-white hover:bg-yellow-600"
      : "text-foreground hover:bg-yellow-600 hover:text-white";

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"}>
      <SidebarContent className="bg-violet-600">
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-500 font-bold text-lg">
            {label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        getNavClassName(isActive) + " flex items-center gap-2 rounded-md px-2 py-1"
                      }
                    >
                      {/* <SidebarMenuButton asChild> */}
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-white" />
                          {state !== "collapsed" && (
                            <span className="text-white">{item.title}</span>
                          )}
                        </div>
                      {/* </SidebarMenuButton> */}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}