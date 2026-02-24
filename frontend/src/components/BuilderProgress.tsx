import React from 'react';
import { Check } from 'lucide-react';

interface BuilderProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const BuilderProgress: React.FC<BuilderProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  return (
    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.09)' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'rgba(255, 255, 255, 0.55)',
          marginBottom: '16px',
        }}
      >
        ÉTAPE {currentStep}/{totalSteps}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto' }}>
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: isCompleted
                      ? '#10b981'
                      : isCurrent
                      ? '#E8D5B0'
                      : 'rgba(255, 255, 255, 0.09)',
                    color: isCompleted || isCurrent ? '#0a0a0a' : 'rgba(255, 255, 255, 0.4)',
                    transition: 'all 0.3s',
                  }}
                >
                  {isCompleted ? <Check size={16} /> : stepNumber}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent
                      ? '#E8D5B0'
                      : isCompleted
                      ? 'rgba(255, 255, 255, 0.7)'
                      : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  {label}
                </div>
              </div>
              {stepNumber < totalSteps && (
                <div
                  style={{
                    width: '24px',
                    height: '2px',
                    background: isCompleted
                      ? '#10b981'
                      : 'rgba(255, 255, 255, 0.09)',
                    transition: 'all 0.3s',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BuilderProgress;

