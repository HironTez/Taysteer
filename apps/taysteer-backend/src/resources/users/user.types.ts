interface UserT {
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

interface UserToResponseT {
  id: string;
  name: string;
  login: string;
  image: string;
  rating: number;
}

interface UserToResponseDetailedT {
  id: string;
  name: string;
  login: string;
  image: string;
  description: string;
  rating: number;
  ratings_count: number;
}

interface UserMinT {
  id: string;
  login: string;
}

interface UserRaterT {
  id: number;
  raterId: string;
  rating: number;
  user: UserT;
}

export {
  UserT,
  UserToResponseT,
  UserToResponseDetailedT,
  UserMinT,
  UserRaterT,
};
