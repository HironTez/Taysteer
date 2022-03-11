interface UserT {
  id: string;
  name: string;
  login: string;
  password: string;
  image: string;
  rating: number;
}

interface UserToResponseT {
  id: string;
  name: string;
  login: string;
  image: string;
  rating: number;
}

export { UserT, UserToResponseT };
