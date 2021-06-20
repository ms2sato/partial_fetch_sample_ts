export type Effect = {
  selector: string;
  action: string;
  html: string;
}

export interface Protocol {
  effects: Effect[]
}

