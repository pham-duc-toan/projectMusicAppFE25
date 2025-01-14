import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const refresh_token = cookieStore.get("refresh_token")?.value;
  const access_token = cookieStore.get("access_token")?.value;

  const response = NextResponse.json({
    refresh_token,
    access_token,
  });

  return response;
}
