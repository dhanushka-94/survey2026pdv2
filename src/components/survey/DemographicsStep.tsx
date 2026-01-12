'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { AgeRange, Gender, type DemographicsData } from '@/lib/types';

interface DemographicsStepProps {
  onSubmit: (data: DemographicsData) => void;
}

export function DemographicsStep({ onSubmit }: DemographicsStepProps) {
  const [ageRange, setAgeRange] = useState<AgeRange | ''>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that both fields are selected
    if (!ageRange || !gender) {
      setError('Please select both age range and gender to continue');
      return;
    }
    
    setError('');
    onSubmit({ age_range: ageRange as AgeRange, gender: gender as Gender });
  };

  const ageOptions = [
    { value: '', label: 'Select your age range *' },
    { value: AgeRange.RANGE_18_24, label: '18-24' },
    { value: AgeRange.RANGE_25_34, label: '25-34' },
    { value: AgeRange.RANGE_35_44, label: '35-44' },
    { value: AgeRange.RANGE_45_54, label: '45-54' },
    { value: AgeRange.RANGE_55_PLUS, label: '55+' },
  ];

  const genderOptions = [
    { value: '', label: 'Select your gender *' },
    { value: Gender.MALE, label: 'Male' },
    { value: Gender.FEMALE, label: 'Female' },
    { value: Gender.OTHER, label: 'Other' },
    { value: Gender.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl heart-pulse">💖</div>
        </div>
        <CardTitle className="text-center">Welcome! Your Privacy Matters</CardTitle>
        <CardDescription className="text-center">
          This survey is <strong className="text-primary">100% anonymous</strong>. We only collect age range and gender - no personal information, no tracking, no data sharing.
        </CardDescription>
        
        {/* Privacy Badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <span className="privacy-badge">
            🔒 Fully Anonymous
          </span>
          <span className="privacy-badge">
            🛡️ Secure & Private
          </span>
          <span className="privacy-badge">
            ❤️ Your Voice Matters
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Age Range"
            options={ageOptions}
            value={ageRange}
            onChange={(e) => {
              setAgeRange(e.target.value as AgeRange);
              setError('');
            }}
            required
          />

          <Select
            label="Gender"
            options={genderOptions}
            value={gender}
            onChange={(e) => {
              setGender(e.target.value as Gender);
              setError('');
            }}
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">⚠️ {error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={!ageRange || !gender}
          >
            Start Survey 💖
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            * All fields are required to continue
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
