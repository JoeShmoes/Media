"use client";

import * as React from "react";

export type SidebarLayout = "expanded" | "minimal" | "hidden";
export type RoomBackground = "solid" | "blur" | "custom";
export type TimeFormat = "12hr" | "24hr";
export type SettingCategory = 'universal' | 'profile' | 'notifications' | 'workspace' | 'cortex' | 'dashboard' | 'tasks' | 'notes' | 'research' | 'gm' | 'clients' | 'projects' | 'outreach' | 'finance' | 'offer-builder' | 'asset-tracker' | 'brand-room' | 'pipeline-tracker' | 'ai-advantage' | 'autodocs' | 'template-builder' | 'integration-hub' | 'make-com' | 'content-studio' ;


interface Settings {
  sidebarLayout: SidebarLayout;
  roomBackground: RoomBackground;
  autosave: boolean;
  timeFormat: TimeFormat;
}

const defaultSettings: Settings = {
  sidebarLayout: "expanded",
  roomBackground: "blur",
  autosave: true,
  timeFormat: "12hr",
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

  React.useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to load settings from local storage", error);
    }
  }, []);
  
  React.useEffect(() => {
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
    } catch (error)      {
       console.error("Failed to save settings to local storage", error);
    }
  }, [settings]);

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
