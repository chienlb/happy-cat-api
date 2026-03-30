import { UserRole } from 'src/app/modules/users/schema/user.schema';

export class CompetitionLeaderboardUserDto {
  _id: string;
  fullname: string;
  username: string;
  avatar?: string;
  role?: UserRole;
  score: number;
  rank: number;
  submittedAt?: Date;
}

export class PaginatedCompetitionLeaderboardDto {
  data: CompetitionLeaderboardUserDto[];
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  page: number;
  limit: number;
}
