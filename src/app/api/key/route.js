import { signJwtAccessToken } from '@/utils/jwt'
import { NextRequest } from 'next/server'
 
export async function POST(request) {
    const body = await request.json()

    /*const user = await prisma.user.findFirst({
      where: {
        email: body.username,
      },
    })*/
    const user = { name: 'admin', password: 'admin' }
  
    if (user && user.password == body.password) {/* && (await bcrypt.compare(body.password, user.password))) {
        const { password, ...userWithoutPass } = user;
*/

        const { password, ...userWithoutPass } = user

        //const accessToken = signJwtAccessToken(userWithoutPass);
        const accessToken = signJwtAccessToken(userWithoutPass)
        const result = {
            ...userWithoutPass,
            accessToken,
        };


        return new Response(JSON.stringify(result))
    } else {
        return new Response(JSON.stringify(null))
    } 
}
