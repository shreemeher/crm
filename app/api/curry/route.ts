import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    // Extract the custom header from the incoming request
    const x = req.headers.get('k-e-y');

    if (!x) {
      return NextResponse.json(
        { status: 'error', message: 'Missing credentials' },
        { status: 400 } // Bad Request
      );
    }

    console.log('Custom header received from frontend:', x);

    // Forward the GET request to the PHP backend
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fetch.php`, {
      headers: {
        'Content-Type': 'application/json',
        '0avd': x, // Forward the header to the PHP backend
      },
    });

    // Send the PHP backend response back to the client
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    // Handle errors during the request
    if (axios.isAxiosError(error)) {
      console.error('Axios error during data fetch:', error.message);
      return NextResponse.json(
        { status: 'error', message: error.response?.data?.message || 'Data fetch failed. Please try again later.' },
        { status: error.response?.status || 500 } // Use backend's response status or default to 500
      );
    }

    console.error('Unexpected error during data fetch:', (error as Error).message);
    return NextResponse.json(
      { status: 'error', message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 } // Internal Server Error
    );
  }
}
