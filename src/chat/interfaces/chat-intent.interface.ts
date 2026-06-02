export interface ChatIntent {
  action: 'greeting' | 'lookup_complaint' | 'unknown';
  parameters?: {
    complaint_id?: string;
  };
}
