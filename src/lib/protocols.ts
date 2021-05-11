export type Effect = {
  action: string;
  html: string;
}

export interface Protocol {
  effects: Record<string, Effect>
}

