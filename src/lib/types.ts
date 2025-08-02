


export type CompareVersionsOutput = {
    summary: string;
    diff: {
        type: "added" | "removed" | "unchanged";
        text: string;
    }[];
};


export type GenerateSopOutput = {
  title: string;
  steps: {
      title: string;
      description: string;
  }[];
};



export type MindMapNode = {
  id: string;
  content: string;
  position: { x: number; y: number };
  connections: string[];
  color?: string;
};


export type GeneratePersonaOutput = {
    name: string;
    avatar: string;
    bio: string;
    goals: string[];
    painPoints: string[];
};


export type Domain = {
  id: string;
  name: string;
  provider: string;
  expires: string;
};

export type DesignAsset = {
  id: string;
  name: string;
  type: "Logo" | "Font" | "Color" | "Mockup" | "Other";
  fileUrl: string; // Could be a data URL for simplicity or a link
};

export type LegalDocument = {
  id:string;
  name: string;
  type: "Contract" | "NDA" | "Template" | "Other";
  fileUrl: string;
};

export type SearchAssetsOutput = {
  domainIds: string[];
  designAssetIds: string[];
  legalDocIds: string[];
};

export type ClientResource = {
  id: string;
  name: string;
  type: "file" | "link";
  url: string; // File path or external link
  clientIds: string[]; // List of client IDs who can access this
};



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
  status: ProjectBoardColumn
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
  groupId?: string;
  dueDate?: string;
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

export type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  description: string;
};

export type OfferFeature = {
  id: string;
  name: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  price: number;
  features: OfferFeature[];
};

export type GenerateOfferOutput = {
  title: string;
  description: string;
  price: number;
  features: string[];
}

export type BrandVoice = {
  tone: string;
  style: string;
  examples: string;
}

export type BrandColor = {
  id: string;
  name: string;
  hex: string;
}

export type BrandLogo = {
    id: string;
    name: string;
    url: string;
}

export type Persona = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  goals: string[];
  painPoints: string[];
}

export type DealStatus = "leads" | "needs-analysis" | "proposal" | "negotiation" | "closed-won" | "closed-lost";

export type Deal = {
  id: string;
  title: string;
  value: number;
  status: DealStatus;
  clientName?: string;
  notes?: string;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  status: "Not Started" | "In Progress" | "Completed";
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
};

export type GenerateContentBriefOutput = {
    hook: string;
    talkingPoints: string[];
    keywords: string;
    visuals: string;
}

export type GenerateCallNoteOutput = {
    summary: string;
    nextActions: string[];
    emailDraft: string;
};

export type SummarizeTranscriptOutput = {
  title: string;
  keyDecisions: string[];
  actionItems: string[];
  concerns: string[];
};

export type DocumentType = 'Content Brief' | 'Call Note' | 'Meeting Summary' | 'SOP' | 'Version Comparison';

export type SavedDocument = {
  id: string;
  type: DocumentType;
  title: string;
  createdAt: string;
  content: GenerateContentBriefOutput | GenerateCallNoteOutput | SummarizeTranscriptOutput | GenerateSopOutput | CompareVersionsOutput;
};

export type IntegrationCategory = "Project Management" | "Communication & Scheduling" | "Custom Automations";

export type Integration = {
    name: string;
    icon: React.ReactElement;
    href: string;
    category?: IntegrationCategory;
}

export type TaskTemplate = {
    id: string;
    templateName: string;
    taskName: string;
    taskDescription?: string;
}

export type NoteTemplate = {
    id: string;
    templateName: string;
    noteTitle: string;
    noteContent?: string;
}

export type OfferTemplate = {
  id: string;
  templateName: string;
  offerTitle: string;
  offerDescription: string;
  offerPrice: number;
  offerFeatures: string[];
};

export type OutreachTemplate = {
  id: string;
  templateName: string;
  outreachType: "DM" | "Email" | "Phone" | "Follow Up";
  outreachSubject?: string;
  outreachBody: string;
}

export type ProjectTemplate = {
    id: string;
    templateName: string;
    projectTitle: string;
    projectService: string;
}


export type TemplateType = 'Task' | 'Note' | 'Offer' | 'Outreach' | 'Project';

export type GenerateDashboardInsightsOutput = {
  suggestions: { text: string; href: string }[];
  notifications: {
    text: string;
    level: "info" | "warning" | "critical";
  }[];
};
