// database-config.type.ts
export type DatabaseConfigType = {
  uri: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  retryAttempts: number;
  retryDelay: number;
};
