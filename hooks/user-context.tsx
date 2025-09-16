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

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const response: CustomResponse = await api.get("/auth/me");
      if (response.status === 200) {
        const data = response as CustomResponse;
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
