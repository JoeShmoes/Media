export type Client = {
  id: string
  name: string
  service: "SEO" | "Website" | "Ads" | "Trial"
  status: "Prospect" | "Active" | "Completed"
  lastContact: string
}

export type ProjectTask = {
  id: string
  title: string
  service: "SEO" | "Website"
  deadline?: string
  link?: string
}

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type Task = {
  id: string;
  name: string;
  description?: string;
  renew?: "Never" | "Everyday" | DayOfWeek[];
  notifications: boolean;
  completed: boolean;
};

export type TaskGroup = {
  id: string;
  name: string;
  tasks: Task[];
};

export type WikipediaSearchResult = {
  pageid: number;
  title: string;
  description?: string;
}

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};
