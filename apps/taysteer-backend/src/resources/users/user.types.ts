import { User } from "./user.model";

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
  ratingsCount: number;
}

export interface UserMinT {
  id: string;
  login: string;
}