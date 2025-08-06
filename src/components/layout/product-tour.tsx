
"use client"

import * as React from "react"
import Joyride, { type Step } from 'react-joyride';
import { useTheme } from "next-themes";

export function ProductTour() {
  const [runTour, setRunTour] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted) {
        const hasCompletedTour = localStorage.getItem('hasCompletedTour');
        if (!hasCompletedTour) {
            // Add a small delay to ensure all DOM elements are mounted
            setTimeout(() => {
                setRunTour(true);
            }, 200);
        }
    }
  }, [isMounted]);

  const handleCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasCompletedTour', 'true');
    }
  };

  const tourSteps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to your new Command Center! Let\'s take a quick tour of the main features.',
      placement: 'center',
    },
    {
      target: '[data-sidebar="sidebar"]',
      content: 'This is your main navigation sidebar. You can access all the different "Rooms" from here.',
      placement: 'right',
    },
    {
      target: '#tour-dashboard',
      content: 'You are here, on the Dashboard. This is your high-level overview of everything happening in your business.',
      placement: 'right',
    },
    {
      target: '#tour-kpis',
      content: 'These are your Key Performance Indicators (KPIs). They give you a quick glance at your most important metrics.',
      placement: 'bottom',
    },
    {
      target: '#tour-suggestions',
      content: 'Here you\'ll find AI-powered suggestions to help you grow your business and alerts for anything that needs your attention.',
      placement: 'bottom',
    },
    {
      target: '#tour-ai-room',
      content: 'The AI Room is your custom-trained business advisor. Ask it anything!',
      placement: 'right',
    },
    {
        target: '#tour-profile',
        content: 'You can manage your profile and app settings here.',
        placement: 'top',
    },
     {
      target: 'body',
      content: 'That\'s it! You\'re ready to start running your business. Explore the rooms to see everything you can do.',
      placement: 'center',
    },
  ];

  if (!isMounted) return null;

  return (
    <Joyride
      run={runTour}
      steps={tourSteps}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      styles={{
        options: {
          arrowColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          primaryColor: '#3B5998',
          textColor: theme === 'dark' ? '#ffffff' : '#000000',
          zIndex: 1000,
        },
      }}
    />
  );
}
