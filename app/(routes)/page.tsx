import Image from "next/image";
import styles from "./page.module.css";
import { HomeBlock } from "@/_blocks";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBlock />
    </main>
  );
}
