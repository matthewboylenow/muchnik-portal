# Authentication & Security

## Overview

Two user roles with distinct access levels, implemented via NextAuth.js v5 (Auth.js). Simple credential-based auth — no OAuth social login needed for the platform itself (Google OAuth is only used server-side for API data collection).

## User Roles

| Role | Access | Description |
|------|--------|-------------|
| `admin` | `/(admin)/*` routes | Full SEO intelligence dashboard — Matthew's agency view |
| `client` | `/(portal)/*` routes | Simplified performance portal — Kirill's view |

## Auth Implementation

### NextAuth.js v5 Configuration

**File:** `src/lib/auth.ts`

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) return null;

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        // Update last login
        await db.update(users)
          .set({ lastLoginAt: new Date() })
          .where(eq(users.id, user.id));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
```

### Type Augmentation

**File:** `src/types/next-auth.d.ts`

```typescript
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role: 'admin' | 'client';
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'client';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    userId: string;
  }
}
```

## Route Protection

### Middleware

**File:** `src/middleware.ts`

```typescript
import { auth } from './lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes
  if (pathname === '/login' || pathname === '/') {
    if (session) {
      // Redirect logged-in users to their dashboard
      const redirectPath = session.user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/portal/overview';
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require auth
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Admin routes — require admin role
  if (pathname.startsWith('/admin') && session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/portal/overview', req.url));
  }

  // Portal routes — allow both admin and client
  // (Admin can view the portal to see what client sees)
  if (pathname.startsWith('/portal')) {
    return NextResponse.next();
  }

  // API cron routes — require CRON_SECRET, not user auth
  if (pathname.startsWith('/api/cron')) {
    return NextResponse.next(); // Cron auth handled in route handlers
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};
```

## Login Page

**Route:** `/login`

Design:
- Centered card on dark background with subtle gradient mesh
- Muchnik Elder Law logo at top (for client familiarity) OR platform logo
- Email + password fields
- "Sign In" button
- No registration — accounts are seeded/created by admin only
- Error state: subtle red glow on the card border with error message
- Loading state: button shows spinner

After login:
- Admin → redirect to `/admin/dashboard`
- Client → redirect to `/portal/overview`

## Seed Script

**File:** `src/lib/db/seed.ts` (include user seeding)

```typescript
import { hash } from 'bcryptjs';

async function seedUsers() {
  const adminPasswordHash = await hash('initial-admin-password', 12);
  const clientPasswordHash = await hash('initial-client-password', 12);

  await db.insert(users).values([
    {
      email: 'matthew@yourdomain.com',  // Replace with actual
      passwordHash: adminPasswordHash,
      name: 'Matthew',
      role: 'admin',
    },
    {
      email: 'kmuchnik@muchnikelderlaw.com',
      passwordHash: clientPasswordHash,
      name: 'Kirill Muchnik',
      role: 'client',
    },
  ]).onConflictDoNothing();

  console.log('Users seeded. CHANGE PASSWORDS AFTER FIRST LOGIN.');
}
```

**Important:** Include a "Change Password" feature in the settings for both portals so initial passwords can be updated.

## API Route Protection

For non-cron API routes (report generation, data queries):

```typescript
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For admin-only endpoints:
  if (session.user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ... handler logic
}
```

## Security Checklist

- [ ] All passwords hashed with bcrypt (cost factor 12)
- [ ] JWT tokens have 30-day expiry
- [ ] Cron endpoints verify CRON_SECRET
- [ ] Admin routes blocked for client role at middleware level
- [ ] API keys stored in environment variables only, never in code
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enforced (Vercel handles this automatically)
- [ ] Rate limiting on login endpoint (consider `@vercel/edge-rate-limit` or basic implementation)
- [ ] No sensitive data in JWT payload (role and ID only, not email or password)
- [ ] Client portal never exposes raw keyword positions or technical SEO data
- [ ] Password change functionality available post-login
