import Image, { ImageProps } from "next/image";
import React from "react";
import styles from "./style.module.css";

type AutoImageProps = ImageProps & { sizes: string };

export default function AutoImage(props: AutoImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image width={0} height={0} className={styles.autoImage} {...props} />
  );
}
