/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        RCD_URL: process.env.RCD_URL,
    },
}

module.exports = nextConfig
