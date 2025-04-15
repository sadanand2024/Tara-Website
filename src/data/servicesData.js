const servicesData = {
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

  registration: {
    title: 'Business Registration',
    pages: {
      'private-limited': {
        customComponent: 'PrivateLimitedPage',
        heroTitle: 'Start your business the right way',
        heroSubtitle: 'Private Limited Company Registration – Fast, Easy, Transparent!',
        ctas: [
          { label: 'Get Started', link: '/register/private-limited' },
          { label: 'Talk to Expert', link: '/contact' }
        ],
        intro:
          "We don't just register companies. We help you build business foundations. Here's everything you get when you choose TARA FIRST.",
        sections: [
          {
            title: 'Incorporation Essentials',
            items: [
              'Company name approval filing',
              'DIN for 2 directors',
              '2 Class-III DSCs',
              'MOA + AOA drafting',
              'SPICe+ form filing',
              'PAN & TAN',
              'Certificate of Incorporation'
            ]
          },
          {
            title: 'Documents & Deliverables',
            items: [
              'Digital incorporation kit',
              'Company Master Data profile',
              'Board resolution templates',
              'Personalized compliance checklist',
              'All documents securely stored in your document wallet'
            ]
          },
          {
            title: 'Add-on Value & Expert Support',
            items: [
              'Dedicated Relationship Manager',
              'Phone, email & chat support',
              'Name suggestion & validation assistance',
              'Free business structure advice',
              'Free document storage (Doc Wallet)',
              'Priority turnaround option'
            ]
          }
        ]
      }
    }
  },

  gst: {
    title: 'Goods & Services Tax (GST)',
    pages: {
      registration: {
        heroTitle: 'Simplify Your GST Registration',
        heroSubtitle: 'Seamless GST registration with expert support and document filing.',
        cta: {
          label: 'Apply for GST',
          link: '/services/gst/registration'
        },
        includes: [
          'GST Application Preparation & Filing',
          'Dedicated Relationship Manager',
          'ARN Tracking and Follow-up',
          'Document review and correction assistance',
          'Post-registration advisory'
        ],
        documents: [
          'PAN Card of business or applicant',
          'Proof of business address',
          'Aadhaar card',
          'Bank account details',
          'Photograph of promoter/owner'
        ],
        faqs: [
          {
            question: 'Who needs GST registration?',
            answer: 'Any business with turnover above ₹40L (or ₹20L for services) must register for GST.'
          },
          {
            question: 'How long does it take to get a GST number?',
            answer: 'Usually within 3–7 working days, subject to document verification.'
          }
        ]
      }
    }
  }
};

export default servicesData;
