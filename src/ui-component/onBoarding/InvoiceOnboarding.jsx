import React, { useState, useEffect } from 'react';

const InvoiceOnboarding = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const steps = ['Welcome! This is step 1.', "Here's how to use feature X.", 'Final tip: enjoy using our app!'];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenInstructions', 'true');
    onFinish();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md text-center">
        <p className="mb-4">{steps[step]}</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600" onClick={nextStep}>
            {step === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
          {step !== 2 && (
            <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600" onClick={handleFinish}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceOnboarding;
