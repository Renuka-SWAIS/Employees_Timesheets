/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  basePath:
    process.env.NODE_ENV === "production"
      ? "/employee-timesheet"
      : "",
};

export default nextConfig;