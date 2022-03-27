export interface UserT {
  id: string;
  name: string;
  login: string;
  password: string;
  image: string;
  description: string;
  rating: number;
  ratings_count: number;
  ratings_sum: number;
  raters: UserRaterT[];
}

export interface UserToResponseT {
  id: string;
  name: string;
  login: string;
  image: string;
  rating: number;
}

export interface UserToResponseDetailedT {
  id: string;
  name: string;
  login: string;
  image: string;
  description: string;
  rating: number;
  ratings_count: number;
}

export interface UserMinT {
  id: string;
  login: string;
}

export interface UserRaterT {
  id: number;
  raterId: string;
  rating: number;
  user: UserT;
}
