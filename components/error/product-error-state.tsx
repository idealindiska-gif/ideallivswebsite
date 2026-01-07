'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface ProductErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ProductErrorState({
  title = 'Unable to Load Products',
  message = 'We\'re having trouble connecting to our product catalog. This is usually temporary.',
  onRetry,
  showHomeButton = true,
}: ProductErrorStateProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>

            <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
              {title}
            </h3>

            <p className="text-muted-foreground mb-6">
              {message}
            </p>

            <div className="flex gap-3 w-full">
              <Button
                onClick={handleRetry}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              {showHomeButton && (
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              )}
            </div>

            <div className="mt-6 text-xs text-muted-foreground">
              <p>If this problem persists, please contact us:</p>
              <a
                href="tel:+46728494801"
                className="text-primary hover:underline"
              >
                +46 728 494 801
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
