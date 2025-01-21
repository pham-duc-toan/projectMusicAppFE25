import { decodeToken } from "@/app/helper/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SERVER = process.env.NEXT_PUBLIC_BACK_END_URL;
export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token")?.value;
  const refresh_token = cookieStore.get("refresh_token")?.value;
  const authHeader = request.headers.get("authorization");
  let accessLocal: string | undefined = undefined;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    accessLocal = token;
  }

  if (
    !refresh_token &&
    !(accessLocal && access_token && access_token == accessLocal)
  ) {
    return NextResponse.json(
      { message: "Vui lòng đăng nhập lại! (1)" },
      { status: 400 }
    );
  }

  try {
    const data = await fetch(`${SERVER}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ refreshToken: refresh_token }),
    }).then((res) => res.json());

    if (data.data) {
      const expire_access_token = decodeToken(data.data.access_token);
      const expire_refresh_token = decodeToken(data.data.refresh_token);

      const response = NextResponse.json(data);

      response.cookies.set("access_token", data.data.access_token, {
        httpOnly: true,
        path: "/",
        //@ts-ignore
        expires: new Date(expire_access_token.exp * 1000),
      });
      response.cookies.set("refresh_token", data.data.refresh_token, {
        httpOnly: true,
        path: "/",
        //@ts-ignore
        expires: new Date(expire_refresh_token.exp * 1000),
      });
      return response;
    } else {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập lại" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch data from backend" },
      { status: 500 }
    );
  }
}
