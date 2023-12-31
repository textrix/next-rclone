import jwt, { JwtPayload } from "jsonwebtoken"
import { api } from "./rclone";

const DEFAULT_SIGN_OPTION = {
    /*expiresIn: "60",*/ // no expire
};

export function signJwtAccessToken(payload, options = DEFAULT_SIGN_OPTION) {
    const secret_key = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret_key, options)
    return token
}

export function verifyJwt(token) {
    try {
        const secret_key = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secret_key)
        return decoded;
    } catch (error) {
        console.log(error)
        return null
    }
}

/**
 * Verifies the authentication based on the provided headers.
 * @param {Headers} headers - The headers object containing the authentication tokens.
 * @returns {number} - The HTTP status code indicating the result of the authentication.
 *                    200 - Authentication successful.
 *                    403 - Forbidden (invalid token or missing authentication).
 *                    401 - Unauthorized (no authentication token provided).
 */
export function verifyAuth(headers) {
    const api_token = headers.get('nrr-api-token')
    if (api_token) {
        if (api_token == process.env.API_TOKEN) {
            return 200
        }
        return 403
    }

    const bearer_token = headers.get('Authorization')
    if (bearer_token) {
        if (verifyJwt(bearer_token)) {
            return 200
        }
        return 403
    }

    return 401
}

export function verifyToken(auth_value) {
    if (auth_value) {
        // When called externally: Checks the pre-issued API token with the value passed as 'Bearer'
        if (auth_value.startsWith('Bearer ')) {
            if (auth_value.replace('Bearer ', '') == process.env.API_TOKEN) {
                return 200
            }
            else {
                return 403 // Fobidden
            }
        }
        // When called from a client component: Resolves to accessToken combined with session
        else if (verifyJwt(auth_value)) {
            return 200
        }
        else {
            return 403
        }
    }
    return 401
}
