export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        username: string;
        email: string;
        avatar: string;
        bg_img: string;
      };
    }
  }
}
