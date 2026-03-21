
export class CreateCommuniteDto {
  userId: string;
  content: string;
  image?: string;
  comments: {
    userId: string;
    content: string;
    image?: string;
  }[];
  isPublic: boolean;
}
