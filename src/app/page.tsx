import { prisma } from "@/db";
import styles from "./page.module.css";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <main className={styles.main}>
      {JSON.stringify(users)}
    </main>
  );
}
