export interface Message {
  chatId: string | null;
  id?: string;
  content?: string;
  buttons?: string;
  event?: string;
  rating?: string;
  authorId?: string;
  authorTimestamp: string;
  authorFirstName?: string;
  authorLastName?: string;
  authorRole?: string;
  created?: string;
  updated?: string;
  data?: {
    forwarding_validation?: string;
  };
}

export interface MessageButton {
  title: string;
  payload: string;
}
