export interface ExceptionError {
  code: string;
  reason: string;
  messages: string[];
}

export interface ResponseJson {
  timestamp: Date;
  statusCode: number;
  code: string;
  reason: string;
  messages: string[];
  stack?: any;
}
