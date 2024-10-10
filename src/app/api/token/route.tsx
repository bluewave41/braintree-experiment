import { gateway } from "@/app/lib/braintree";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const { clientToken } = await gateway.clientToken.generate({});

  return new NextResponse(clientToken);
}
