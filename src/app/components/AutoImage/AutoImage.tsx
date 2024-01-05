import { exclude } from "@/utils/object";
import Image, { ImageProps } from "next/image";
import React from "react";
import styles from "./style.module.css";

type AutoImageProps = ImageProps & { sizes: string };

export default function AutoImage(props: AutoImageProps) {
  return (
    <Image
      width={0}
      height={0}
      className={styles.autoImage}
      alt={props.alt}
      {...exclude(props, ["alt"])}
    />
  );
}
