import { getServerSession } from 'next-auth'
import IsRoot_client from './IsRoot_client'
import IsRoot from './IsRoot'
import IsNotRoot from './IsNotRoot'
import { redirect } from 'next/navigation'

export default async function CatchAll(context) {
    const { params } = context
    const { url_segment } = params
    const level = (!url_segment || params.length == 0) ? 0 : params.length

    const session = await getServerSession()
    if (session && session.user) {
        return (0 == level) ? (<IsRoot_client /> ) : <IsNotRoot params={url_segment} />
    }
    else {
        redirect('/login')
    }
}
