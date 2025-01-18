import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const GetAccessTokenFromCookie = () => {
  const cookieStore = cookies();

  const refresh_token = cookieStore.get("refresh_token");
  const access_token = cookieStore.get("access_token");
  if (!refresh_token) {
    redirect(`/en/login`);
  }
  if (!access_token) {
    redirect(`/`);
  }

  return access_token;
};
export const GetPublicAccessTokenFromCookie = () => {
  const cookieStore = cookies();

  const access_token = cookieStore.get("access_token");

  return access_token;
};
