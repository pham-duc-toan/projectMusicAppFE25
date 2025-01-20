import { ReactNode } from "react";
import "./globals.css";

type Props = {
  children: ReactNode;
};
export const metadata = {
  title: "Music App Toandeptrai",

  description:
    "The newest and hottest music streaming website with free downloads",
  openGraph: {
    title: "Music App Toandeptrai",

    description:
      "The newest and hottest music streaming website with free downloads",
    images: [
      "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733296299/xnwsxfhvkgsy3njpsyat.png",
    ],
    type: "website",
  },
};
export default function RootLayout({ children }: Props) {
  return children;
}
