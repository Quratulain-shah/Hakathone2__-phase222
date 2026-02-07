import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';

// Initialize Better Auth with JWT plugin
const auth = betterAuth({
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET || 'fallback_secret_for_development',
    }),
  ],
  database: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5hwVP3rSOyeF@ep-long-breeze-addqlmpg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
  // Add user configuration
  user: {
    fields: {
      name: 'name',
      email: 'email',
    },
  },
  // Add email & password configuration
  emailAndPassword: {
    enabled: true,
  },
});

// Create the Next.js API route handlers
export const { GET, POST } = auth;