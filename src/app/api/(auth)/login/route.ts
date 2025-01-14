import { decode } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const SERVER = process.env.NEXT_PUBLIC_BACK_END_URL;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { username, password } = body;

    // Validate that username and password are strings
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "Username hoặc password không hợp lệ!" },
        { status: 400 }
      );
    }

    // Prepare the request to send to the backend server
    const res = await fetch(`${SERVER}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.data) {
      const expire_access_token = decode(data.data.access_token);
      const expire_refresh_token = decode(data.data.refresh_token);

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
      return NextResponse.json({ message: data.message }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xảy ra khi xử lý yêu cầu!" },
      { status: 500 }
    );
  }
}
