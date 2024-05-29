import { getSessionUser } from "@/app/internal-actions/auth";
import { newUrl } from "@/app/internal-actions/url";
import Link from "next/link";
import ProfilePicture from "../profile-picture";
import styles from "./navbar.module.css";

export async function Navbar() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    const profileUrl = newUrl("/profile");
    return (
      <Link href={profileUrl}>
        <div className={styles.imageContainer}>
          <ProfilePicture user={sessionUser} sizes="50px" />
        </div>
        <p>Name: {sessionUser.name}</p>
      </Link>
    );
  } else {
    const authUrl = newUrl("/auth");
    return <Link href={authUrl}>Auth</Link>;
  }
}
