interface UserT {
  id: string;
  name: string;
  login: string;
  password: string;
  image: string;
  description: string;
  rating: number;
  ratings_number: number;
  ratings_sum: number;
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
  ratings_number: number;
}

interface UserMinT {
  id: string;
  login: string;
}

export { UserT, UserToResponseT, UserToResponseDetailedT, UserMinT };
