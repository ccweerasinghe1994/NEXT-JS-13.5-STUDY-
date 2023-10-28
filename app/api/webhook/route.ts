import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log(
    "webhook called---------------------------------------------------✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅",
  );
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.log(
      "❌❌❌❌💀💀💀💀💀❌❌❌❌,Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.log("❌❌❌❌💀💀💀💀💀❌❌❌❌,Error occurred -- no svix headers");
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    // eslint-disable-next-line camelcase
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;
    const createdData = await createUser({
      clerkId: id,
      // eslint-disable-next-line camelcase
      email: email_addresses[0].email_address,
      // eslint-disable-next-line camelcase
      name: `${first_name} ${last_name ?? ""}`,
      // eslint-disable-next-line camelcase
      picture: image_url,
      username: username ?? "USER NAME NOT FOUND",
    });
    return NextResponse.json({
      message: "OK",
      user: createdData,
    });
  }
  if (eventType === "user.updated") {
    // eslint-disable-next-line camelcase
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;
    const updatedUser = await updateUser({
      clerkId: id,
      updateData: {
        // eslint-disable-next-line camelcase
        email: email_addresses[0].email_address,
        // eslint-disable-next-line camelcase
        name: `${first_name} ${last_name ?? ""}`,
        // eslint-disable-next-line camelcase
        picture: image_url,
        username: username ?? "USER NAME NOT FOUND",
      },
      path: `/profile/${id}`,
    });
    return NextResponse.json({
      message: "OK",
      user: updatedUser,
    });
  }

  if (eventType === "user.deleted") {
    // eslint-disable-next-line camelcase
    const { id } = evt.data;
    const deletedUser = await deleteUser({
      clerkId: id!,
    });
    return NextResponse.json({
      message: "OK",
      user: deletedUser,
    });
  }

  return new Response("", { status: 201 });
}
