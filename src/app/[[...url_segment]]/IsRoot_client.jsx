import * as rclone from '@/utils/rclone'
import Header from './Header'
import FsAbout from './FsAbout'

export default async function IsRoot_client() {
    const [remote_list, error] = await rclone.direct_api('config/listremotes', {})
    if (error) {
        return <div>{error}</div>
    }

    function only_show_fs(remotes) {
        const show_list = process.env.RCD_SHOW?.split(',')
        if (Array.isArray(show_list) && 0 < show_list.length) {
            const matched_list = remotes.filter(item => show_list.includes(item))
            if (0 < matched_list.length) {
                return matched_list
            }
        }
        console.log('no matched')
        return remotes
    }

    const matched_list = only_show_fs(remote_list.remotes)

    return (
        <div>
            <Header />
            {
                matched_list.map(async (fs) => {
                    return (
                        <FsAbout params={fs} />
                    )
                })
            }
        </div>
    )
}
