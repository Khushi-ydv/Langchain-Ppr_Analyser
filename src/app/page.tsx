'use client';

import React, { useState } from 'react';
import { ChatPanel } from '@/components/chat-panel';
import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { FilePlus2, Linkedin, KeyRound } from 'lucide-react';
import { ApiKeyDialog } from '@/components/api-key-dialog';

export default function Home() {
  const [chatKey, setChatKey] = useState(0);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);

  const startNewArticle = () => {
    setChatKey(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="h-full" collapsible="icon">
          <SidebarHeader>
            <div className="flex h-10 items-center gap-2 px-2">
              <Logo />
              <h1 className="text-xl font-semibold font-headline group-data-[state=collapsed]:hidden">WikiMind</h1>
              <div className="flex-1 group-data-[state=collapsed]:hidden" />
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton onClick={startNewArticle} className="w-full justify-start gap-2" tooltip="New Article">
                   <FilePlus2 />
                   <span className="group-data-[state=collapsed]:hidden">New Article</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsApiDialogOpen(true)} className="w-full justify-start gap-2" tooltip="Set API Key">
                  <KeyRound />
                  <span className="group-data-[state=collapsed]:hidden">Set API Key</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="w-full justify-start gap-2" tooltip="My LinkedIn">
                  <a href="https://www.linkedin.com/in/khushi-yadav-937501291/" target="_blank" rel="noopener noreferrer">
                    <Linkedin />
                    <span className="group-data-[state=collapsed]:hidden">My LinkedIn</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">
          <ChatPanel key={chatKey} />
        </SidebarInset>
      </div>
      <ApiKeyDialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen} />
    </SidebarProvider>
  );
}
