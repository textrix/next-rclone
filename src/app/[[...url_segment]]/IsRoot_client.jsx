import * as rclone from '@/utils/rclone'
import Header from './Header'
import FsAbout from './FsAbout'

export default async function IsRoot_client() {
    const [remote_list, error] = await rclone.direct_api('config/listremotes', {})
    if (error) {
        return <div>{error}</div>
    }

    return (
        <div>
            <Header />
            {
                remote_list.remotes.map(async (fs) => {
                    return (
                        <FsAbout params={fs} />
                    )
                })
            }
        </div>
    )
}
