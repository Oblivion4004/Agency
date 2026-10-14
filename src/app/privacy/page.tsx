import Link from "next/link";
export const metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <main id="main" className="section legal-page">
      <p className="eyebrow">Arvion Studios / PRIVACY</p>
      <h1>
        A little clarity
        <br />
        about your data.
      </h1>
      <p>Last updated: 13 October 2026.</p>
      <h2>Project inquiries</h2>
      <p>
        When you send an inquiry, we use the name, email address, project
        details, and preferences you provide to review your request and respond.
        Please do not include confidential information.
      </p>
      <h2>Delivery and spam protection</h2>
      <p>
        When enabled, inquiries are delivered through Resend and checked by
        Cloudflare Turnstile. A short-lived, hashed network identifier is used
        for rate limiting through Upstash. These providers process information
        needed to deliver messages and protect the form.
      </p>
      <h2>Storage and your choices</h2>
      <p>
        Inquiries may be retained in the studio’s email inbox while discussing
        your project. You can request access or deletion by replying to a
        response from the studio. This website does not use advertising cookies
        or analytics trackers.
      </p>
      <h2>Interactive content</h2>
      <p>
        Motion and 3D features respond to your device preferences. They do not
        record your pointer movements or share them with a third party.
      </p>
      <Link className="text-link" href="/#contact">
        Return to project inquiry ↗
      </Link>
    </main>
  );
}
