export interface UserInfo {
  id: number;
  username: string;
  role: "user" | "admin";
  premium: Date | null;
  favoriteTools: ToolInfo[];
}

export interface ToolInfo {
  id: number;
  name: string;
  description: string;
  state: "enabled" | "disabled" | "hidden";
  premium: boolean;
}
