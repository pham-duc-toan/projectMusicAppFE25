"use client";
import { Link } from "@/i18n/routing";

interface DivNavigationProps {
  content: string;
  link: string;
}

const DivNavigation: React.FC<DivNavigationProps> = ({ content, link }) => {
  return (
    <Link href={link}>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {content}
      </div>
    </Link>
  );
};

export default DivNavigation;
