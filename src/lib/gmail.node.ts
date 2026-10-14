// Node-only: imported by the API route, never by the contact form or Sites Worker.
import nodemailer from "nodemailer";
import type { ContactDelivery, ContactEnv } from "./contact";

export function gmailDelivery(env: ContactEnv): ContactDelivery | undefined {
  if (env.EMAIL_PROVIDER !== "gmail") return undefined;
  const user = env.GMAIL_USER?.trim();
  const password = env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const recipient = env.CONTACT_TO_EMAIL?.trim();
  const address = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  const ready = Boolean(
    user &&
    address.test(user) &&
    password &&
    recipient &&
    address.test(recipient),
  );

  return {
    ready,
    async send(message) {
      if (!ready) throw Error("Gmail delivery is not configured");
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: user!, pass: password! },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
      try {
        const result = await transport.sendMail({
          from: { name: "Arvion Studios", address: user! },
          to: recipient!,
          replyTo: message.replyTo,
          subject: message.subject,
          text: message.text,
        });
        if (
          !result.accepted.some(
            (accepted) =>
              accepted.toLowerCase() === recipient!.toLowerCase(),
          )
        )
          throw Error("Gmail did not accept the recipient");
      } finally {
        transport.close();
      }
    },
  };
}
