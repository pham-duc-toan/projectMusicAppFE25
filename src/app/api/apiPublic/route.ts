import { NextRequest, NextResponse } from "next/server";

const SERVER = process.env.NEXT_PUBLIC_BACK_END_URL;
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { method, path, query, option } = body;

  try {
    let queryParams = "";
    if (query) {
      queryParams = new URLSearchParams(query).toString();
    }

    const body = option ? JSON.stringify(option) : undefined; // Chỉ đặt body nếu có option

    const data = await fetch(`${SERVER}${path}?${queryParams}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body && { body }), // Chỉ thêm body nếu có
    }).then((res) => res.json());

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch data from backend" },
      { status: 500 }
    );
  }
}
