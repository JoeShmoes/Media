
"use client";

import * as React from "react";

export type SidebarLayout = "expanded" | "minimal" | "hidden";
export type RoomBackground = "solid" | "blur" | "custom";
export type TimeFormat = "12hr" | "24hr";
export type SettingCategory = 
  | 'universal' | 'profile' | 'notifications'
  | 'cortex' | 'tasks';

export type Settings = {
  // Universal
  sidebarLayout: SidebarLayout;
  timeFormat: TimeFormat;
  autosave: boolean;
  aiAssistant: boolean;
  quickSync: boolean;
  exportOptions: 'pdf' | 'docx' | 'csv' | 'png';
  roomShortcuts: { [key: string]: string };
  workspaceName: string;
  tagline: string;
  favouritesPanelVisibility: boolean;
  roomAccessControl: "shared" | "private";
  
  // Profile
  userName: string;
  userEmail: string;
  userAvatar: string;

  // Notifications
  desktopNotifications: boolean;
  emailNotifications: 'all' | 'mentions' | 'none';
  
  // Cortex
  cortexMemory: boolean;
  promptStyle: 'formal' | 'casual' | 'tactical' | 'copywriting';

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
  workspaceName: "Nexaris Media",
  tagline: "Your Central AI Command Hub",
  favouritesPanelVisibility: true,
  roomAccessControl: "shared",
  
  // Profile
  userName: "User",
  userEmail: "",
  userAvatar: "",

  // Notifications
  desktopNotifications: true,
  emailNotifications: "mentions",

  // Cortex
  cortexMemory: true,
  promptStyle: "casual",

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
