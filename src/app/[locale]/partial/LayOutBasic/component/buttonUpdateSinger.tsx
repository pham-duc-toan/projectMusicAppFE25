"use client";
import { useEffect, useState } from "react";

import { decodeToken } from "@/app/helper/jwt";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";

import Button from "@mui/material/Button";

import IUserInfo from "@/dataType/infoUser";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const ButtonUpdateSingerHeader = () => {
  const [infoUser, setInfoUser] = useState<IUserInfo | null>(null);
  const t = useTranslations("Layout");
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const decodedInfo = decodeToken(accessToken);
      setInfoUser(decodedInfo || null);
    }
  }, []);

  return (
    <>
      {infoUser && !infoUser?.singerId && (
        <Link href={"/upgrade"}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              marginRight: 2,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              lineHeight: 2,
              overflow: "hidden",
              wordWrap: "break-word",
            }}
          >
            {t("header-dang-ky-ca-si")}
          </Button>
        </Link>
      )}
    </>
  );
};

export default ButtonUpdateSingerHeader;
