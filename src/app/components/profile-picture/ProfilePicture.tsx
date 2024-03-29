import { UserWithImage } from "@/types/Models";
import { Status } from "@prisma/client";
import Image from "next/image";

type ProfilePictureProps = {
  user: UserWithImage | null | undefined;
};

export const ProfilePicture = ({ user }: ProfilePictureProps) => {
  const profilePicture =
    user?.image?.id && user.status === Status.ACTIVE
      ? `/image/${user.image.id}`
      : "/assets/profile.svg";

  return <Image fill sizes="50%" src={profilePicture} alt="Profile picture" />;
};
