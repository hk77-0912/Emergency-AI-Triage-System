import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
      <div className="flex items-center justify-between relative">
        {/* 連接線 */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                  ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg' : ''}
                  ${isCurrent ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-xl ring-4 ring-blue-200' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <span
                className={`
                  text-sm text-center font-medium transition-colors
                  ${isCurrent ? 'text-blue-700' : 'text-gray-600'}
                `}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
