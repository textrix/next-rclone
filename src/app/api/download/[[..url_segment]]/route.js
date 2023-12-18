import axios from 'axios'

export async function GET(request, response) {
    // Extract the filename array (from the catch-all route)
    const { query: { filename } } = request

    // Combine the array into a single string to create an external URL
    const externalUrl = `https://example.com/${filename.join('/')}`

    try {
        const externalUrl = 'https://example.com/largefile.txt' // External file URL

        // Perform the GET request using Axios
        const externalResponse = await axios({
            method: 'get',
            url: externalUrl,
            responseType: 'stream'
        })

        // Set the headers for the response
        response.setHeader('Content-Type', externalResponse.headers['content-type'] || 'text/plain')
        response.setHeader('Content-Disposition', `attachment filename="downloadedfile.txt"`)

        // Stream the external response to the client
        externalResponse.data.pipe(response)
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching the external file:', error)
        response.status(500).send('Error fetching the external file')
    }
}
