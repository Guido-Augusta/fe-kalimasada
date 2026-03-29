import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface AppSidebarProps {
  items: SidebarItem[];
  label?: string;
}

export function AppSidebar({ items, label = 'Menu' }: AppSidebarProps) {
  const getNavClassName = (active: boolean) =>
    active
      ? 'bg-yellow-500 font-medium text-white hover:bg-yellow-600'
      : 'text-foreground hover:bg-yellow-600 hover:text-white';

  return (
    <Sidebar collapsible="icon" className="will-change-transform transform-gpu">
      <SidebarContent className="bg-violet-600">
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-500 font-bold text-lg group-data-[collapsible=icon]:hidden">
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
                        getNavClassName(isActive) +
                        'flex items-center gap-2 rounded-md px-2 py-1 overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'
                      }
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-white shrink-0" />
                        <span className="text-white truncate group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </div>
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
