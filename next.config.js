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

//import os from 'os'
//import fs from 'fs'
//const os = require('os')
//const fs = require('fs')

module.exports = async (phase, { defaultConfig }) => {
    /*
    const tmpDir = `${os.tmpdir()}/nrr`
    //const fs = require('fs')
    fs.mkdir(`${tmpDir}`, { recursive: true }, (err) => {
        if (err) throw err
    })
    */

    return nextConfig
}
