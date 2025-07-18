'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { Home, Flame } from 'lucide-react';
import { InteractiveWrapper } from './interactive-wrapper';
import { Button } from './ui/button';

export function Dashboard({ children }: { children: ReactNode }) {
  return (
    <InteractiveWrapper>
      <SidebarProvider>
        <Sidebar collapsible="icon" className="bg-black/10 backdrop-blur-sm border-r border-white/10">
          <SidebarHeader>
             <div className="flex items-center gap-2 justify-between p-2">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-lg">
                        <Flame />
                    </Button>
                    <h2 className="text-xl font-headline font-bold text-white group-data-[collapsible=icon]:hidden">
                        HYPERFUELED
                    </h2>
                </div>
                <SidebarTrigger className="group-data-[collapsible=icon]:hidden"/>
             </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="text-white/80 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white" tooltip={{children: "Dashboard"}}>
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <main className="z-10 relative">
                {children}
            </main>
        </SidebarInset>
      </SidebarProvider>
    </InteractiveWrapper>
  );
}
