"use client";

import { useState, createContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import { log } from "console";

interface User {
  id: string;
  email: string;
  name: string;
}

interface UserContextType {
  user: User | null;
}

interface CustomResponse extends Response {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
export { UserContext };

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(pathname);

    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const response: CustomResponse = await api.get("/auth/me");
      console.log("User fetch response:", response);

      if (response.status === 200) {
        console.log("Authenticated user found");
        const data = response as CustomResponse;
        setUser(data.user);
        console.log("At least");

        if (
          pathname === "/auth/signin" ||
          pathname === "/signup" ||
          pathname === "/"
        ) {
          console.log("Redirecting to /pods");

          router.push("/pods");
        }
        console.log("WOmp");
      } else {
        console.log("No authenticated user found");

        setUser(null);
      }
    } catch {
      console.log("Error fetching user");
      setUser(null);
    }
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
