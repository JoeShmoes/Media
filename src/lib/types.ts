
export type Client = {
  id: string
  name: string
  service: string
  status: "Prospect" | "Active" | "Completed"
  lastContact: string
}

export type Project = {
  id: string
  title: string
  service: string
  status: "discovery" | "planning" | "building" | "launch"
  deadline?: string
  link?: string
}

export type ProjectBoardColumn = "discovery" | "planning" | "building" | "launch";

export type ProjectBoard = {
  [key in ProjectBoardColumn]: Project[];
};


export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
};

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
  updatedAt?: string;
};

export type GmMessage = {
  id: string;
  text: string;
  createdAt: any; // Firestore timestamp
  user: {
    name: string;
    avatar: string;
  };
};
