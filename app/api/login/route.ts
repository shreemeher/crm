import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  console.log('ENV Variable',process.env.NEXT_PUBLIC_API_URL);
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Missing credentials.' },
        { status: 400 } // Bad Request
      );
    }

    // Forward login data to the PHP backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login.php`,
      { email, password },
      // { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.status === 'success') {
      // Extract authToken from backend response
      const authToken = response.data.auth_token;

      if (!authToken) {
        return NextResponse.json(
          { status: 'error', message: 'Authentication token missing in backend response.' },
          { status: 500 } // Internal Server Error
        );
      }

      // Store the auth_token in localStorage (browser side)
      return NextResponse.json(
        {
          status: 'success',
          message: 'Login successful!',
          auth_token: authToken,
        },
        {
          status: 200,
          headers: {
            // Custom header for client-side JavaScript to store in localStorage
            'x-auth-token': authToken,
          },
        }
      );

    } else {
      // Handle login failure
      return NextResponse.json(
        { status: 'error', message: response.data.message },
        { status: 401 } // Unauthorized
      );
    }
  } catch (error: unknown) {
    // Handle errors like network issues or backend errors
    if (axios.isAxiosError(error)) {
      console.error('Axios error during login:', error.message);
      return NextResponse.json(
        { status: 'error', message: error.response?.data?.message || 'Login failed. Please try again later.' },
        { status: error.response?.status || 500 } // Use backend's response status or default to 500
      );
    }

    console.error('Unexpected error during login:', (error as Error).message);
    return NextResponse.json(
      { status: 'error', message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 } // Internal Server Error
    );
  }
}
