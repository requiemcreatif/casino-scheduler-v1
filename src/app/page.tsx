import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to dashboard or login
  redirect("/dashboard");
}
