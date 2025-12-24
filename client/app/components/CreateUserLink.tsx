"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CreateUserLink() {
  const [href, setHref] = useState("/create-user");
  const [text, setText] = useState("Create user account first");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setHref("/submit-exam");
      setText("Submit exam data");
    }
  }, []);

  return (
    <Link href={href} className="text-blue-600 hover:text-blue-700 underline">
      {text}
    </Link>
  );
}

