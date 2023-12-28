/** @type {import('next').NextConfig} */
const nextConfig = {
    /*async rewrites() {
        return [{
            source: '/api/upload/:path*',
            destination: process.env.RCD_URL + '/operations/uploadfile/:path*',
        },];
    },*/
    env: {
        RCD_URL: process.env.RCD_URL,
    },
    logging: {
        fetches: {
          fullUrl: true,
        },
      },
}

module.exports = async (phase, { defaultConfig }) => {
    const tmpDir = 'tmp/nrr';
    const fs = require('fs')
    fs.mkdir(`/${tmpDir}`, { recursive: true }, (err) => {
        if (err) throw err
    })

    return nextConfig
}
