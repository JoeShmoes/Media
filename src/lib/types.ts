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
