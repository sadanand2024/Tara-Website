const servicesMoreData = {
  'income-tax': {
    title: 'Income Tax & TDS',
    pages: {
      'itr-filing': {
        heroTitle: 'File Your Income Tax Return (ITR) Easily',
        heroSubtitle: 'Fast, secure, and hassle-free ITR filing experience with expert support.',
        cta: {
          label: 'Start Filing Now',
          link: '/file-itr'
        },
        includes: [
          'Upload & auto-read Form 16',
          'Smart tax calculations',
          'Claim deductions & exemptions',
          'Expert review before submission',
          'Track your refund status'
        ],
        documents: [
          'Form 16 from all employers',
          'Interest certificates from banks/post office',
          'Investment proof for deductions',
          'Form 26AS',
          'Aadhaar & PAN Card'
        ],
        faqs: [
          {
            question: 'Is it mandatory to file ITR?',
            answer: 'Yes, if your income exceeds the basic exemption limit.'
          },
          {
            question: 'What if I miss the due date?',
            answer: 'You can still file a belated return with a late fee under section 234F.'
          }
        ]
      }
    }
  },
  gst: {
    title: 'GST Services',
    pages: {
      registration: {
        title: 'GST Registration',
        description: 'Get your GST number hassle-free with our end-to-end registration support.'
      }
      // ...
    }
  }
};

export default servicesMoreData;
