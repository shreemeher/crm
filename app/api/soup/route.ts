import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    // Extract the custom header and the 'id' query parameter from the incoming request
    const x = req.headers.get('k-e-y');
    const id = req.nextUrl.searchParams.get('id'); // Extract the 'id' query parameter

    if (!x || !id) {
      return NextResponse.json(
        { status: 'error', message: 'Missing credentials or id parameter' },
        { status: 400 } // Bad Request
      );
    }

    console.log('Custom header received from frontend:', x);
    console.log('ID parameter received from frontend:', id);

    // Forward the GET request to the PHP backend, including both the custom header and the 'id'
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fetchS.php`, {
      params: { id }, // Pass the 'id' as a query parameter to the PHP script
      headers: {
        'Content-Type': 'application/json',
        '0avd': x, // Forward the custom header to the PHP backend
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
