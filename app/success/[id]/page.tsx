// app/success/[id]/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SuccessPage() {
  // Correct placement of the hook inside the component
  const { id } = useParams();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full sm:w-96 p-6 shadow-lg ">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>
        <p className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 font-serif">
          Registration Successful
        </p>
        <p className="text-center text-gray-600 mt-2 dark:text-gray-400">
          Thank you for registering, You are now successfully enrolled in our system.<br/>
          {id && <span>Verification  ID: {id}</span>}
        </p>
        <Button className="w-full mt-4" asChild>
          <Link href="/dashboard">Back to Home</Link>
        </Button>
      </Card>
    </div>
  );
}
