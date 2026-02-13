import "next-auth";

declare module "next-auth" {
  interface User {
    role: "admin" | "client";
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "admin" | "client";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    userId: string;
  }
}
