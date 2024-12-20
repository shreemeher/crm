import * as jwt from 'jsonwebtoken';

interface DecodedToken {
    user_id: number;
    email: string;
    iat: number;
    exp: number;
    permission:string;
}

export default function decode(): DecodedToken | null {
    try {
        // Get the token from localStorage
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error('No authenticated');
            return null;
        }

        // Decode the JWT (without verifying the signature)
        const decoded = jwt.decode(token, { complete: true });

        if (decoded && decoded.payload) {
            // Return the decoded payload
            return decoded.payload as DecodedToken;
        } else {
            console.error('Unable to decode token');
            return null;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
