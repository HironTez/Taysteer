import { Profile } from "../Profile";

type ProfileByIdProps = {
  params: { userId: string };
};

export default function ProfileById({ params }: ProfileByIdProps) {
  return <Profile userId={params.userId} />;
}
