import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <main className="h-screen bg-stone-200 flex flex-col justify-center items-center gap-2">
      <Link href="/signup">
        <Button>Join Us</Button>
      </Link>
      <Link href="/login">
        <Button variant="link">Already have an account?</Button>
      </Link>
    </main>
  );
}
