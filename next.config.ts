import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.clerk.dev'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://wgjoajkwrtzafykrlnwo.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_YmFsYW5jZWQtcXVldHphbC0xNS5jbGVyay5hY2NvdW50cy5kZXYk',
    CLERK_SECRET_KEY: 'sk_test_QhkC5TLDPwgjOFs9FdF85f74rKHPrRjuwTPKHR5iSs',
  },
};

export default nextConfig;
