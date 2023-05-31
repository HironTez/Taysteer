import Users from "./pages/users";
import styles from "./page.module.css";

export default async function Home() {
  return <main className={styles.main}><Users/></main>;
}
