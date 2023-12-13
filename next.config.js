/** @type {import('next').NextConfig} */
const nextConfig = {
    /*async rewrites() {
        return [{
            source: '/api/rclone/:path*',
            destination: process.env.RCD_URL + '/:path*',
        },];
    },*/
    env: {
        RCD_URL: process.env.RCD_URL,
    },
}

module.exports = nextConfig
