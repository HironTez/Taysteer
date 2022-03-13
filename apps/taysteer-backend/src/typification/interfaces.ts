export interface RequestWithUser extends Request {
  user: {
    id: string;
    login: string;
  };
}