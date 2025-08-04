
"use client";

import * as React from "react";

export type SidebarLayout = "expanded" | "minimal" | "hidden";
export type RoomBackground = "solid" | "blur" | "custom";
export type TimeFormat = "12hr" | "24hr";
export type SettingCategory = 
  | 'universal' | 'profile' | 'notifications' | 'workspace' 
  | 'cortex' | 'dashboard' | 'tasks' | 'notes' | 'research' 
  | 'gm' | 'clients' | 'projects' | 'outreach' | 'finance' 
  | 'offerBuilder' | 'assetTracker' | 'brandRoom' | 'pipelineTracker' 
  | 'autoDocs' | 'templateBuilder' | 'integrationHub' 
  | 'contentStudio';

export type Settings = {
  // Universal
  sidebarLayout: SidebarLayout;
  timeFormat: TimeFormat;
  autosave: boolean;
  aiAssistant: boolean;
  quickSync: boolean;
  exportOptions: 'pdf' | 'docx' | 'csv' | 'png';
  roomShortcuts: { [key: string]: string };

  // Workspace
  workspaceName: string;
  tagline: string;
  favouritesPanelVisibility: boolean;
  roomAccessControl: 'private' | 'shared' | 'team';
  
  // Profile
  userName: string;
  userEmail: string;
  userAvatar: string;

  // Notifications
  desktopNotifications: boolean;
  emailNotifications: 'all' | 'mentions' | 'none';
  
  // Cortex
  llmModel: 'gpt4o' | 'claude';
  cortexMemory: boolean;
  fileUpload: boolean;
  promptStyle: 'formal' | 'casual' | 'tactical' | 'copywriting';
  llmApiKey: string;

  // Tasks
  tasksDefaultView: 'list' | 'board' | 'calendar' | 'gantt';
  dailyTaskLimit: number;
  autoRollover: boolean;
  aiTaskSuggestions: boolean;
};

const defaultSettings: Settings = {
  // Universal
  sidebarLayout: "expanded",
  timeFormat: "12hr",
  autosave: true,
  aiAssistant: true,
  quickSync: false,
  exportOptions: "csv",
  roomShortcuts: {},

  // Workspace
  workspaceName: "Nexaris Media",
  tagline: "Your Central AI Command Hub",
  favouritesPanelVisibility: true,
  roomAccessControl: "private",
  
  // Profile
  userName: "Fozan Shazad",
  userEmail: "fozan@example.com",
  userAvatar: "https://placehold.co/100x100.png",

  // Notifications
  desktopNotifications: true,
  emailNotifications: "mentions",

  // Cortex
  llmModel: "gpt4o",
  cortexMemory: true,
  fileUpload: true,
  promptStyle: "casual",
  llmApiKey: "",

  // Tasks
  tasksDefaultView: "list",
  dailyTaskLimit: 10,
  autoRollover: true,
  aiTaskSuggestions: true,
};

interface SettingsContextValue {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const SettingsContext = React.createContext<SettingsContextValue | undefined>(undefined);

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        setSettings(prev => ({...prev, ...JSON.parse(savedSettings)}));
      }
    } catch (error) {
      console.error("Failed to load settings from local storage", error);
    }
  }, []);
  
  React.useEffect(() => {
    if (isMounted) {
        try {
            localStorage.setItem("appSettings", JSON.stringify(settings));
        } catch (error)      {
           console.error("Failed to save settings to local storage", error);
        }
    }
  }, [settings, isMounted]);

  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
