export interface HttpErrorT {
  message: string;
  status: number;
}

export type GetDto<T> = {
  data?: T;
  error?: HttpErrorT;
} | null;
