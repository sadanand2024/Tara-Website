import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

export default function InvoiceOnboarding({ onFinish }) {
  const [run, setRun] = useState(true);
  const theme = useTheme();

  const steps = [
    {
      target: '.INV-Step-1',
      content:
        "📊 Here's where you can navigate through all your business aspects — select a tab like Business Profile, GST, Customers, and more to view and manage related data.",
      disableBeacon: true
      //   disableOverlay: true
    },
    {
      target: '.INV-Step-2',
      content:
        '📝 After choosing a tab, fill in or update the details specific to that aspect here. Make sure all required fields are completed accurately.'
    },
    {
      target: '.INV-Step-3',
      content:
        "💾 Once you've entered your data, click this button to save your changes. Remember to save each aspect before moving to the next!"
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      if (onFinish) onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run && localStorage.getItem('hasSeenInstructions') !== 'true'}
      continuous
      scrollToFirstStep={true}
      scrollToSteps={true}
      showSkipButton
      showProgress={false}
      callback={handleJoyrideCallback}
      disableOverlayClose={true}
      locale={{
        back: 'Back',
        close: 'I already know',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Guide'
      }}
      styles={{
        options: {
          zIndex: 10000
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(0px)'
        },
        buttonNext: {
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          borderRadius: 4,
          fontSize: '1rem',
          padding: '10px 28px',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.18)',
          border: 'none',
          outline: 'none',
          letterSpacing: '0.04em',
          transition: 'background 0.2s, box-shadow 0.2s'
        },
        buttonNextHover: {
          backgroundColor: theme.palette.primary.dark,
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.22)'
        },
        buttonBack: {
          color: theme.palette.primary.main,
          background: 'transparent',
          border: 'none',
          borderRadius: 4,
          fontSize: '1rem',
          marginRight: 8,
          letterSpacing: '0.04em',
          transition: 'color 0.2s'
        },
        buttonBackHover: {
          color: theme.palette.primary.dark
        },
        buttonClose: {
          color: theme.palette.grey[700],
          background: 'transparent',
          border: 'none',
          fontSize: '1rem',
          borderRadius: 4,
          marginLeft: 8,
          letterSpacing: '0.04em',
          transition: 'color 0.2s'
        },
        buttonCloseHover: {
          color: theme.palette.error.main
        }
      }}
    />
  );
}

InvoiceOnboarding.propTypes = {
  onFinish: PropTypes.func
};
