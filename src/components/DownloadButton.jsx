//
export default function DownloadButton() {
    const handleDownload = async () => {
        const response = await fetch('/api/streamdownload')
        const blob = await response.blob()

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'downloadedfile.txt'
        document.body.appendChild(a)
        a.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }

    return (
        <button onClick={handleDownload}>File Download</button>
    )
}