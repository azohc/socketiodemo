export interface UserData {
  alias: string;
  online: boolean;
  typing: boolean;
}

export interface MessageData {
  text: string;
  sender: string | null;
  timestamp: string;
}
