import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return Response.json({
    code: 0,
    msg: "",
  });
}
