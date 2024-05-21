import { UserWithImage } from "@/types/Models";
import Image from "next/image";

type ProfilePictureProps = {
  user: UserWithImage | null | undefined;
};

export function ProfilePicture({ user }: ProfilePictureProps) {
  const profilePicture = user?.image?.id
    ? `/image/${user.image.id}`
    : "/assets/profile.svg";

  return <Image fill sizes="50%" src={profilePicture} alt="Profile picture" />;
}
