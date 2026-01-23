export interface RequestWithUser extends Request {
  user: {
    userId: string;
    [key: string]: any;
  };
}
