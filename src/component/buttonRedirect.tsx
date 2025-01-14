"use client";

import { Button, ButtonProps } from "@mui/material";
import { Link } from "@/i18n/routing";

interface ButtonRedirectProps extends ButtonProps {
  link: string;
  content: string;
}

const ButtonRedirect = ({
  link,
  content,
  ...buttonProps
}: ButtonRedirectProps) => {
  return (
    <Link href={link} passHref>
      <Button {...buttonProps}>{content}</Button>
    </Link>
  );
};

export default ButtonRedirect;
