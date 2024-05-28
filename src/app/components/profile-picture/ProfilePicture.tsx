import { UserWithImage } from "@/types/Models";
import Image from "next/image";

type ProfilePictureProps = {
  user: UserWithImage | null | undefined;
  sizes: string;
};

export function ProfilePicture({ user, sizes }: ProfilePictureProps) {
  const profilePicture = user?.image?.id
    ? `/image/${user.image.id}`
    : "/assets/profile.svg";

  return (
    <Image
      fill
      sizes={sizes}
      src={profilePicture}
      alt="Profile picture"
      loading="lazy"
    />
  );
}
