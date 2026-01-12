'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CompletionScreenProps {
  surveyTitle: string;
}

export function CompletionScreen({ surveyTitle }: CompletionScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Clear the current survey's session to allow new ones
  useEffect(() => {
    // This helps if user wants to test again in development
    // In production, the localStorage prevents retaking
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50 p-6">
      {showConfetti && <Confetti />}
      
      <Card className="max-w-2xl w-full border-primary/30 shadow-2xl">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-pink-500 rounded-full mb-4 heart-pulse">
              <svg
                className="w-14 h-14 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500 mb-3">
              Thank You! 💕
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Your anonymous responses have been securely recorded
            </p>
            
            {/* Privacy Confirmation */}
            <div className="bg-primary-lighter border border-primary/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your identity remains 100% private and anonymous
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-pink-100 border-2 border-primary/30 rounded-2xl p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-4xl opacity-20">💝</div>
            <div className="absolute bottom-2 left-2 text-4xl opacity-20">💖</div>
            
            <div className="mb-4">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-3xl rounded-xl shadow-lg">
                🎁 $50 COUPON
              </span>
            </div>
            <p className="text-xl font-medium text-foreground mb-2">
              Use code <span className="font-mono font-bold text-2xl text-primary bg-white px-3 py-1 rounded">VIXEN50</span>
            </p>
            <p className="text-muted-foreground text-lg">
              on <a href="https://www.vixen.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">www.vixen.com</a>
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">💝</span>
              <span>We appreciate your honest feedback</span>
            </p>
            <p className="font-medium text-primary">
              Your voice helps us improve & serve you better
            </p>
          </div>

          {/* Navigation Button */}
          <div className="mt-8 flex justify-center">
            <Link href="/?new=true">
              <Button variant="primary" size="lg" className="gap-2">
                <span>💖</span>
                Take Another Survey
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'][
                Math.floor(Math.random() * 5)
              ],
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
