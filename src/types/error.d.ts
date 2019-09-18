export interface ErrorWithStatus {
  status?: number;
  name: string;
  message: string;
  stack?: string;
}
