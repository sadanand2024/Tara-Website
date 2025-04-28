const servicesData = {
  'income-tax': {
    title: 'Income Tax & TDS',
    pages: {
      'itr-filing': {
        heroSection: {
          title: 'File Your Income Tax Return (ITR) with Confidence',
          subtitle: 'Expert-reviewed ITR filing for individuals, salaried professionals, freelancers, business owners, and NRIs.',
          ctas: [
            { label: 'File My ITR Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Tax Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Documents', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Salaried, Business, Freelancers, NRIs', icon: 'PersonOutlined', size: 20 },
            { text: 'Data Privacy & CA Verification', icon: 'LockOutlined', size: 20 },
            { text: 'Covers All ITRs (1 to 7)', icon: 'GavelOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Income exceeds basic exemption limit (₹2.5L/₹3L/₹5L)',
          'Foreign income or assets',
          'Claiming a refund',
          'Companies, LLPs, partnership firms',
          'Multiple sources of income',
          'Loan, visa, or tender applicants'
        ],
        smartITRSelector: {
          title: 'Not Sure Which ITR Form You Need?',
          description: "Answer a few simple questions and we'll guide you to the right ITR form.",
          questions: [
            'Are you salaried, self-employed, or running a business?',
            'Do you have capital gains (e.g., shares, mutual funds, property)?',
            'Do you have foreign income or NRI status?',
            'Are you filing for a company, LLP, or firm?',
            'Do you own more than one house property?'
          ],
          cta: { label: 'Continue Filing ITR-2', icon: 'AssignmentTurnedInOutlined', size: 24 },
          alternativeOption: {
            label: 'Already know your ITR Form? Choose manually:',
            dropdown: ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4', 'ITR-5', 'ITR-6', 'ITR-7']
          }
        },
        pricing: {
          title: 'Choose a Plan That Fits Your Income Profile',
          plans: [
            { name: 'ITR-1 / ITR-2', bestFor: 'Salaried / House Property Income', price: '₹499 – ₹799' },
            { name: 'ITR-3 / ITR-4', bestFor: 'Freelancers / Professionals / Traders', price: '₹999 – ₹1,499' },
            { name: 'ITR-5 / ITR-6', bestFor: 'Partnership Firms / Companies', price: '₹2,499 – ₹4,999' },
            { name: 'NRI / Capital Gains ITR', bestFor: 'NRI, Share Sale, Crypto, Property Sale', price: '₹1,999 – ₹3,999' }
          ],
          note: '*Pricing includes expert review, computation, online filing, and acknowledgment download.'
        },
        whatsIncluded: [
          'Dedicated CA/Tax Expert review',
          'Income & deduction computation',
          'Selection of correct ITR form',
          'Tax liability/refund calculation',
          'Filing return on income tax portal',
          'Download & email ITR-V acknowledgment',
          'Revision/re-filing support (if required)'
        ],
        documentsRequired: [
          'PAN, Aadhaar',
          'Form 16 / Salary slips',
          'Interest Certificates (FD/SB accounts)',
          'Capital Gains Statement (shares/mutual funds)',
          'TDS Certificates (Form 16A/26AS)',
          'Business income details',
          'Investment proofs (80C, 80D, etc.)',
          'Bank statements',
          'Foreign income/asset details'
        ],
        howItWorks: [
          'Use Smart Selector or choose ITR type manually',
          'Upload your documents securely',
          'We compute tax and share draft for approval',
          'File return with DSC/OTP verification',
          'Receive ITR-V and e-filing acknowledgment',
          'Get refund directly in your bank account (if applicable)'
        ],
        timeline: '1–3 working days (subject to document readiness)',
        whyChooseUs: [
          'Handled by Qualified Chartered Accountants',
          'All ITR Types Covered (ITR 1 to 7)',
          'Free re-filing if return is rejected',
          'Audit assistance for businesses',
          'Personalised advisory for tax saving',
          'Support for visa/tender/employment ITRs'
        ],
        faqs: [
          {
            question: 'What if I miss the deadline?',
            answer: 'You can file a belated return with late fee, but earlier is better to avoid penalties.'
          },
          {
            question: 'Is ITR filing mandatory even if tax is already deducted?',
            answer: 'Yes, if your total income exceeds the limit or you want a refund.'
          },
          {
            question: 'Can I file ITR without Form 16?',
            answer: 'Yes, if you provide salary slips or Form 26AS.'
          },
          {
            question: 'Will I get support if I get a notice later?',
            answer: 'Yes, we offer notice management and rectification services.'
          },
          {
            question: 'Can you help me revise last year’s return?',
            answer: 'Yes, revised return filing is available.'
          }
        ],
        relatedServices: [
          'Advance Tax Calculation',
          'Capital Gains Advisory',
          'Notice Handling',
          'TDS Return Filing',
          'Net Worth Certificate for Visa'
        ],
        stickyFooterCta: {
          text: 'File your income tax return today with expert guidance — accurate, secure, and stress-free.',
          buttons: [
            { label: 'Start Filing Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to CA', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Documents', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'notice-management': {
        heroSection: {
          title: 'Received an Income Tax Notice? Let Us Handle It.',
          subtitle:
            'Expert-reviewed responses to notices under Section 139(9), 143(1), 143(2), 245, defective returns, mismatch in AIS/Form 26AS, and more.',
          ctas: [
            { label: 'Upload Your Notice', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Book a Consultation', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a CA Now', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'CA-Led Notice Handling', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'Fast Turnaround (2–4 Days)', icon: 'AccessTimeOutlined', size: 20 },
            { text: 'Covers 10+ Common Sections', icon: 'GavelOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Intimation under Section 143(1)',
          'Defective Return Notice (139(9))',
          'Scrutiny Notice (143(2))',
          'Notice under Section 245 (Adjustment of Refund)',
          'Reassessment or demand notice',
          'High-value transaction mismatch (AIS, Form 26AS)'
        ],
        pricing: {
          title: 'Flat Pricing for Peace of Mind',
          plans: [
            { name: 'Basic (143(1), 245)', bestFor: 'Clarification/response filing', price: '₹999' },
            { name: 'Moderate (139(9), 26AS/AIS mismatch)', bestFor: 'Defective return, reconciliation', price: '₹1,499' },
            { name: 'Scrutiny (143(2), 148)', bestFor: 'Drafting & representation support', price: '₹2,999 – ₹4,999' }
          ],
          note: '*Final price depends on complexity. Includes consultation, drafting, filing response, and support.'
        },
        whatsIncluded: [
          'Review of the notice and applicable section',
          'Review of previous ITR, AIS, Form 26AS, and documents',
          'Preparation of a professional and compliant response',
          'Filing the response on the income tax portal',
          'Support in case of escalation, follow-up or additional queries',
          'Guidance on preventive measures going forward'
        ],
        documentsRequired: [
          'Copy of the Income Tax Notice (PDF/Screenshot)',
          'ITR Acknowledgment of relevant year',
          'Form 26AS & AIS report',
          'PAN and Aadhaar',
          'TDS certificates / Form 16 / income proofs',
          'Any other communication or supporting documents'
        ],
        howItWorks: [
          'Upload your notice and basic details',
          'Get a call from a CA within 24 hours',
          'Review of notice + related financials',
          'Drafting of appropriate response',
          'Filing response on the income tax portal',
          'Receive acknowledgment and resolution follow-up'
        ],
        timeline: '2–4 working days (Urgent option available)',
        whyChooseUs: [
          'Experienced CA team familiar with all notice types',
          'Timely and compliant replies',
          'Guidance on preventing future notices',
          'Help with rectification, appeal, or revised filing if needed',
          'Support until case is closed'
        ],
        faqs: [
          {
            question: 'Is it serious if I receive a notice?',
            answer: 'Not always — some are just intimation or clarification requests. But all notices must be responded to.'
          },
          {
            question: 'Can I handle the notice myself?',
            answer: 'You can, but professional help ensures accuracy and avoids escalations.'
          },
          {
            question: 'What happens if I don’t respond?',
            answer: 'Penalties, refund adjustment, or further scrutiny can occur.'
          },
          {
            question: 'Will you talk to the income tax officer for me?',
            answer: 'Yes, we assist with online replies, clarification calls, and even appeals (if required).'
          },
          {
            question: 'Can I revise my ITR after a notice?',
            answer: 'Yes, in many cases that’s part of the solution — and we’ll handle it.'
          }
        ],
        relatedServices: [
          'Income Tax Return Filing',
          'ITR Revision / Rectification',
          'Form 26AS / AIS Reconciliation',
          'Advance Tax Planning',
          'TDS Filing & Correction'
        ],
        stickyFooterCta: {
          text: 'Received a tax notice? Don’t panic. Let our experts respond accurately and protect your interests.',
          buttons: [
            { label: 'Upload Notice & Get Help', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a CA Now', icon: 'PhoneOutlined', size: 24 },
            { label: 'Book a Consultation', icon: 'AssignmentTurnedInOutlined', size: 24 }
          ]
        }
      },
      'tds-return': {
        heroSection: {
          title: 'File Your TDS Returns Accurately & On Time',
          subtitle: 'Hassle-free quarterly TDS filing with CA expert review — for businesses, employers, and property buyers.',
          ctas: [
            { label: 'Help Me Choose TDS Form', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Schedule a Call', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Deduction Sheet', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Quarterly Filing (24Q, 26Q, 27Q, 26QB)', icon: 'ReceiptOutlined', size: 20 },
            { text: 'CA-Verified Filing', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'Avoid Penalties & Notices', icon: 'GavelOutlined', size: 20 }
          ]
        },
        smartTDSSelector: {
          title: 'Not Sure Which TDS Return Form You Need?',
          description: 'Answer a few questions, and we will guide you to the right TDS return type.',
          questions: [
            'Are you deducting TDS on salary payments?',
            'Are you paying contractors, rent, or professional fees?',
            'Is the payee a non-resident?',
            'Are you filing TDS for property purchase?'
          ],
          cta: { label: 'Start Recommended TDS Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
          alternativeOption: {
            label: 'Already know? Choose your TDS Form:',
            dropdown: ['24Q', '26Q', '27Q', '26QB']
          }
        },
        pricing: {
          title: 'Transparent Quarterly & Annual Pricing',
          plans: [
            { name: 'Form 24Q (Salary)', bestFor: 'Employers', price: '₹999 / Quarter' },
            { name: 'Form 26Q (Non-Salary)', bestFor: 'Business Payments', price: '₹999 / Quarter' },
            { name: 'Form 27Q (NRI Payments)', bestFor: 'NRI/Foreign Entity Payments', price: '₹1,499 / Quarter' },
            { name: 'Form 26QB (Property Purchase)', bestFor: 'Property Buyers', price: '₹999 / Filing' },
            { name: 'Annual Combo Plan', bestFor: 'All 4 Quarters (24Q/26Q)', price: '₹3,499 / Year' }
          ],
          note: '*Prices include filing + acknowledgment + Form 16/16A generation. Extra charges apply for bulk cases.'
        },
        whatsIncluded: [
          'Data validation by CA expert',
          'Computation of TDS & interest (if any)',
          'Preparation & Filing of return',
          'Form 16/16A generation',
          'Acknowledgment download',
          'Revision support within quarter',
          'Reminder alerts for due dates'
        ],
        documentsRequired: [
          'TAN & PAN of deductor',
          'Deductee PANs and payment details',
          'Payment challans (CIN details)',
          'Salary structure (for 24Q)',
          'Property agreement (for 26QB)'
        ],
        howItWorks: [
          'Select your TDS return type or use smart selector',
          'Submit deduction data via portal/upload',
          'We prepare & validate the return',
          'File return on TRACES/ITD portal',
          'Receive acknowledgment & Form 16/16A'
        ],
        timeline: '1–3 Working Days (Urgent same-day also available)',
        whyChooseUs: [
          'Expert-reviewed filings for accuracy',
          'Avoid penalties under Sec 234E/271H',
          'Support for corrections and NIL returns',
          'Form 16/16A included at no extra charge',
          'Dedicated tax expert assistance'
        ],
        faqs: [
          {
            question: 'What if I miss my TDS filing deadline?',
            answer: 'Penalty of ₹200/day applies plus possible late filing fees. Timely filing is important.'
          },
          {
            question: 'Can I revise TDS returns later?',
            answer: 'Yes. We help you file correction returns at minimal cost.'
          },
          {
            question: 'Is TAN mandatory?',
            answer: 'Yes, for all TDS returns except 26QB (property buyer filing).'
          }
        ],
        relatedServices: ['Payroll Processing', 'Advance Tax Payment', 'TAN Application', 'Accounting & Bookkeeping', 'Income Tax Filing'],
        stickyFooterCta: {
          text: 'File your TDS Returns on time — avoid penalties and stay compliant!',
          buttons: [
            { label: 'Start My TDS Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Expert', icon: 'PhoneOutlined', size: 24 }
          ]
        }
      },
      'advance-tax': {
        heroSection: {
          title: 'Calculate & Pay Your Advance Tax Accurately',
          subtitle: 'Avoid penalties by paying advance tax on time — expert-calculated projections and payment guidance.',
          ctas: [
            { label: 'Calculate My Advance Tax', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Tax Advisor', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Income Details', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Quarterly Payment Guidance', icon: 'EventNoteOutlined', size: 20 },
            { text: 'CA-Verified Projections', icon: 'GavelOutlined', size: 20 },
            { text: 'Fully Confidential', icon: 'LockOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Estimated tax liability exceeds ₹10,000',
          'Income from business, profession, capital gains, rent, or interest',
          'Freelancers, consultants, or salaried with additional income',
          'Income without TDS (e.g., crypto, dividend, foreign income)',
          'Exemptions: Senior citizens (60+) without business income'
        ],
        pricing: {
          title: 'Choose Your Advance Tax Support Plan',
          plans: [
            { name: 'Standard', bestFor: 'Individuals with single income', price: '₹499' },
            { name: 'Premium', bestFor: 'Multiple income sources, capital gains', price: '₹999' },
            { name: 'Business Pro', bestFor: 'Business income, quarterly planning', price: '₹1,499' }
          ],
          note: '*Includes calculation, payment schedule, and reminders. Tax filing excluded.'
        },
        whatsIncluded: [
          'Expert calculation based on projected income',
          'Consideration of TDS already deducted',
          'Customized quarterly payment breakup',
          'Due date reminders & penalty avoidance tips',
          'Payment assistance (Challan ITNS-280)',
          'Email/WhatsApp summary of projections',
          'Adjustment consultation during the year'
        ],
        documentsRequired: [
          'PAN',
          'Income details (salary, business, freelance, interest, rent, capital gains)',
          'Investment details (80C, 80D deductions)',
          'TDS/TCS Certificates (Form 16, 16A, 26AS)',
          'Previous year’s ITR (for business users)',
          'Optional: Auto-import/upload for recurring users'
        ],
        howItWorks: [
          'Book service or upload income details',
          'Tax team reviews & computes projected income',
          'Calculate quarterly tax liability minus TDS',
          'Share payment plan + challans',
          'Optional quarterly follow-ups for adjustments'
        ],
        timeline: '1–2 Working Days',
        whyChooseUs: [
          'Expert-reviewed quarterly projections',
          'Avoid interest under Section 234B/234C',
          'Personalized individual & business support',
          'TDS-linked real-time adjustment',
          'Revisions possible anytime during the year'
        ],
        faqs: [
          {
            question: 'What are the due dates for advance tax payments?',
            answer: '15th June, 15th September, 15th December, and 15th March.'
          },
          {
            question: 'What if I miss a quarterly payment?',
            answer: 'Interest is charged under Sections 234B and 234C.'
          },
          {
            question: 'Is advance tax mandatory for salaried individuals?',
            answer: 'Yes, if there is additional income apart from salary (e.g., capital gains, FD interest).'
          },
          {
            question: 'Is advance tax applicable on stock or crypto gains?',
            answer: 'Yes, if there is no TDS deducted and profits are expected.'
          },
          {
            question: 'Can I revise my advance tax calculation later?',
            answer: 'Yes, projections can be adjusted in upcoming quarters.'
          }
        ],
        relatedServices: ['ITR Filing', 'Capital Gains Computation', 'TDS Return Filing', 'Virtual CFO Services', 'Business Tax Advisory'],
        stickyFooterCta: {
          text: 'Avoid penalties with expert-calculated advance tax plans — timely, accurate, and fully personalized.',
          buttons: [
            { label: 'Calculate Advance Tax Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Tax Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Income Details', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      consultation: {
        heroSection: {
          title: 'Save More with Smart Tax Planning',
          subtitle:
            'Personalized tax planning consultation by qualified Chartered Accountants to help you reduce taxes and maximize savings.',
          ctas: [
            { label: 'Book My Tax Consultation', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Schedule Free Discovery Call', icon: 'EventAvailableOutlined', size: 24 },
            { label: 'Upload Income Details', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Salaried, Business, Freelancers, NRIs', icon: 'BusinessCenterOutlined', size: 20 },
            { text: 'Personalized Tax Saving Strategy', icon: 'BarChartOutlined', size: 20 },
            { text: '100% Expert-led Advice', icon: 'PsychologyOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          "You're a salaried employee optimizing deductions (80C, 80D, HRA, etc.)",
          'You’re a freelancer/consultant with multiple income sources',
          'You run a business/startup and want to reduce tax liability',
          'You’re planning for big financial events (property, investments, loans)',
          'You want to proactively plan for next financial year'
        ],
        pricing: {
          title: 'Simple, Flat-Fee Expert Consultation',
          plans: [
            { name: 'Individual', bestFor: '30-minute tax saving consultation', price: '₹999' },
            { name: 'Business / Self-employed', bestFor: '60-minute deep-dive + report', price: '₹1,999' },
            { name: 'NRI / Capital Gains Advisory', bestFor: '60-minute + tax impact analysis', price: '₹2,999' }
          ],
          note: '*Includes advisory + tax-saving report summary. No hidden charges.'
        },
        whatsIncluded: [
          'One-on-one session with a CA/Tax expert',
          'Review of your income, expenses, deductions, and investment goals',
          'Identify potential tax-saving opportunities',
          'Guidance on tax-saving instruments (ELSS, NPS, insurance)',
          'Year-end planning / Next-year strategy',
          'Email summary/report with actionable recommendations',
          'Optional: Advance tax support / Investment strategy second opinion / Form 10E optimization'
        ],
        documentsRequired: [
          'PAN and Aadhaar',
          'Salary slips / Form 16 / Income summary',
          'Investment proofs (if available)',
          'Rent receipts (for HRA planning)',
          'Business profit/loss summary (if applicable)',
          'Last year’s ITR (optional but helpful)'
        ],
        howItWorks: [
          'Book your consultation and upload basic details',
          'A CA/tax expert is assigned to your case',
          'Attend video or phone consultation',
          'Receive personalized tax-saving strategies',
          'Get a written report summary by email within 1 day'
        ],
        timeline: 'Consultation within 24–48 hours of booking',
        whyChooseUs: [
          'Qualified CA-led consultations',
          'Advice personalized to your financial profile',
          'Goal-based tax saving for individuals & businesses',
          'Summary report included at no extra cost',
          'No upselling of investment products'
        ],
        faqs: [
          {
            question: 'Is this consultation only for salaried individuals?',
            answer: 'No, it’s for salaried people, freelancers, NRIs, businesses, and property investors.'
          },
          {
            question: 'Will I receive a report after consultation?',
            answer: 'Yes, a summary report with tax-saving suggestions is shared after the call.'
          },
          {
            question: 'Can you help file my ITR afterward?',
            answer: 'Yes. ITR filing is a separate service we can assist you with after consultation.'
          },
          {
            question: 'Which deductions/investments will be advised?',
            answer: 'Sections like 80C, 80D, ELSS, NPS, capital gains planning, etc., will be covered.'
          },
          {
            question: 'Is year-end planning available?',
            answer: 'Yes, and it’s highly recommended before March 31st!'
          }
        ],
        relatedServices: [
          'Income Tax Return Filing',
          'Advance Tax Calculation',
          'Capital Gains Tax Filing',
          'Investment Advisory',
          'Virtual CFO Services'
        ],
        stickyFooterCta: {
          text: 'Reduce your tax bill legally and smartly — book your personalized tax planning session now.',
          buttons: [
            { label: 'Book My Tax Consultation', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to an Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Income Summary', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'form-15ca-cb': {
        heroSection: {
          title: 'File Form 15CA/CB with Expert CA Support',
          subtitle:
            'Mandatory filing for foreign remittances — CA-certified Form 15CB and online filing of Form 15CA with 100% compliance.',
          ctas: [
            { label: 'Start 15CA/CB Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Chartered Accountant', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Remittance Details', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'For Remittances Outside India', icon: 'PublicOutlined', size: 20 },
            { text: 'Chartered Accountant Certified', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'Filed on Income Tax Portal', icon: 'CloudDoneOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Making foreign payments (supplier, freelancer, consultant, investor, etc.)',
          'Amount exceeds ₹5 lakh in a financial year (usually)',
          'Bank requests Form 15CA/CB before allowing remittance',
          'For Form 15CA: Declaration by remitter',
          'For Form 15CB: Certificate by CA (for taxable remittances)'
        ],
        pricing: {
          title: 'Transparent, Fast & Accurate Filing Packages',
          plans: [
            { name: 'Form 15CA (Only)', bestFor: 'Online submission on IT portal', price: '₹999' },
            { name: 'Form 15CB (CA Certificate)', bestFor: 'CA analysis + certification + guidance', price: '₹2,499' },
            { name: 'Combo (15CA + 15CB)', bestFor: 'End-to-end service', price: '₹2,999' }
          ],
          note: '*Prices may vary based on transaction complexity, urgency, and bank requirements.'
        },
        whatsIncluded: [
          'Review of remittance nature and taxability',
          'Selection of correct remittance code (RBI/FEMA)',
          'Preparation of Form 15CB by CA',
          'Filing of Form 15CA (Part B or C)',
          'Coordination with bank/forex dealer if required',
          'Download & delivery of acknowledgment copies',
          'Optional: TDS applicability/DTAA benefit advice',
          'Optional: Tax burden structure consultation'
        ],
        documentsRequired: [
          'PAN of Remitter',
          'Details of Remittee (Name, Address, Country, PAN if available)',
          'Invoice / Agreement / Purpose of Remittance',
          'Nature of payment (e.g., royalty, service fees, dividend)',
          'Bank details and branch contact',
          'Supporting documents for DTAA (Tax Residency Certificate, etc.)',
          'Previous year ITR (optional)'
        ],
        howItWorks: [
          'Book your service or consultation',
          'Upload remittance-related documents',
          'CA reviews and drafts Form 15CB',
          'Form 15CA filed on income tax portal',
          'Receive both acknowledgments and bank-ready documents'
        ],
        timeline: '1–2 working days (Same-day service available on request)',
        whyChooseUs: [
          'Certified by Experienced Chartered Accountants',
          'Compliant with FEMA, RBI & Income Tax Rules',
          'Same-day service available for urgent transactions',
          'Assistance in DTAA documentation & tax advice',
          'Trusted by 500+ exporters, importers, & finance teams'
        ],
        faqs: [
          {
            question: 'Is 15CA/CB required for every foreign remittance?',
            answer: 'Not always. It depends on amount, nature, and exemption list. We guide you properly.'
          },
          {
            question: 'What is the difference between 15CA and 15CB?',
            answer: '15CA is declaration by remitter; 15CB is a CA’s certificate when tax is applicable.'
          },
          {
            question: 'Will my bank accept these documents?',
            answer: 'Yes. We follow formats accepted by major Indian banks.'
          },
          {
            question: 'Can I file Form 15CA myself?',
            answer: 'Technically yes, but mistakes may lead to penalties. CA-guided filing is safer.'
          },
          {
            question: 'What if I missed filing before remittance?',
            answer: 'You may be asked to show delayed compliance — we assist with that too.'
          }
        ],
        relatedServices: [
          'TDS Return Filing',
          'Foreign Remittance Compliance',
          'DTAA Benefit Advisory',
          'Business Taxation',
          'Virtual CFO Services'
        ],
        stickyFooterCta: {
          text: 'Ensure compliant foreign remittances with fast & accurate 15CA/CB filing by trusted Chartered Accountants.',
          buttons: [
            { label: 'File 15CA/CB Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Speak to a CA', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Documents', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      }
    }
  },
  accounting: {
    title: 'Accounting & VCFO',
    pages: {
      invoicing: {
        heroSection: {
          title: 'Professional Invoicing Setup & Management for Your Business',
          subtitle: 'Generate, customize, and manage GST-compliant invoices effortlessly — one-time setup or ongoing monthly service.',
          ctas: [
            { label: 'Set Up My Invoicing System', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload My Invoice Format or Data', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to an Accounting Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'GST-Compliant Formats', icon: 'ReceiptLongOutlined', size: 20 },
            { text: 'Monthly Invoice Management', icon: 'AutorenewOutlined', size: 20 },
            { text: 'Excel, Tally, Zoho, QuickBooks Supported', icon: 'ComputerOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'SMEs, startups, and consultants generating regular invoices',
          'E-commerce and D2C sellers',
          'GST-registered businesses',
          'Businesses needing invoice cleanup or format standardization',
          'Companies integrating invoicing with accounting or CRM tools'
        ],
        pricing: {
          title: 'Choose One-Time Setup or Monthly Management',
          plans: [
            { name: 'One-Time Setup', bestFor: 'Custom invoice format + GST fields', price: '₹999' },
            { name: 'Monthly Invoicing Plan', bestFor: 'Up to 50 invoices/month', price: '₹1,499/month' },
            { name: 'Premium Plan', bestFor: '51–200 invoices/month or advanced reporting', price: '₹2,999/month' }
          ],
          note: '*Bulk invoicing or software integration priced separately.'
        },
        whatsIncluded: [
          'One-time or monthly invoice generation',
          'Custom template design (logo, fields, HSN/SAC codes)',
          'GST-compliant format with auto-calculation',
          'Number series setup and automation options',
          'Invoice dispatch via PDF/Email (if opted)',
          'Payment status tracking',
          'Optional e-invoicing setup & integration',
          'Report generation for TDS, GST, and reconciliation'
        ],
        documentsRequired: [
          'PAN & GST of business',
          'Logo, contact, and invoice footer details',
          'Existing invoice format (if any)',
          'Product/Service list with HSN/SAC codes & GST rates',
          'Client/customer list',
          'Opening invoice number (if continuing a sequence)',
          'Bank account & payment terms for invoices'
        ],
        howItWorks: [
          'Choose setup or monthly plan',
          'Share your details, logo, and invoice data',
          'We create custom invoice templates',
          'For monthly users, send data regularly',
          'We generate invoices and send them to you or your clients'
        ],
        timeline: 'One-time setup: 1–2 Working Days | Monthly: Invoices within 24–48 hrs of data receipt',
        whyChooseUs: [
          'Professional, branded invoice formats',
          'GST, TDS, and payment tracking-ready',
          'Compatible with Tally, Zoho, Excel, QuickBooks',
          'Easy monthly invoicing via Google Sheets or Email',
          'Optional integration with bookkeeping & GST return filing'
        ],
        faqs: [
          {
            question: 'Is this invoicing software or a manual service?',
            answer: 'This is a CA/analyst-powered service — we can set up software or manage invoices manually.'
          },
          {
            question: 'Will the invoices be GST-compliant?',
            answer: 'Yes, including HSN/SAC, tax rates, invoice number, and payment terms.'
          },
          {
            question: 'Can you also file GST returns based on this?',
            answer: 'Yes, it can be bundled with GST return filing.'
          },
          {
            question: 'Can I share invoices in Excel or by email?',
            answer: 'Absolutely — we offer email/WhatsApp-based workflows.'
          },
          {
            question: 'Can you help with e-invoicing or QR code?',
            answer: 'Yes, e-invoicing setup and QR compliance is supported.'
          }
        ],
        relatedServices: ['GST Return Filing', 'Bookkeeping & Accounting', 'E-Invoicing Automation', 'Virtual CFO', 'Inventory Management'],
        stickyFooterCta: {
          text: 'Get your invoicing system set up right — accurate, professional, and easy to manage every month.',
          buttons: [
            { label: 'Get Started with Invoicing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to an Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Invoice Format', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      bookkeeping: {
        heroSection: {
          title: 'Hassle-Free Bookkeeping & Accounting for Your Business',
          subtitle:
            'Stay compliant and financially organized with expert-managed accounting services tailored to your business type and size.',
          ctas: [
            { label: 'Get a Quote for My Business', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Schedule Free Accounting Consultation', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Previous Books / Trial Balance', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Monthly, Quarterly & Annual Plans', icon: 'ReceiptLongOutlined', size: 20 },
            { text: 'Tally, Zoho, QuickBooks, Excel Compatible', icon: 'LibraryBooksOutlined', size: 20 },
            { text: 'CA-Supervised Entries & Reporting', icon: 'CheckCircleOutlineOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Startups and SMEs',
          'Proprietors and Freelancers',
          'LLPs and Pvt Ltd Companies',
          'Retailers, Traders, Consultants',
          'E-commerce sellers, Agencies, Creators'
        ],
        pricing: {
          title: 'Flexible Plans Based on Volume and Complexity',
          plans: [
            { name: 'Basic', transactions: 'Up to 50 transactions', price: '₹1,499/month' },
            { name: 'Standard', transactions: '51–200 transactions', price: '₹2,999/month' },
            { name: 'Premium', transactions: '200+ transactions or multiple entities', price: 'Custom Quote' }
          ],
          note: '*Pricing includes data entry, ledger prep, and standard financial reports. GST return or payroll filing charged separately.'
        },
        whatsIncluded: [
          'Entry of sales, purchases, expenses, bank transactions',
          'Ledger creation and maintenance',
          'Bank reconciliation',
          'Trial balance, P&L statement, Balance sheet',
          'GST reconciliation (if applicable)',
          'TDS deduction and ledgers',
          'Books preparation in Tally / Zoho / Excel',
          'Monthly/quarterly MIS reports (for standard and above)'
        ],
        optionalAddOns: ['Inventory management', 'Multi-branch/department accounting', 'Project-wise income-expense tracking'],
        documentsRequired: [
          'Company PAN & GST',
          'Bank Statements (Excel/PDF/CSV)',
          'Sales and Purchase Invoices',
          'Expense Bills & Receipts',
          'Previous year’s books (if applicable)',
          'Payroll data (if managed by us)'
        ],
        howItWorks: [
          'Book consultation or select a plan',
          'Upload docs / connect software / share drive',
          'CA-led team processes entries & shares books',
          'Monthly or quarterly reporting provided',
          'Year-end books ready for ITR, audit, or investor use'
        ],
        timeline: 'Regular monthly/quarterly cycle. Year-end finalization in 7–10 days.',
        whyChooseUs: [
          'Dedicated accountant + CA review',
          'Compatible with your tools (Tally, Zoho, Excel, QuickBooks)',
          'Clear reports, timely reconciliations',
          'Optional add-ons: GST, payroll, VCFO, audit',
          'All work tracked via dashboard and WhatsApp/email'
        ],
        faqs: [
          {
            question: 'Can you start mid-year or take over from another accountant?',
            answer: 'Yes, we’ll review your previous data and take over cleanly.'
          },
          {
            question: 'Do I need to use your software?',
            answer: 'No, we work with whatever software or format you use.'
          },
          {
            question: 'Will I get reports every month?',
            answer: 'Yes — basic users get quarterly, others get monthly reports.'
          },
          {
            question: 'Do you offer audit support as well?',
            answer: 'Yes, audit packages are available on request.'
          },
          {
            question: 'Can this be bundled with GST or payroll filing?',
            answer: 'Absolutely — we offer bundled packages at discounted pricing.'
          }
        ],
        relatedServices: [
          'GST Return Filing',
          'Payroll Processing',
          'TDS Return Filing',
          'Virtual CFO Services',
          'Statutory Audit Support'
        ],
        stickyFooterCta: {
          text: 'Stay financially compliant and in control — get your books managed by experts today.',
          buttons: [
            { label: 'Get My Accounting Plan', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to an Accountant', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Financials', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      vcfo: {
        heroSection: {
          title: 'Get a Full-Time CFO — Without the Full-Time Cost',
          subtitle:
            'Strategic finance leadership, compliance oversight, investor readiness, and decision-making support for your growing business — all under our Virtual CFO plan.',
          ctas: [
            { label: 'Book Free CFO Discovery Call', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Share Company Details for Quote', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to Our VCFO Team', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Monthly Reporting & Insights', icon: 'AssessmentOutlined', size: 20 },
            { text: 'Strategic Finance Partner', icon: 'PsychologyOutlined', size: 20 },
            { text: 'Trusted by Founders, Startups & MSMEs', icon: 'BusinessCenterOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Startups preparing for fundraising',
          'SMEs scaling operations and team size',
          'Founders with no full-time finance head',
          'Companies looking for cost control, forecasting, or board reporting',
          'Businesses dealing with multi-entity or multi-branch operations'
        ],
        pricing: {
          title: 'Plans Tailored to Your Growth Stage',
          plans: [
            { name: 'Essentials Plan', bestFor: 'Early-stage businesses', price: '₹9,999/month' },
            { name: 'Growth Plan', bestFor: 'Scaling startups with revenue inflow', price: '₹19,999/month' },
            { name: 'Investor-Ready CFO', bestFor: 'Fundraising, MIS, Pitch Decks, Cap Table', price: 'Custom Quote' }
          ],
          note: '*Includes monthly dashboard, forecasting, reviews. Bookkeeping/GST add-ons available.'
        },
        whatsIncluded: [
          'Monthly financial review & MIS dashboard',
          'Budgeting, forecasting & cash flow planning',
          'Cost optimization and business modeling',
          'Investor reporting & board meeting support',
          'Tax, ROC & compliance calendar monitoring',
          'Review of accounting, payroll, TDS, GST data',
          'Quarterly strategic calls with CA/CFO team',
          'Liaison with bankers, investors, auditors (on request)'
        ],
        optionalAddOns: ['Pitch Deck & Financial Projections', 'Cap Table & Valuation Support', 'Due Diligence & Fundraising Readiness'],
        documentsRequired: [
          'Company incorporation docs (PAN, COI, GST, etc.)',
          'Monthly sales/purchase data',
          'Bank statements',
          'Expense sheets / payroll data',
          'Existing P&L, Balance Sheet (if available)',
          'Investor or founder reporting templates (if any)'
        ],
        howItWorks: [
          'Book a discovery call with our VCFO team',
          'Share company financials and reporting needs',
          'We design a custom reporting + advisory plan',
          'Monthly/quarterly reviews with reporting and alerts',
          'Strategic inputs for funding, expansion, or compliance'
        ],
        timeline: 'Kick-off within 5 working days of onboarding',
        whyChooseUs: [
          'Real finance professionals with startup + SME experience',
          'All-in-one partner: accounting + compliance + advisory',
          'Transparent pricing — no hourly billing shock',
          'Consistent support + strategic CFO brainpower',
          'Fundraising, investor, and board-ready presentations'
        ],
        faqs: [
          {
            question: 'How is this different from accounting or GST filing?',
            answer: 'This is CFO-level guidance — planning, review, insights — not just data entry.'
          },
          {
            question: 'Can I start with a smaller plan and upgrade later?',
            answer: 'Absolutely — many clients begin small and grow with us.'
          },
          {
            question: 'Will I have a dedicated point of contact?',
            answer: 'Yes — a lead CFO/CA + account manager.'
          },
          {
            question: 'Will you help with funding or due diligence?',
            answer: 'Yes — it’s included in the Investor-Ready plan or as an add-on.'
          },
          {
            question: 'What industries do you serve?',
            answer: 'Tech, services, D2C, manufacturing, agencies, e-commerce, and more.'
          }
        ],
        relatedServices: [
          'Bookkeeping & Accounting',
          'MIS Reporting & Forecasting',
          'Financial Projections & Valuation',
          'Startup India Registration',
          'Compliance Calendar Setup'
        ],
        stickyFooterCta: {
          text: 'Run your business like the big guys — with a Virtual CFO in your corner.',
          buttons: [
            { label: 'Start My VCFO Journey', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Schedule a Call with CFO', icon: 'PhoneOutlined', size: 24 },
            { label: 'Share My Financials', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'fix-my-books': {
        heroSection: {
          title: 'Books a Mess? Let’s Fix Them — Fast.',
          subtitle:
            'Whether your books are missing, messed up, outdated, or mismanaged — we’ll clean them up, reconcile everything, and hand over a fresh, audit-ready set.',
          ctas: [
            { label: 'Fix My Books Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Your Current Files', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Cleanup Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Backlog Cleanup', icon: 'CleaningServicesOutlined', size: 20 },
            { text: 'Tally, Zoho, Excel, QuickBooks Compatible', icon: 'LibraryBooksOutlined', size: 20 },
            { text: 'CA-Supervised Review & Corrections', icon: 'VerifiedUserOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Businesses that haven’t maintained accounts properly',
          'Entrepreneurs switching accountants or software',
          'Startups preparing for audits, funding, or compliance',
          'Companies needing backdated GST, TDS, or income tax filings',
          'Anyone who wants clean books before a new financial year'
        ],
        pricing: {
          title: 'Cleanup Pricing Based on Volume & Age',
          plans: [
            { name: 'Basic Cleanup (1–3 months)', bestFor: 'Upto 100 transactions/month', price: '₹3,999 onwards' },
            { name: 'Quarterly or Half-Year Fix', bestFor: 'Mid-size cleanup', price: '₹7,499 onwards' },
            { name: 'Full-Year or Multi-Year', bestFor: 'Large volume or multiple years', price: 'Custom Quote' }
          ],
          note: '*Final quote after review of raw data, backlogs & corrections required.'
        },
        whatsIncluded: [
          'Review of existing books / raw data',
          'Ledger cleanup, error correction, and reclassification',
          'Bank and cash reconciliation',
          'GST, TDS, and other ledgers alignment',
          'Closing entries and balance sheet accuracy',
          'Preparation of final books in Excel, Tally, or Zoho',
          'Handover of clean, updated reports: P&L, Balance Sheet, Trial Balance',
          'Optional: Transfer to new software or platform'
        ],
        documentsRequired: [
          'Existing accounting files (Tally/Zohobooks/Excel/QuickBooks)',
          'Bank statements (all accounts)',
          'Sales and purchase invoices',
          'Expense bills & proofs',
          'Tax payment challans (GST/TDS/Advance Tax)',
          'Any previous audit or trial balance (if available)'
        ],
        howItWorks: [
          'Book a free call and upload your current books (or explain your chaos 😅)',
          'We assess gaps and give a quote',
          'Our team of accountants + CA gets to work',
          'You receive clean, verified, audit-ready books',
          'Optional: Handover to our bookkeeping or CFO service'
        ],
        timeline: '7–15 Working Days (depending on scope)',
        whyChooseUs: [
          'Specialized team for backdated accounting',
          'Non-judgmental — no matter how messy your books are',
          'Confidential, secure, and transparent process',
          'Tally, Zoho, QuickBooks, Excel supported',
          'Year-end filing, audit, GST & CFO handover-ready'
        ],
        faqs: [
          {
            question: 'I haven’t maintained books for 6+ months. Can you help?',
            answer: 'Absolutely. That’s what we’re best at.'
          },
          {
            question: 'Will you correct GST & TDS ledgers too?',
            answer: 'Yes — our cleanup includes tax-related reconciliations.'
          },
          {
            question: 'Do I need to change my accountant?',
            answer: 'Not at all. We can hand over clean books to them or take it forward.'
          },
          {
            question: 'Can I get this done before audit or tax filing deadlines?',
            answer: 'Yes, just let us know your timeline — we’ll prioritize it.'
          },
          {
            question: 'Will I get final reports and ledger backups?',
            answer: 'Yes. We provide clean backups and reports in your preferred format.'
          }
        ],
        relatedServices: [
          'Bookkeeping & Accounting',
          'GST & TDS Return Filing',
          'Income Tax Return Filing',
          'Virtual CFO Services',
          'Audit Support'
        ],
        stickyFooterCta: {
          text: 'Don’t stress over messy books — we’ll clean it all up and give you a fresh start.',
          buttons: [
            { label: 'Fix My Books Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Get a Free Assessment', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Files', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'inventory-management': {
        heroSection: {
          title: 'Stay in Control of Your Stock with Expert Inventory Management',
          subtitle:
            'Get your inventory tracked, valued, and reconciled monthly — integrated with your invoicing, accounting, and GST returns.',
          ctas: [
            { label: 'Get Inventory Support Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload My Stock List', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to an Inventory Specialist', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Ideal for Retail, Wholesale, Manufacturing, and E-commerce', icon: 'StorefrontOutlined', size: 20 },
            { text: 'Stock Reports + Valuation + Reconciliation', icon: 'AssessmentOutlined', size: 20 },
            { text: 'GST-Ready Inventory Records', icon: 'ReceiptOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Businesses dealing in physical goods: manufacturing, trading, e-commerce',
          'Real-time stock monitoring or valuation needed',
          'GST-compatible inventory for returns & invoicing',
          'Require automation for reorder alerts and stockouts',
          'Batch/expiry management needed (FMCG, pharma, etc.)'
        ],
        pricing: {
          title: 'Choose One-Time Setup or Monthly Management',
          plans: [
            { name: 'One-Time Setup', bestFor: 'Inventory master creation + category setup', price: '₹1,499' },
            { name: 'Monthly Plan', bestFor: 'Stock tracking, inward/outward entries', price: '₹2,499/month' },
            { name: 'Advanced Plan', bestFor: 'Multi-location + reorder alerts + valuation', price: 'Custom Quote' }
          ],
          note: '*Bundled pricing available with Invoicing + Bookkeeping plans'
        },
        whatsIncluded: [
          'Inventory master setup (product codes, GST rates, HSN/SKU)',
          'Opening stock entry + closing stock reconciliation',
          'Inward (purchases) and outward (sales) entry management',
          'FIFO / Weighted Avg. stock valuation',
          'Stock movement and consumption reports',
          'Expiry and batch-wise tracking (optional)',
          'Integration with invoicing & accounting software',
          'Stock register download for GST return filing (GSTR-1/9)'
        ],
        documentsRequired: [
          'Product list (Excel/CSV) with item codes and units',
          'Opening stock quantity & value',
          'Sales and purchase invoice data',
          'Warehouse or location info (if applicable)',
          'Tax rates, HSN codes, and pricing structure'
        ],
        howItWorks: [
          'Choose setup or monthly support plan',
          'Share your product data and structure',
          'We set up inventory register in compatible format',
          'Ongoing entry of purchases/sales',
          'Monthly/quarterly stock summary & valuation report'
        ],
        timeline: 'Setup in 2–4 Working Days. Monthly reports delivered within 48 hours of data receipt.',
        whyChooseUs: [
          'CA-supervised inventory valuation',
          'Integrated with GST, Invoicing & Bookkeeping',
          'Support for batch, expiry, and serial number tracking',
          'Tally, Zoho, Busy, QuickBooks & Excel compatible',
          'Real-time alerts & reports (via dashboard/email)'
        ],
        faqs: [
          {
            question: 'Is this a software or service?',
            answer: 'This is an expert-managed inventory service. We also assist with software setup if required.'
          },
          {
            question: 'Can this link with my invoicing and accounting?',
            answer: 'Yes — data is structured to match your existing books and GST.'
          },
          {
            question: 'Do you support inventory for multiple branches?',
            answer: 'Yes, with location-wise valuation and movement tracking.'
          },
          {
            question: 'Will this help in GST return filing?',
            answer: 'Yes — closing stock, HSN summary, and valuation help in GSTR-1, 3B, 9.'
          },
          {
            question: 'Do I need to buy software for this?',
            answer: 'No, we work on your existing software or Excel.'
          }
        ],
        relatedServices: ['Bookkeeping & Accounting', 'GST Return Filing', 'Invoicing Setup', 'Virtual CFO Services', 'MIS Reporting'],
        stickyFooterCta: {
          text: 'Track your stock like a pro — stay compliant, profitable, and inventory-smart every month.',
          buttons: [
            { label: 'Start Inventory Setup', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Product List', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to an Expert', icon: 'PhoneOutlined', size: 24 }
          ]
        }
      },
      'mis-analytics': {
        heroSection: {
          title: 'Get Actionable MIS & Analytics Reports — Not Just Numbers',
          subtitle:
            'We turn your financial and operational data into powerful insights with customized MIS dashboards and visual reporting.',
          ctas: [
            { label: 'Get My MIS Setup', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'View Sample Dashboards', icon: 'BarChartOutlined', size: 24 },
            { label: 'Schedule a Free Reporting Consultation', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Monthly, Quarterly, Custom Reports', icon: 'InsertChartOutlined', size: 20 },
            { text: 'Decision-Focused Insights', icon: 'PsychologyOutlined', size: 20 },
            { text: 'Excel, Tally, Zoho, QuickBooks Compatible', icon: 'SyncAltOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Founders & CEOs wanting financial visibility',
          'Startups preparing for investors or board meetings',
          'Businesses with revenue streams across geographies or products',
          'Internal finance teams needing smart dashboards',
          'MSMEs scaling operations with data-backed planning'
        ],
        pricing: {
          title: 'Choose From Basic to Advanced Analytics',
          plans: [
            { name: 'Standard MIS', bestFor: 'Monthly P&L, BS, Cash Flow reports', price: '₹2,999/month' },
            { name: 'Advanced MIS', bestFor: 'Dashboards + product/channel-wise breakdown', price: '₹4,999/month' },
            { name: 'Investor-Ready', bestFor: 'MIS + Projections + KPI/Board Pack', price: 'Custom Quote' }
          ],
          note: '*Pricing based on volume & customization. Discounts for CFO/Accounting clients.'
        },
        whatsIncluded: [
          'Monthly MIS pack (P&L, Balance Sheet, Cash Flow)',
          'Custom formats: cost center, location, business vertical, client-wise',
          'Ratio analysis and variance reporting',
          'Budget vs Actual comparisons',
          'Custom KPIs (Gross Margin, Burn Rate, CAC, etc.)',
          'Quarterly reporting for investor decks',
          'Visual dashboards (Excel, Google Sheets, Data Studio optional)'
        ],
        optionalAddOns: ['Forecasting and financial modeling', 'Board meeting presentation support', 'Multi-entity consolidation'],
        documentsRequired: [
          'Monthly accounting data (books, sales, purchases)',
          'Payroll summary (if included)',
          'Budget/planned projections (optional)',
          'Access to preferred reporting tools (Google Sheets, Excel, etc.)'
        ],
        howItWorks: [
          'Choose your MIS package',
          'Share data inputs and reporting needs',
          'We structure templates and set benchmarks',
          'Monthly or quarterly reports delivered with insights',
          'Optional support for review meetings or board prep'
        ],
        timeline: 'First setup in 5–7 working days. Regular reports monthly/quarterly.',
        whyChooseUs: [
          'MIS built by CAs with business acumen',
          'Tailored to your goals: operations, investor, funding',
          'Works seamlessly with our accounting/CFO stack',
          'Easy-to-read dashboards & smart summaries',
          'Optional live walkthroughs or reviews'
        ],
        faqs: [
          {
            question: 'Can I use this even if I already have an accountant?',
            answer: 'Absolutely. We work with your existing accounting data.'
          },
          {
            question: 'Will this help with investor meetings?',
            answer: 'Yes — our Investor-Ready plan is tailored for that.'
          },
          {
            question: 'Can you give product-wise or branch-wise reporting?',
            answer: 'Yes, our MIS supports cost center and segment reporting.'
          },
          {
            question: 'Can I use my own template or format?',
            answer: 'Yes — we customize reports based on your preference.'
          },
          {
            question: 'Will you help interpret the data or just give numbers?',
            answer: 'We provide commentary + summary insights with every pack.'
          }
        ],
        relatedServices: [
          'Bookkeeping & Accounting',
          'Virtual CFO Services',
          'Financial Projections',
          'Tax Planning & Advisory',
          'Compliance Calendar Setup'
        ],
        stickyFooterCta: {
          text: 'Don’t just maintain books — understand your business. Get smart, visual MIS & analytics tailored to your growth.',
          buttons: [
            { label: 'Get My MIS Reports', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Request Sample Dashboards', icon: 'BarChartOutlined', size: 24 },
            { label: 'Talk to a Reporting Expert', icon: 'PhoneOutlined', size: 24 }
          ]
        }
      }
    }
  },
  registration: {
    title: 'Business Registration / Licenses',
    pages: {
      'private-limited': {
        heroSection: {
          title: 'Start Your Company in 7 Days — 100% Online with CA/CS Assistance',
          subtitle: 'Private Limited, LLP, or OPC — Let Our Experts Handle the Entire Registration Process for You.',
          ctas: [
            { label: 'Incorporate Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Compare Company Types', icon: 'GavelOutlined', size: 24 },
            { label: 'Schedule Free Consultation', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: '⭐ Trusted by 1,000+ Startups', icon: 'VerifiedUserOutlined', size: 20 },
            { text: '🛡 MCA Registered Professionals', icon: 'ShieldOutlined', size: 20 },
            { text: '⏱ Avg. Incorporation Time: 5.4 Days', icon: 'AccessTimeOutlined', size: 20 }
          ]
        },
        companyTypeSelector: ['Private Limited Company', 'Limited Liability Partnership (LLP)', 'One Person Company (OPC)'],
        pricing: {
          title: 'Affordable & Transparent Pricing — No Hidden Charges',
          plans: [
            {
              name: 'Basic',
              inclusions: ['Company Name Approval', 'DIN for 2 Directors', 'PAN & TAN', 'MOA & AOA Drafting', 'Incorporation Certificate'],
              price: '₹5,999'
            },
            {
              name: 'Standard',
              inclusions: [
                'Everything in Basic',
                'DSC for 2 Directors',
                'Professional Fee + Govt Fee (up to ₹10 lakh capital)',
                'Dedicated CA Support'
              ],
              price: '₹9,999'
            },
            {
              name: 'Premium',
              inclusions: [
                'Everything in Standard',
                'GST Registration',
                'First Month Bookkeeping Support',
                'Post-Incorporation Compliance Guidance'
              ],
              price: '₹13,999'
            }
          ],
          note: '*Govt fees included up to ₹10 lakh capital. Prices may vary slightly by state.'
        },
        whatsIncluded: [
          'Company Name Approval (RUN/SPICe+)',
          '2 Digital Signature Certificates (DSC)',
          'Director Identification Numbers (DIN)',
          'Drafting of MOA and AOA',
          'Filing SPICe+ Forms with MCA',
          'Certificate of Incorporation',
          'PAN & TAN Allotment',
          'Professional CA/CS Guidance',
          'Bank Account Opening Support',
          'Consultation for GST Registration, Startup India Recognition'
        ],
        documentsRequired: [
          'PAN Card (All Directors/Shareholders)',
          'Aadhaar Card',
          'Passport-size Photograph',
          'Mobile Number & Email',
          'Address Proof (Bank Statement/Utility Bill, not older than 2 months)',
          'Rental Agreement / Lease Deed (for Registered Office)',
          'Utility Bill for Office Address (Electricity/Water Bill)'
        ],
        howItWorks: [
          'Select your company type (Pvt Ltd / LLP / OPC)',
          'Fill basic details & make payment',
          'Upload documents securely',
          'Name approval request submission',
          'DSC, DIN, incorporation documents filed',
          'Certificate of Incorporation + PAN & TAN received',
          'Post-Incorporation Expert Consultation'
        ],
        timeline: 'Estimated Time: 5–7 Working Days',
        whyChooseUs: [
          'End-to-End Expert Support by CA/CS Professionals',
          'Transparent & Fixed Pricing — No Hidden Charges',
          'Fast-Track MCA Filing',
          '24x7 Support via Chat, Email & Phone',
          'All Services Under One Roof: GST, Bookkeeping, Payroll, Advisory',
          'Trusted by 1,000+ Startups & MSMEs'
        ],
        faqs: [
          {
            question: 'How long does it take to incorporate?',
            answer: 'Usually 5–7 working days depending on documents and MCA timelines.'
          },
          {
            question: 'Which company type should I choose?',
            answer: 'Pvt Ltd for scalability/funding, OPC for solo founders, LLP for professionals.'
          },
          {
            question: 'Do I need to visit any office physically?',
            answer: 'No. Everything is 100% online.'
          },
          {
            question: 'Can a foreign national be a director?',
            answer: 'Yes, with valid ID/address proof and a local Indian director.'
          },
          {
            question: 'What happens after incorporation?',
            answer: 'We help you open a bank account, register for GST, and stay compliant.'
          }
        ],
        relatedServices: [
          'GST Registration',
          'Startup India Recognition',
          'Bookkeeping & Accounting',
          'Virtual CFO Services',
          'Payroll Setup',
          'Trademark Registration'
        ],
        stickyFooterCta: {
          text: 'Start your company the right way — MCA-compliant, fast, and expert-led.',
          buttons: [
            { label: 'Start Incorporation', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Book Free Consultation', icon: 'PhoneOutlined', size: 24 },
            { label: 'Download Checklist', icon: 'CloudDownloadOutlined', size: 24 }
          ]
        }
      },
      'msme-registration': {
        heroSection: {
          title: 'Get Your MSME (Udyam) Registration in 1–2 Days',
          subtitle:
            'Official recognition as a Micro, Small, or Medium Enterprise (MSME) — unlock benefits, subsidies, and ease of doing business.',
          ctas: [
            { label: 'Apply for Udyam Registration', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Business Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Registration Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'For Proprietors, LLPs, Companies, Startups', icon: 'BusinessOutlined', size: 20 },
            { text: 'Govt. of India Certificate', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'Fast & Paperless Process', icon: 'CloudDoneOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Any business entity engaged in manufacturing or services',
          'Investment within prescribed limits',
          'Annual turnover within ₹250 crore',
          'Proprietorships, LLPs, Companies, Startups',
          'Voluntary but highly recommended for benefits'
        ],
        pricing: {
          title: 'Flat-Fee, Expert-Handled Process',
          plans: [
            { name: 'Standard', bestFor: 'End-to-end Udyam/MSME Registration', price: '₹799' },
            { name: 'Combo (with IEC/GST)', bestFor: 'Udyam + IEC or GST Registration', price: '₹1,499' }
          ],
          note: '*Includes documentation, filing, and e-certificate download.'
        },
        whatsIncluded: [
          'Eligibility check and consultation',
          'Application drafting with expert support',
          'Filing via Aadhaar authentication on Udyam portal',
          'Download of e-certificate with Udyam Registration Number',
          'Support for updates (business name, address, turnover, etc.)'
        ],
        documentsRequired: [
          'Aadhaar of Proprietor / Authorized Signatory',
          'PAN of Business or Individual (if Proprietor)',
          'GSTIN (if available)',
          'Bank Account Details',
          'Business Address',
          'Investment & Turnover Details (Self-declared)'
        ],
        howItWorks: [
          'Choose service and upload details',
          'Our team verifies and prepares application',
          'OTP authentication & submission on Udyam portal',
          'Receive MSME Certificate with QR Code',
          'Start availing MSME benefits'
        ],
        timeline: '1–2 Working Days',
        whyChooseUs: [
          'Filing handled by compliance experts',
          'Fastest turnaround time',
          'End-to-end assistance with updates & corrections',
          'Bank & Loan support with MSME Certificate',
          'Services available across all states'
        ],
        faqs: [
          {
            question: 'Is MSME registration mandatory?',
            answer: 'No, but highly recommended for government benefits.'
          },
          {
            question: 'Is GST or PAN mandatory?',
            answer: 'PAN is mandatory. GST only if applicable.'
          },
          {
            question: 'Can startups apply?',
            answer: 'Yes, any operational business entity can register.'
          },
          {
            question: 'Is there any renewal or expiry?',
            answer: 'No, registration is permanent unless canceled.'
          },
          {
            question: 'Can I update certificate if turnover changes?',
            answer: 'Yes, we assist with updates too.'
          }
        ],
        relatedServices: [
          'Company Incorporation',
          'GST Registration',
          'Startup India Registration',
          'IEC (Import Export Code)',
          'Business Loan Assistance'
        ],
        stickyFooterCta: {
          text: 'Get officially recognized as an MSME and unlock powerful benefits — fast, easy, and fully online.',
          buttons: [
            { label: 'Apply for Udyam Registration', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Business Info', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'startup-india': {
        heroSection: {
          title: 'Get Recognized as a DPIIT-Certified Startup',
          subtitle:
            'Register under the Startup India scheme and unlock tax benefits, funding access, tender eligibility, and branding opportunities.',
          ctas: [
            { label: 'Apply for Startup India Recognition', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Company Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Startup Advisor', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'DPIIT Recognition', icon: 'RocketLaunchOutlined', size: 20 },
            { text: 'Income Tax Exemption Support', icon: 'ReceiptLongOutlined', size: 20 },
            { text: 'Ideal for Startups, Founders & Innovators', icon: 'LightbulbOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Incorporated as a Private Ltd, LLP, or Partnership Firm',
          'Turnover under ₹100 crore',
          'Entity is not older than 10 years',
          'Working towards innovation, development, or improvement',
          'Proprietorships are NOT eligible'
        ],
        pricing: {
          title: 'Simple, All-Inclusive Fee',
          plans: [
            { name: 'Startup India Recognition', bestFor: 'DPIIT Startup Certificate Filing & Documentation', price: '₹2,499' },
            { name: 'Combo: + Tax Exemption (80 IAC)', bestFor: 'Includes 80IAC form support', price: '₹4,999' }
          ],
          note: '*Pricing includes document drafting, profile creation, declaration filing, and expert CA support.'
        },
        whatsIncluded: [
          'Eligibility check and advisory',
          'Profile creation on Startup India portal',
          'Business description drafting (pitch format)',
          'Supporting document preparation (deck/video optional)',
          'Declaration & submission to DPIIT',
          'Clarification response support (if any)',
          'Certificate download and delivery',
          '80 IAC exemption support (for combo plan)'
        ],
        documentsRequired: [
          'Certificate of Incorporation (Pvt Ltd/LLP/Firm)',
          'PAN of entity',
          'Brief writeup about the business',
          'Director/Partner details with Aadhaar & PAN',
          'Website / App / Product / Demo link (recommended)',
          'Pitch deck / business presentation (optional)',
          'ITR + Financials (for tax exemption only)'
        ],
        howItWorks: [
          'Upload your basic business details',
          'We assess eligibility and draft profile content',
          'Prepare Startup India profile + upload documents',
          'Submit application on Startup India portal',
          'Respond to DPIIT queries (if any)',
          'Receive DPIIT Certificate + 80IAC support (if opted)'
        ],
        timeline: '5–10 working days (depending on DPIIT review)',
        whyChooseUs: [
          'End-to-end handling by experts',
          'Support for profile writeup, deck & clarification replies',
          'Tax exemption advisory included',
          'Strong track record with DPIIT acceptance',
          'Trusted by 500+ Indian startups'
        ],
        faqs: [
          {
            question: 'Is Startup India registration the same as company registration?',
            answer: 'No. It is separate recognition under DPIIT to avail startup benefits.'
          },
          {
            question: 'Is it mandatory for fundraising or angel investment?',
            answer: 'Not mandatory, but highly preferred by investors.'
          },
          {
            question: 'Can I apply if I already started operations?',
            answer: 'Yes, if your company is within 10 years old and turnover is below ₹100 crore.'
          },
          {
            question: 'How long does DPIIT approval take?',
            answer: 'Usually between 5–10 working days if all documents and writeups are correct.'
          },
          {
            question: 'Can you help with 80IAC tax exemption too?',
            answer: 'Yes, our Combo plan covers both Startup India Recognition and 80IAC filing support.'
          }
        ],
        relatedServices: [
          'Company Incorporation',
          'Pitch Deck & Investor Docs',
          '80 IAC & 56(2)(viib) Tax Exemption',
          'MSME/Udyam Registration',
          'Trademark & IP Support'
        ],
        stickyFooterCta: {
          text: 'Get recognized as an official startup and access India’s best benefits for innovation & growth.',
          buttons: [
            { label: 'Apply for DPIIT Recognition', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Company Docs', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'trade-license': {
        heroSection: {
          title: 'Get Your Trade License from Local Authorities Hassle-Free',
          subtitle:
            'Start your business operations legally with a trade license from your municipal corporation — fast, reliable, and expert-handled.',
          ctas: [
            { label: 'Apply for Trade License', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Business Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a License Consultant', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Required for Shops, Restaurants, Offices, Services', icon: 'StorefrontOutlined', size: 20 },
            { text: 'Valid Across Indian States', icon: 'GavelOutlined', size: 20 },
            { text: 'Professionally Drafted & Filed', icon: 'CheckCircleOutlineOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Starting a commercial, retail, or service business',
          'Opening a shop, restaurant, clinic, hotel, or office',
          'Need to comply with municipal health, safety, and zoning laws'
        ],
        pricing: {
          title: 'Location-Specific Pricing with Support Across India',
          plans: [
            { name: 'Standard Trade License', bestFor: 'New license application (includes consultation)', price: '₹2,499 onwards' },
            { name: 'Renewal / Modifications', bestFor: 'Update, renew, or amend trade license', price: '₹1,499 onwards' }
          ],
          note: '*Final cost depends on location, trade type, and ULB charges. Government fee additional as per municipality.'
        },
        whatsIncluded: [
          'Eligibility check and license type identification',
          'Document preparation and review',
          'Application filing with respective municipal authority',
          'Coordination with local ULB for inspection (if required)',
          'Delivery of trade license certificate',
          'Renewal or amendment support (if needed)'
        ],
        documentsRequired: [
          'PAN & Aadhaar of proprietor/director',
          'Passport-size photo',
          'Address proof of business (rent agreement/NOC or EB bill)',
          'Property tax receipt (for owned premises)',
          'Certificate of Incorporation (for companies/LLPs)',
          'Layout plan (for shops/establishments in some states)',
          'Business commencement details'
        ],
        howItWorks: [
          'Submit your basic business details & location',
          'We assess applicable local rules & prepare application',
          'File online or offline with local municipal authority',
          'Coordinate site visit or verification (if applicable)',
          'Receive your trade license certificate via email'
        ],
        timeline: '5–10 Working Days (depends on municipality)',
        whyChooseUs: [
          'Pan-India filing support',
          'Familiarity with local ULB documentation formats',
          'End-to-end assistance including renewals',
          'Updates via WhatsApp, email, and dashboard',
          'Transparent pricing — no hidden costs'
        ],
        faqs: [
          {
            question: 'Is a trade license mandatory for every business?',
            answer: 'Yes, if your business involves a physical commercial space or public-facing operations.'
          },
          {
            question: 'Is it different from Shops & Establishment license?',
            answer: 'Yes. Trade License relates to local trade operations; Shop Act covers employee rights.'
          },
          {
            question: 'What is the validity of a trade license?',
            answer: 'Usually 1 year. Renewal is required annually.'
          },
          {
            question: 'Is there a penalty for not having a license?',
            answer: 'Yes, penalties or business closure orders may be issued by the municipality.'
          },
          {
            question: 'Can I get it done completely online?',
            answer: 'In most metros and major cities — yes. Some towns may require a physical visit.'
          }
        ],
        relatedServices: [
          'Shops & Establishment License',
          'GST Registration',
          'FSSAI License (for food business)',
          'Labour License',
          'MSME / Udyam Registration'
        ],
        stickyFooterCta: {
          text: 'Start your business legally with a trade license — get it done right with our expert support.',
          buttons: [
            { label: 'Apply for Trade License', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Business Info', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      iec: {
        heroSection: {
          title: 'Get Your Import Export Code (IEC) in 2–3 Days',
          subtitle: 'Start your international trade journey with a DGFT-approved IEC. Mandatory for import/export of goods and services.',
          ctas: [
            { label: 'Apply for IEC Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Business Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Trade Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'DGFT Registered IEC', icon: 'GavelOutlined', size: 20 },
            { text: 'Mandatory for Import/Export', icon: 'VerifiedOutlined', size: 20 },
            { text: 'Ideal for Businesses, Startups, Exporters', icon: 'BusinessCenterOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Businesses or individuals importing/exporting goods or services',
          'Dealing with international clients or suppliers',
          'Wishing to avail export promotion scheme benefits',
          'Applicable to Proprietorships, Partnerships, LLPs, Pvt Ltd Companies, NGOs, Trusts'
        ],
        pricing: {
          title: 'Fast, Affordable, Fully Online',
          plans: [
            { name: 'Standard IEC', bestFor: 'Fresh IEC Registration + eCertificate', price: '₹1,299' },
            { name: 'Combo (IEC + MSME)', bestFor: 'IEC Registration + Udyam Certificate', price: '₹1,999' }
          ],
          note: '*Includes application, DGFT filing, and digital delivery. Govt. fee included.'
        },
        whatsIncluded: [
          'Eligibility check and expert consultation',
          'Application filing with DGFT',
          'DSC-based filing for Companies/LLPs',
          'Submission and follow-up on DGFT portal',
          'Delivery of IEC Certificate via email (PDF)',
          'Support with linking PAN/GST (if needed)'
        ],
        documentsRequired: [
          'Proprietorship: PAN Card, Aadhaar Card, Bank Statement / Cancelled Cheque, Passport-size Photograph, Business Address Proof',
          'LLP/Company: PAN of Entity, Certificate of Incorporation, PAN & Aadhaar of Director/Partner, Cancelled Cheque / Bank Statement, Digital Signature (DSC filing)'
        ],
        howItWorks: [
          'Select plan and upload documents',
          'Team verifies and prepares application',
          'File IEC request on DGFT portal',
          'Track approval status',
          'Receive IEC Certificate by email'
        ],
        timeline: '2–3 Working Days',
        whyChooseUs: [
          '100% Online Process',
          'Govt-Recognized Consultants',
          'Dedicated support till certificate delivery',
          'Combo plans with GST or MSME registration',
          'Fastest processing in India (avg. 48 hrs)'
        ],
        faqs: [
          {
            question: 'Is IEC mandatory for service exports like IT services?',
            answer: 'Yes, if you receive foreign remittance, it’s recommended.'
          },
          {
            question: 'Do I need to renew IEC every year?',
            answer: 'No, it’s valid for lifetime. Only periodic updates are needed.'
          },
          {
            question: 'Can I use IEC for multiple businesses?',
            answer: 'IEC is linked to PAN — one IEC per PAN.'
          },
          {
            question: 'Can individuals apply without a company?',
            answer: 'Yes, sole proprietors can apply with PAN & Aadhaar.'
          },
          {
            question: 'Is IEC linked with GST?',
            answer: 'Yes, PAN-based IEC is auto-synced with GST.'
          }
        ],
        relatedServices: [
          'MSME/Udyam Registration',
          'GST Registration',
          'Startup India Registration',
          'Export Incentive Claims',
          'Import Documentation Assistance'
        ],
        stickyFooterCta: {
          text: 'Expand beyond borders — get your IEC and begin your global business journey today.',
          buttons: [
            { label: 'Apply for IEC', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Documents', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'labour-license': {
        heroSection: {
          title: 'Get Your Labour License for Legal Hiring and Workforce Compliance',
          subtitle:
            'Labour license registration under the Contract Labour (Regulation & Abolition) Act for companies hiring more than 20 contract workers.',
          ctas: [
            { label: 'Apply for Labour License', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Company Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Compliance Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'For Companies, Contractors & Builders', icon: 'EngineeringOutlined', size: 20 },
            { text: 'State-Wise Compliance Support', icon: 'GavelOutlined', size: 20 },
            { text: 'Licensed under Labour Department', icon: 'VerifiedOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Employers or principal contractors engaging 20+ contract workers',
          'Subcontractors deploying labour at client sites',
          'Projects involving construction, factories, infrastructure, or manpower outsourcing',
          'Applicable under Contract Labour (Regulation and Abolition) Act, 1970'
        ],
        pricing: {
          title: 'State-Wise Pricing with Expert Filing',
          plans: [
            { name: 'Labour License Filing', bestFor: 'Application filing + documentation', price: '₹3,499 onwards' },
            { name: 'Renewal / Amendment', bestFor: 'Changes or annual renewal support', price: '₹2,499 onwards' }
          ],
          note: '*Final price varies by state, labour department fees, and number of workers.'
        },
        whatsIncluded: [
          'Initial consultation to determine applicable act/state rules',
          'Preparation of documents & contractor details',
          'Filing of Form IV with Labour Commissioner',
          'Coordination for affidavit, surety bond or solvency certificate (if required)',
          'Issuance of labour license certificate',
          'Renewal, modification or extension filing support'
        ],
        documentsRequired: [
          'PAN & Aadhaar of employer/contractor',
          'Certificate of Incorporation / Partnership Deed',
          'Address proof of establishment',
          'Employee strength details (nature of work, count, wages)',
          'Work order/agreement with principal employer',
          'ID proof of principal employer',
          'Surety bond / solvency certificate (if required)',
          'Photograph and mobile number'
        ],
        howItWorks: [
          'Fill out basic business info and number of workers',
          'Guidance on state-specific rules & documentation',
          'Prepare and submit Form IV to labour department',
          'Coordinate for inspection/approval with department',
          'Get your Labour License certificate'
        ],
        timeline: '7–15 Working Days (depending on state)',
        whyChooseUs: [
          'Pan-India service with local legal support',
          'Familiarity with state-specific labour rules',
          'Fast and compliant documentation support',
          'Help with affidavits, bonds, and principal employer docs',
          'End-to-end handling with reminders for renewals'
        ],
        faqs: [
          {
            question: 'Is labour license mandatory for all companies?',
            answer: 'Only if you engage more than 20 contract workers (some states have lower limits).'
          },
          {
            question: 'Who issues the labour license?',
            answer: 'The Labour Department of the respective State Government.'
          },
          {
            question: 'What is the validity of a labour license?',
            answer: 'Usually valid for 1 year or for the duration of the contract.'
          },
          {
            question: 'Can you help with renewal or expansion of workforce?',
            answer: 'Yes, we handle all amendments and renewals.'
          },
          {
            question: 'Do I need separate licenses for different states?',
            answer: 'Yes, labour licenses are state-specific.'
          }
        ],
        relatedServices: [
          'Trade License',
          'Shops & Establishment Registration',
          'EPF & ESI Registration',
          'GST Registration',
          'Payroll Processing'
        ],
        stickyFooterCta: {
          text: 'Comply with labour laws and run your workforce operations legally — get your labour license filed today.',
          buttons: [
            { label: 'Apply for Labour License', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Business Info', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      }
    }
  },
  legal: {
    title: 'ROC & Legal',
    pages: {
      'annual-filings': {
        heroSection: {
          title: 'File Your Annual ROC Returns — Stay Compliant, Stay Protected',
          subtitle:
            'We help companies and LLPs file AOC-4, MGT-7, MGT-7A, and Form 8/11 on time, accurately, and with CA/CS-backed compliance.',
          ctas: [
            { label: 'Start My Annual Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Financials & Company Info', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a ROC Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Private Ltd, OPC, LLP, Section 8', icon: 'FolderOutlined', size: 20 },
            { text: 'MCA Filing + Board Meeting Drafts', icon: 'EventNoteOutlined', size: 20 },
            { text: 'Late Filing, Revival & Strike-Off Advisory Available', icon: 'CheckCircleOutlineOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          "You're a Private Limited Company, One Person Company (OPC), or LLP",
          'Your company has closed its first financial year',
          'You want to maintain active status and avoid penalties or strike-off',
          'You’ve received MCA reminders or notices for pending filings'
        ],
        pricing: {
          title: 'Transparent Pricing Based on Entity Type',
          plans: [
            { name: 'Private Ltd / OPC', bestFor: 'AOC-4 + MGT-7/MGT-7A', price: '₹3,999 onwards' },
            { name: 'LLP', bestFor: 'Form 8 + Form 11', price: '₹2,999 onwards' },
            { name: 'Late Filings', bestFor: 'With additional fee calculator', price: 'Custom Quote' }
          ],
          note: '*Includes filing, drafting, MCA fees (up to ₹1 lakh capital), and compliance review. Additional charges for DSC, late fees, etc.'
        },
        whatsIncluded: [
          'Review of previous filings and due date tracker',
          'Financial statement review + auditor info update',
          'Director disclosures and DIN validation',
          'Preparation of AOC-4 (Financials) and MGT-7 (Annual Return)',
          'Filing of Form 8/11 for LLPs',
          'Board resolution and AGM documentation (if applicable)',
          'MCA portal filing + acknowledgment receipt',
          'Reminder setup for next year’s compliance',
          'Optional: DIR-3 KYC filing, Auditor appointment/change (ADT-1), Strike-off application or revival advisory'
        ],
        documentsRequired: [
          'Balance Sheet + P&L (signed by director & auditor)',
          'Audit Report + Notes to Accounts',
          'List of shareholders and shareholding pattern',
          'Board meeting and AGM records (if held)',
          'LLP agreement (for LLPs)',
          'Previous year’s filings (if available)',
          'Digital Signature Certificate (DSC) of director/partner'
        ],
        howItWorks: [
          'Share basic company/LLP info and upload financials',
          'We prepare, review and validate forms',
          'Draft board resolutions + MCA form attachments',
          'File forms on MCA portal with DSC',
          'Share acknowledgment and compliance tracker'
        ],
        timeline: '3–5 Working Days from document receipt',
        whyChooseUs: [
          'Experienced CS + CA-led ROC team',
          'Track record of 1000+ filings with 0 rejections',
          'MCA portal expertise + support for technical errors',
          'On-time reminders for future filings',
          'Bundled plans with bookkeeping, audit, and DIR-3 KYC'
        ],
        faqs: [
          {
            question: 'Is ROC filing required even for NIL companies?',
            answer: 'Yes — even if you had no income or operations.'
          },
          {
            question: 'What if I missed the deadline?',
            answer: 'We assist with late filing + additional fee calculation.'
          },
          {
            question: 'Do I need to hold an AGM before filing?',
            answer: "Yes, for Pvt Ltd and OPC. LLPs don't have AGMs."
          },
          {
            question: 'Can you help if my company was struck off?',
            answer: 'Yes — we offer revival and strike-off compliance help.'
          },
          {
            question: 'Is audit mandatory before filing AOC-4?',
            answer: 'Yes — even for NIL income companies.'
          }
        ],
        relatedServices: [
          'Auditor Appointment (ADT-1)',
          'DIR-3 KYC Filing',
          'Strike-Off or Revival',
          'Bookkeeping & Accounting',
          'Virtual CFO + Compliance Calendar'
        ],
        stickyFooterCta: {
          text: 'Don’t miss your ROC deadlines — get your AOC-4, MGT-7, or LLP returns filed fast and compliantly.',
          buttons: [
            { label: 'Start Annual Filing Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Compliance Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Financials', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'director-change': {
        heroSection: {
          title: 'Add, Remove, or Update Directors & Shareholders — Legally and Smoothly',
          subtitle:
            'Whether you’re bringing in a co-founder, exiting a partner, or realigning shareholding — we’ll handle the entire process, filings, and documentation.',
          ctas: [
            { label: 'Request Change Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Company Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Legal Compliance Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Director & Shareholder Changes', icon: 'ChangeCircleOutlined', size: 20 },
            { text: 'MCA, ROC, DIN, DSC Handled', icon: 'GavelOutlined', size: 20 },
            { text: 'Private Ltd, LLP, OPC, Section 8', icon: 'BusinessCenterOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Adding or removing a director or partner',
          'Transferring shares among existing/new shareholders',
          'Realigning equity post-investment or exit',
          'Regularising appointments (due to resignation or MCA query)',
          'Complying with statutory filings for board/ownership changes'
        ],
        pricing: {
          title: 'Flat-Fee + MCA Compliance Bundles',
          plans: [
            { name: 'Director Addition/Resignation', includes: 'DIR-12, board resolution, appointment letter', price: '₹2,499 onwards' },
            { name: 'Share Transfer', includes: 'SH-4, board resolution, share ledger update', price: '₹2,999 onwards' },
            { name: 'Dual Change (Dir + Shares)', includes: 'Combined package', price: '₹4,999 onwards' }
          ],
          note: '*Govt fees, stamp duty, and DSC extra as applicable.'
        },
        whatsIncluded: [
          'Board meeting resolution drafting (appointment/resignation/transfer)',
          'Preparation and filing of DIR-12 for directors',
          'Assistance with DIN, DSC, and consent letters',
          'Share transfer documentation (SH-4 form)',
          'Updating company’s share register and ledgers',
          'ROC filing with acknowledgement',
          'Advisory on legal impact and cap table updates',
          'Optional: Shareholder Agreement Drafting, Cap Table Redesign, ESOP Adjustment Support'
        ],
        documentsRequired: [
          'PAN & Aadhaar of incoming/outgoing director/shareholder',
          'DIN (if available) and digital signature',
          'Board meeting minutes/resolution (we help draft it)',
          'Updated MOA (if applicable)',
          'Existing shareholding pattern',
          'Share Transfer Form (SH-4) and share certificates (if needed)',
          'Letter of resignation/consent'
        ],
        howItWorks: [
          'Book a call or submit company details',
          'We prepare draft resolutions & verify required documents',
          'File DIR-12 / SH-4 / other MCA forms',
          'Update share register or board records',
          'Deliver proof of filing and updated compliance sheet'
        ],
        timeline: '3–7 Working Days',
        whyChooseUs: [
          '1000+ successful change filings handled',
          'CA + CS backed documentation and filing',
          'Legal vetting + optional agreement drafting',
          'Works for new co-founders, exits, funding, restructuring',
          'Aligned with ROC, MCA, and Companies Act compliance'
        ],
        faqs: [
          {
            question: 'Can I remove a director without their signature?',
            answer: 'Not directly — process must follow proper board/AGM protocols.'
          },
          {
            question: 'Is DIN required before adding a director?',
            answer: 'Yes — or we help you apply for one.'
          },
          {
            question: 'What’s SH-4 used for?',
            answer: 'It’s the share transfer form signed by buyer and seller.'
          },
          {
            question: 'Will you update the cap table too?',
            answer: 'Yes — if you opt for our cap table maintenance service.'
          },
          {
            question: 'What happens after filing DIR-12?',
            answer: 'You get a ROC acknowledgment, and MCA master data updates.'
          }
        ],
        relatedServices: [
          'ROC Annual Filing (AOC-4, MGT-7)',
          'Auditor Appointment (ADT-1)',
          'Shareholder Agreement Drafting',
          'Virtual CFO',
          'Startup India + Cap Table Setup'
        ],
        stickyFooterCta: {
          text: 'Keep your company’s board and ownership compliant — we’ll handle your director and shareholding changes end to end.',
          buttons: [
            { label: 'Start Director/Shareholder Change', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Legal Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Company Docs', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'dir3-kyc': {
        heroSection: {
          title: 'File Your DIR-3 KYC and Keep Your DIN Active',
          subtitle:
            'Mandatory KYC for directors and designated partners — avoid DIN deactivation, penalties, and MCA non-compliance with our hassle-free filing support.',
          ctas: [
            { label: 'Start DIR-3 KYC Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload PAN & Aadhaar', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a MCA Filing Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Mandatory for All Directors', icon: 'GavelOutlined', size: 20 },
            { text: 'MCA Rule 12A | DIN Activation Support', icon: 'PolicyOutlined', size: 20 },
            { text: 'OTP-Based or Digital Signature Filing', icon: 'LockOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'All individuals holding a Director Identification Number (DIN)',
          'Directors of private limited, LLPs, public companies',
          'Resigned directors still holding DIN',
          'DIN holders before 31st March of relevant financial year'
        ],
        pricing: {
          title: 'Flat-Fee Filing for Peace of Mind',
          plans: [
            { name: 'KYC Web (OTP)', bestFor: 'Directors with prior KYC done', price: '₹499' },
            { name: 'KYC Form (DSC)', bestFor: 'New contact / first-time KYC', price: '₹999' },
            { name: 'DIN Reactivation', bestFor: 'Missed KYC / penalty assistance', price: 'Custom Quote' }
          ],
          note: '*Includes form filling, DSC affixation, MCA portal filing, and acknowledgment receipt.'
        },
        whatsIncluded: [
          'Director document verification',
          'Drafting and submission of DIR-3 KYC (Web or Form)',
          'OTP validation (for Web KYC)',
          'DSC-based filing (for new/updated info)',
          'Filing on MCA portal + acknowledgment receipt',
          'Reminder setup for future KYC filings',
          'Optional: DSC application/renewal, DIN recovery'
        ],
        documentsRequired: [
          'PAN Card of Director',
          'Aadhaar Card (linked with mobile number)',
          'Mobile number and email ID (unique)',
          'Digital Signature Certificate (DSC)',
          'Passport (for foreign nationals)'
        ],
        howItWorks: [
          'Choose Web or Form-based KYC',
          'Upload your documents securely',
          'Our MCA team verifies and prepares filing',
          'Complete OTP or DSC-based verification',
          'Receive acknowledgment from MCA',
          'DIN status updated to Active'
        ],
        timeline: 'Within 1 working day (Same-day urgent support available)',
        whyChooseUs: [
          '1000+ DIR-3 KYC filings handled successfully',
          'Same-day filing support available',
          'Support for DIN penalty & DIN Reactivation',
          'MCA portal expert handling (CA & CS team)',
          'Bundled services with annual filings and board changes'
        ],
        faqs: [
          {
            question: 'Is DIR-3 KYC mandatory every year?',
            answer: 'Yes — All directors with DIN must file KYC every year to keep DIN Active.'
          },
          {
            question: 'What happens if I miss the KYC deadline?',
            answer: 'Your DIN will be deactivated and ₹5,000 penalty applies. We can help reactivate.'
          },
          {
            question: 'Can you help renew DSC if expired?',
            answer: 'Yes, we can issue DSC within 1 day and proceed with KYC filing.'
          },
          {
            question: 'Is Web KYC and Form KYC different?',
            answer: 'Yes — Web KYC uses OTP verification, Form KYC uses DSC for filing.'
          },
          {
            question: 'Can you assist if I have wrong mobile/email linked?',
            answer: 'Yes, full Form DIR-3 KYC with DSC is needed for updated details.'
          }
        ],
        relatedServices: [
          'ROC Annual Filings (AOC-4, MGT-7)',
          'Director Change Filings',
          'Digital Signature (DSC) Application',
          'Auditor Appointment (ADT-1)',
          'Compliance Calendar Subscription'
        ],
        stickyFooterCta: {
          text: 'Avoid DIN deactivation — get your DIR-3 KYC filed quickly and correctly with our expert support.',
          buttons: [
            { label: 'Start KYC Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to MCA Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload PAN & Aadhaar', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'board-resolution': {
        heroSection: {
          title: 'Get Professionally Drafted Board Resolutions — Quick, Compliant, and Custom',
          subtitle:
            'Whether it’s for director changes, bank approvals, investments, share transfers, or statutory compliance — we help you draft and document board decisions accurately.',
          ctas: [
            { label: 'Request a Board Resolution', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Company Details & Purpose', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Company Secretary', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'MCA-Compliant Drafts', icon: 'DescriptionOutlined', size: 20 },
            { text: 'CS-Verified for ROC Use', icon: 'GavelOutlined', size: 20 },
            { text: 'Works for Pvt Ltd, LLP, OPC, Section 8', icon: 'BusinessOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Adding/removing a director or shareholder',
          'Opening a new bank account or updating signatories',
          'Changing the registered address, company name, or auditors',
          'Issuing shares, transferring shares, or declaring dividends',
          'Applying for loans, registrations, licenses, or tenders'
        ],
        pricing: {
          title: 'Flat Fee for Standard & Custom Drafts',
          plans: [
            { name: 'Standard Draft', bestFor: 'Common resolutions (bank, audit, etc.)', price: '₹499' },
            { name: 'Custom Draft', bestFor: 'Tailored to specific business event', price: '₹999' },
            { name: 'Bulk Package (5+)', bestFor: 'HR, finance, MCA, investment, etc.', price: 'Custom Quote' }
          ],
          note: '*Includes legal vetting by CS. MCA form filing not included.'
        },
        whatsIncluded: [
          'One-on-one consultation to understand your resolution need',
          'Drafting of board or shareholder resolution (as required)',
          'Optional agenda note + minutes of meeting (MoM)',
          'Cross-check with MCA and Companies Act provisions',
          'Email delivery in Word & PDF formats',
          'Filing support (if combined with DIR/SH/RoC services)'
        ],
        documentsRequired: [
          'Company name, CIN, PAN',
          'Board composition',
          'Purpose of resolution',
          'Existing Articles/MOA clauses (if related)',
          'Timeline and context (if urgent or regulatory deadline involved)'
        ],
        howItWorks: [
          'Share resolution purpose and company details',
          'We draft and review the board resolution',
          'You review and approve final version',
          '(Optional) We help you file relevant forms (DIR-12, SH-7, etc.)'
        ],
        timeline: '1–2 Working Days (standard), 4–6 hours (urgent)',
        whyChooseUs: [
          'Drafted by CS/Legal experts — MCA-aligned',
          'Clean format, legally accurate language',
          'Used by startups, SMEs, NGOs, and corporates',
          'Optional bundled RoC filings',
          'Priority/urgent delivery available'
        ],
        faqs: [
          {
            question: 'Is board resolution drafting mandatory for every decision?',
            answer: 'Only for decisions that impact statutory compliance, governance, or operations.'
          },
          {
            question: 'Will I get both Word and PDF formats?',
            answer: 'Yes — both editable and final files are shared.'
          },
          {
            question: 'Can you help with resolutions for LLPs?',
            answer: 'Yes — we handle partnership resolutions as well.'
          },
          {
            question: 'Can I reuse a resolution template for future filings?',
            answer: 'You can, but legal vetting is recommended for each case.'
          },
          {
            question: 'Do you offer filing support after drafting?',
            answer: 'Yes — we can assist with MCA forms (DIR-12, MGT-14, SH-7, etc.).'
          }
        ],
        relatedServices: [
          'Change in Director / Shareholder',
          'ROC Annual Filing',
          'Auditor Appointment (ADT-1)',
          'Company Law Advisory',
          'Virtual CFO + Compliance Tracker'
        ],
        stickyFooterCta: {
          text: 'One board resolution done right can protect your entire business — let’s get it legally perfect.',
          buttons: [
            { label: 'Get My Resolution Drafted', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a CS Now', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Company Info', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'agreement-drafting': {
        heroSection: {
          title: 'Get Legally Sound Agreements Drafted by Experts',
          subtitle:
            'From founder agreements to NDAs, vendor contracts, ESOP docs, and more — we draft, vet, and finalize your agreements with clarity and compliance.',
          ctas: [
            { label: 'Request Agreement Drafting', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Draft or Share Your Needs', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Legal Drafting Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Business, HR, Investment, IP, Vendor Agreements', icon: 'GavelOutlined', size: 20 },
            { text: 'Drafted by CS + Legal Team', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'Editable Format + Final PDF Included', icon: 'DescriptionOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Founders/startups entering partnerships, investments, or early hires',
          'SMEs formalizing vendor/supplier or service contracts',
          'HR teams drafting NDAs, employment contracts, or ESOP letters',
          'Companies requiring IP, licensing, or usage agreements',
          'Anyone wanting clean legal documentation to avoid disputes'
        ],
        pricing: {
          title: 'Affordable Legal Drafting for Growing Businesses',
          plans: [
            { name: 'Standard Agreement', bestFor: 'NDA, Employment, Vendor, Rental', price: '₹999–₹1,499' },
            { name: 'Custom Agreement', bestFor: 'Shareholder, Founder, Investment', price: '₹2,499 onwards' },
            { name: 'Bulk Drafting Package', bestFor: '5+ agreements (HR/ops/legal bundle)', price: 'Custom Quote' }
          ],
          note: '*Includes 1 round of edits. Legal vetting, stamping, or execution optional.'
        },
        whatsIncluded: [
          'Consultation to understand your business context',
          'Agreement template draft from scratch or review of existing draft',
          'Customization of clauses (duration, confidentiality, IP, termination, etc.)',
          'Industry-specific best practices and legal language',
          'Word + PDF version delivery',
          'Guidance on stamping, e-signing, or notarization (if needed)'
        ],
        documentsRequired: [
          'Type of agreement',
          'Names and roles of parties',
          'Key clauses or terms to include (optional)',
          'Duration, scope of work/engagement, consideration',
          'Existing drafts or references (if available)'
        ],
        howItWorks: [
          'Share your requirements or upload a draft',
          'We schedule a quick call (if needed)',
          'Our legal team drafts or reviews and finalizes agreement',
          'We share in Word + PDF format',
          '(Optional) We assist with stamping, e-sign, or execution'
        ],
        timeline: '2–4 Working Days',
        whyChooseUs: [
          'Experienced CS + legal team across 15+ industries',
          'Focus on clarity, enforceability, and protection',
          'Fast turnaround for time-sensitive needs',
          'Bundle-friendly with HR, compliance, and investment docs',
          'Support from draft to execution'
        ],
        faqs: [
          {
            question: 'Can I edit the agreement later?',
            answer: 'Yes — you’ll get an editable Word version.'
          },
          {
            question: 'Will this be valid legally?',
            answer: 'Yes — our drafts follow Indian Contract Act and industry best practices.'
          },
          {
            question: 'Can I get multiple drafts done at once?',
            answer: 'Yes — our bundle packages are perfect for that.'
          },
          {
            question: 'Will you file or notarize the agreement too?',
            answer: 'Stamping or notarization is optional and can be facilitated at extra cost.'
          },
          {
            question: 'What if I need changes after the draft is shared?',
            answer: 'One revision is included. Additional edits are charged nominally.'
          }
        ],
        relatedServices: [
          'Co-Founder & Shareholder Agreement',
          'ESOP Drafting & Policy',
          'Virtual CFO + Compliance Calendar',
          'DIR-3 KYC + ROC Filings',
          'HR Letters, Contracts & NDAs'
        ],
        stickyFooterCta: {
          text: 'Protect your business with clear, enforceable agreements — drafted by professionals who understand startups and scale.',
          buttons: [
            { label: 'Get My Agreement Drafted', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Legal Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Draft or Brief', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      rera: {
        heroSection: {
          title: 'Stay RERA-Compliant from Day One — No Delays, No Penalties',
          subtitle:
            "Get expert help with RERA registration, quarterly updates, and ongoing project filings — whether you're a builder, developer, or real estate agent.",
          ctas: [
            { label: 'Start My RERA Compliance', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Project/Agent Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a RERA Filing Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Builder/Promoter, Agent, Project Registrations', icon: 'EngineeringOutlined', size: 20 },
            { text: 'State-Specific Filing Formats', icon: 'DescriptionOutlined', size: 20 },
            { text: 'Quarterly + Annual Disclosures', icon: 'AssignmentTurnedInOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You’re a developer/promoter launching a residential or commercial project',
          'Your project exceeds 500 sq. meters or 8 units',
          'You’re a real estate agent dealing in RERA-registered projects',
          'You want to avoid penalties, blacklisting, or refund claims'
        ],
        pricing: {
          title: 'Transparent Plans for Promoters & Agents',
          plans: [
            { name: 'RERA Project Registration', bestFor: 'Drafting + online filing + certification', price: '₹9,999 onwards' },
            { name: 'Quarterly Updates (QPR)', bestFor: 'Progress update filing + certificate', price: '₹1,999/quarter' },
            { name: 'RERA Agent Registration', bestFor: 'Individual/company RERA license', price: '₹4,999 onwards' }
          ],
          note: '*Pricing varies by state and documentation required. Govt. fees additional.'
        },
        whatsIncluded: [
          'Application form preparation & submission (RERA portal)',
          'Drafting of affidavits, declarations, and project info',
          'Architect, CA, Engineer certificate review',
          'Upload of legal title report, sanctions, and land docs',
          'Quarterly Project Updates (QPR) + Annual Form 5 Filing',
          'RERA certificate delivery + follow-up',
          'PAN, Aadhaar, registration filing for agents',
          'Agent code issuance + RERA license',
          'Renewal tracking and updates',
          'Escrow Account Advisory (optional)',
          'Brochure and website compliance check (optional)',
          'Drafting of Sale Agreements as per RERA norms'
        ],
        documentsRequired: [
          'PAN of promoter/company',
          'Land title & ownership documents',
          'Development approvals + layout plan',
          'CA, architect, and engineer certificates',
          'Project brochure and declaration form',
          'Past project completion details',
          'PAN, Aadhaar, address proof for agent',
          'Business registration certificate (if company)',
          'Photograph and signature scan'
        ],
        howItWorks: [
          'Choose service (project or agent registration)',
          'Share documents via portal or email',
          'Draft application prepared by our team',
          'Filing done on state RERA portal',
          'Get certificate, updates, and renewal alerts'
        ],
        timeline: 'Project Registration: 7–10 Working Days, QPR/Annual Filing: Within 3 days of quarter/year end',
        whyChooseUs: [
          '200+ RERA registrations handled across 12 states',
          'Affordable compliance for small & large developers',
          'End-to-end support — from filing to renewals',
          'Optional drafting, escrow, and legal reviews',
          'On-time quarterly update service with reminders'
        ],
        faqs: [
          { question: 'Is RERA applicable to ongoing or small projects?', answer: 'Yes — if they exceed the defined threshold.' },
          {
            question: 'What if I miss quarterly updates?',
            answer: 'You may face penalties or website blacklisting. We offer timely reminders.'
          },
          {
            question: 'Can you help if I’ve already started construction?',
            answer: 'Yes — but registration is mandatory before any sale.'
          },
          {
            question: 'Will you also handle renewal and Form 5?',
            answer: "Yes — it's included in our annual or quarterly compliance package."
          },
          { question: 'What if I’m an agent working under a developer?', answer: 'You still need individual RERA registration.' }
        ],
        relatedServices: [
          'Agreement Drafting (Sale, Allotment, Possession)',
          'Escrow Account Setup',
          'Quarterly CA/Engineer Certificates',
          'GST + TDS on Property Sales',
          'Virtual CFO for Real Estate'
        ],
        stickyFooterCta: {
          text: 'Don’t let RERA delays hurt your business — get registered, stay compliant, and focus on building.',
          buttons: [
            { label: 'Start My RERA Filing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a RERA Specialist', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Project Info', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      }
    }
  },
  advisory: {
    title: 'Advisory',
    pages: {
      'financial-modelling': {
        heroSection: {
          title: 'Build Investor-Ready Financial Models that Actually Make Sense',
          subtitle:
            'Revenue forecasts, cost structures, profitability, cash flow — turned into a dynamic Excel model tailored to your startup or business.',
          ctas: [
            { label: 'Request Financial Model', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Business Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Book Free Discovery Call', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Ideal for Fundraising, Strategic Planning, Internal Decision-Making', icon: 'TrendingUpOutlined', size: 20 },
            { text: '3 to 5 Year Forecasting', icon: 'TimelineOutlined', size: 20 },
            { text: 'Built by CA + Analyst Team', icon: 'GroupsOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You’re raising funding and need a solid 3–5 year projection',
          'You need a model to support your investor pitch deck',
          'You want clarity on business viability and breakeven',
          'You’re applying for a loan or line of credit',
          'You want to simulate pricing, cost, or unit economics changes'
        ],
        pricing: {
          title: 'Plans Based on Business Stage and Complexity',
          plans: [
            { name: 'Startup Basic Model', bestFor: 'Revenue, cost, net margin projections', price: '₹7,999' },
            { name: 'Investor-Grade Model', bestFor: 'Fully dynamic with drivers + scenarios', price: '₹14,999' },
            { name: 'Custom Enterprise Model', bestFor: 'Multi-segment or multi-country', price: 'Custom Quote' }
          ],
          note: '*All models delivered in Excel with dynamic sheets, formulas, and scenario toggles'
        },
        whatsIncluded: [
          'Revenue model (unit-based or pricing-based)',
          'Cost structure (fixed, variable, semi-variable)',
          'Manpower planning, hiring cost logic',
          'EBITDA & PAT calculation',
          '3–5 year cash flow, balance sheet, and P&L',
          'Scenario/sensitivity analysis (growth rate, burn, pricing)',
          'CapEx and depreciation schedule',
          'Funding requirement & use of funds tracker',
          'Output dashboard with graphs & investor summary',
          'Add-ons: Valuation (DCF, VC method), Fundraising deck, Cap table and dilution simulation'
        ],
        documentsRequired: [
          'Business model overview (deck or summary)',
          'Revenue channels and pricing model',
          'Fixed & variable cost structure',
          'Hiring plan',
          'Existing financials (if any)',
          'Target growth rate / use case'
        ],
        howItWorks: [
          'Book a free discovery call or place order',
          'Share your business inputs (we guide you)',
          'We build a custom Excel-based model with review checkpoints',
          'Final delivery + walkthrough with our finance expert'
        ],
        timeline: '5–10 working days',
        whyChooseUs: [
          'Built by CAs and analysts who’ve worked on 500+ models',
          'Models used by real investors, VCs, banks, and accelerators',
          'Industry-specific logic and accurate assumptions',
          'Clean format with editable assumptions and summary view',
          'Optional support for investor meetings'
        ],
        faqs: [
          {
            question: 'Is the model editable?',
            answer: 'Yes — you get a fully unlocked Excel version.'
          },
          {
            question: 'Can I request changes later?',
            answer: 'Yes, one round of changes is included. More can be added at nominal cost.'
          },
          {
            question: 'Will you help me fill in missing numbers?',
            answer: 'Yes — we support with benchmarking and estimates if data is incomplete.'
          },
          {
            question: 'Can I get only revenue modelling done?',
            answer: 'Yes, partial model requests are welcome.'
          },
          {
            question: 'Will you explain the model once it’s delivered?',
            answer: 'Absolutely — we include a walkthrough call.'
          }
        ],
        relatedServices: [
          'Business Valuation',
          'Investor Pitch Deck',
          'Virtual CFO',
          'Due Diligence Support',
          'Fundraising Strategy & Advisory'
        ],
        stickyFooterCta: {
          text: 'Forecast your growth with a financial model that speaks your business language — and your investor’s too.',
          buttons: [
            { label: 'Get My Financial Model', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Financial Analyst', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Business Plan', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'pitch-deck': {
        heroSection: {
          title: 'Craft a Pitch Deck That Wins Investor Attention',
          subtitle:
            'Professionally designed, narrative-driven pitch decks with all the financial and strategic content investors expect — and love.',
          ctas: [
            { label: 'Build My Pitch Deck', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload My Startup Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Book Free Deck Consultation', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Designed for Seed to Series A', icon: 'RocketLaunchOutlined', size: 20 },
            { text: 'Deck + Financials + Valuation Add-ons', icon: 'InsertChartOutlined', size: 20 },
            { text: 'Used by 500+ Startups Across India', icon: 'StarOutlineOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Startups preparing for Seed, Angel, or Series A funding',
          'Founders who want a deck that communicates clearly and converts',
          'Businesses pivoting and needing to reframe their story',
          'Anyone applying to accelerators, pitch events, or VC intros'
        ],
        pricing: {
          title: 'Storytelling Meets Strategy',
          plans: [
            { name: 'Standard Deck', bestFor: '10-slide pitch deck (content + design)', price: '₹7,999' },
            { name: 'Investor-Grade Deck', bestFor: 'Full narrative + financial slide add-on', price: '₹14,999' },
            { name: 'Deck + Financial Model', bestFor: 'Deck + 3Y projections (bundle)', price: '₹19,999+' }
          ],
          note: '*Includes design, strategic positioning, and 1 round of edits. Pitch training optional.'
        },
        whatsIncluded: [
          'Company overview & problem statement',
          'Market size & opportunity mapping',
          'Solution/product walkthrough',
          'Revenue model & monetization logic',
          'Traction & milestones',
          'Business model + GTM strategy',
          'Competitive landscape',
          'Team & advisory board',
          'Ask slide (funding + use of funds)',
          'Financial summary (optional)'
        ],
        optionalAddOns: ['Full financial model (Excel)', 'Cap table, dilution planning', 'Pitch coaching and dry-run review call'],
        documentsRequired: [
          'Basic startup info (founders, domain, stage)',
          'Business summary (if available)',
          'Traction metrics / sales data (if any)',
          'Product walkthrough or screenshots',
          'Any existing pitch drafts',
          'Investment ask (amount + use of funds)'
        ],
        howItWorks: [
          'Book your free pitch consultation',
          'Share your details through a structured form',
          'We draft the storyline + visual deck',
          'You review and give feedback',
          'Final version delivered in PDF & PPT'
        ],
        timeline: '5–7 working days',
        whyChooseUs: [
          'Decks accepted by top VCs, angels & accelerators',
          'Built by analysts + storytellers + designers',
          'Clean, minimal design with powerful content',
          'Bundled with valuation, financial model & projections',
          'Pitch readiness calls available'
        ],
        faqs: [
          {
            question: 'Will my deck be ready for investors?',
            answer: 'Yes — we follow investor-accepted structure and metrics.'
          },
          {
            question: 'Can you help with pitch delivery?',
            answer: 'Yes, pitch coaching is available as an add-on.'
          },
          {
            question: 'Can I get only content or only design?',
            answer: 'Yes — we offer modular pricing.'
          },
          {
            question: 'Will you use my old deck as a reference?',
            answer: 'Absolutely. We’ll build or enhance based on what you already have.'
          },
          {
            question: 'Can I update this deck in the future myself?',
            answer: 'Yes — we give you editable formats (PowerPoint or Google Slides).'
          }
        ],
        relatedServices: [
          'Financial Modelling',
          'Business Valuation',
          'Virtual CFO',
          'Fundraising Advisory',
          'Investor Matchmaking (Optional)'
        ],
        stickyFooterCta: {
          text: 'Your story deserves a deck that makes investors lean in — let’s build it together.',
          buttons: [
            { label: 'Get My Pitch Deck', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Deck Strategist', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Startup Details', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      valuation: {
        heroSection: {
          title: 'Know What Your Business is Really Worth',
          subtitle: 'Get a clear, CA-certified business valuation for fundraising, M&A, buy-sell agreements, or strategic planning.',
          ctas: [
            { label: 'Get My Business Valued', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Financials / Pitch Deck', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Valuation Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Valuation via DCF, VC, Asset-Based Methods', icon: 'CalculateOutlined', size: 20 },
            { text: 'CA-Certified Reports', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'Ideal for Fundraising, Buyouts, Investor Exits', icon: 'EmojiObjectsOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You’re raising equity or negotiating with investors',
          'You’re exiting, selling, or onboarding a co-founder',
          'You need valuation for regulatory/tax/reporting purposes (Income Tax, FEMA, RBI)',
          'You want to know your fair market value before funding or debt'
        ],
        pricing: {
          title: 'Professional Valuation Packages',
          plans: [
            { name: 'Startup Valuation', bestFor: 'Fundraising, VC negotiations', price: '₹14,999' },
            { name: 'Buy-Sell / Exit', bestFor: 'Co-founder exit / business sale', price: '₹19,999' },
            { name: 'Certified Valuation Report', bestFor: 'Legal, tax, or compliance use', price: '₹24,999+' }
          ],
          note: '*Includes valuation report + summary deck. Discounts for bundled services (model, pitch deck, etc.)'
        },
        whatsIncluded: [
          'Kick-off consultation with CA/Valuation Analyst',
          'Choice of valuation methods (DCF, VC, Net Asset, Comparative, etc.)',
          'Future projection-based modelling (if available)',
          'Peer benchmarking and industry multiples',
          'Sensitivity/scenario analysis',
          'Valuation summary + detailed report',
          'CA certification (if needed for regulatory purposes)'
        ],
        documentsRequired: [
          'Last 2–3 years financials (P&L, BS, cash flow)',
          'Current year performance or management estimate',
          'Cap table (for startups)',
          'Details of business model, team, IP (if any)',
          'Pitch deck (if fundraising)',
          'Business registration documents'
        ],
        howItWorks: [
          'Book a free discovery call or place an order',
          'Upload financials, business model & inputs',
          'We evaluate and apply suitable valuation methods',
          'Deliver a clean, CA-reviewed valuation report',
          'Walkthrough call with our expert (optional)'
        ],
        timeline: '7–12 Working Days',
        whyChooseUs: [
          '500+ valuations completed across 15+ sectors',
          'Valuation reports accepted by VCs, angels, and regulators',
          'Deep financial + industry analysis included',
          'Certified CA-backed reports for legal use',
          'Bundle-friendly: combine with model, deck, or due diligence'
        ],
        faqs: [
          {
            question: 'What method will you use to value my company?',
            answer: 'We choose between DCF, VC Method, Net Asset, or Comparative based on business stage & objective.'
          },
          {
            question: 'Will this be a CA-certified report?',
            answer: 'Yes, if required for Income Tax, FEMA, or RBI.'
          },
          {
            question: 'What if I don’t have full financials?',
            answer: 'We can work with estimates or help you build projections.'
          },
          {
            question: 'Is this valid for investor discussions?',
            answer: 'Absolutely — we create both report and investor summary.'
          },
          {
            question: 'Will you help me explain this to my co-founders/investors?',
            answer: 'Yes, we include a walkthrough call.'
          }
        ],
        relatedServices: [
          'Financial Modelling',
          'Investor Pitch Deck',
          'Startup India Registration',
          'Virtual CFO',
          'Fundraising Advisory'
        ],
        stickyFooterCta: {
          text: "Whether you're raising funds or planning your next move — know your worth with a professional valuation report.",
          buttons: [
            { label: 'Get My Valuation Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Book a Free Discovery Call', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Financials', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'due-diligence': {
        heroSection: {
          title: 'Build Investor-Ready Financial Models that Actually Make Sense',
          subtitle:
            'Revenue forecasts, cost structures, profitability, cash flow — turned into a dynamic Excel model tailored to your startup or business.',
          ctas: [
            { label: 'Request Financial Model', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Business Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Book Free Discovery Call', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Ideal for Fundraising, Strategic Planning, Internal Decision-Making', icon: 'TrendingUpOutlined', size: 20 },
            { text: '3 to 5 Year Forecasting', icon: 'TimelineOutlined', size: 20 },
            { text: 'Built by CA + Analyst Team', icon: 'GroupsOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You’re raising funding and need a solid 3–5 year projection',
          'You need a model to support your investor pitch deck',
          'You want clarity on business viability and breakeven',
          'You’re applying for a loan or line of credit',
          'You want to simulate pricing, cost, or unit economics changes'
        ],
        pricing: {
          title: 'Plans Based on Business Stage and Complexity',
          plans: [
            { name: 'Startup Basic Model', bestFor: 'Revenue, cost, net margin projections', price: '₹7,999' },
            { name: 'Investor-Grade Model', bestFor: 'Fully dynamic with drivers + scenarios', price: '₹14,999' },
            { name: 'Custom Enterprise Model', bestFor: 'Multi-segment or multi-country', price: 'Custom Quote' }
          ],
          note: '*All models delivered in Excel with dynamic sheets, formulas, and scenario toggles'
        },
        whatsIncluded: [
          'Revenue model (unit-based or pricing-based)',
          'Cost structure (fixed, variable, semi-variable)',
          'Manpower planning, hiring cost logic',
          'EBITDA & PAT calculation',
          '3–5 year cash flow, balance sheet, and P&L',
          'Scenario/sensitivity analysis (growth rate, burn, pricing)',
          'CapEx and depreciation schedule',
          'Funding requirement & use of funds tracker',
          'Output dashboard with graphs & investor summary',
          'Add-ons: Valuation (DCF, VC method), Fundraising deck, Cap table and dilution simulation'
        ],
        documentsRequired: [
          'Business model overview (deck or summary)',
          'Revenue channels and pricing model',
          'Fixed & variable cost structure',
          'Hiring plan',
          'Existing financials (if any)',
          'Target growth rate / use case'
        ],
        howItWorks: [
          'Book a free discovery call or place order',
          'Share your business inputs (we guide you)',
          'We build a custom Excel-based model with review checkpoints',
          'Final delivery + walkthrough with our finance expert'
        ],
        timeline: '5–10 working days',
        whyChooseUs: [
          'Built by CAs and analysts who’ve worked on 500+ models',
          'Models used by real investors, VCs, banks, and accelerators',
          'Industry-specific logic and accurate assumptions',
          'Clean format with editable assumptions and summary view',
          'Optional support for investor meetings'
        ],
        faqs: [
          {
            question: 'Is the model editable?',
            answer: 'Yes — you get a fully unlocked Excel version.'
          },
          {
            question: 'Can I request changes later?',
            answer: 'Yes, one round of changes is included. More can be added at nominal cost.'
          },
          {
            question: 'Will you help me fill in missing numbers?',
            answer: 'Yes — we support with benchmarking and estimates if data is incomplete.'
          },
          {
            question: 'Can I get only revenue modelling done?',
            answer: 'Yes, partial model requests are welcome.'
          },
          {
            question: 'Will you explain the model once it’s delivered?',
            answer: 'Absolutely — we include a walkthrough call.'
          }
        ],
        relatedServices: [
          'Business Valuation',
          'Investor Pitch Deck',
          'Virtual CFO',
          'Due Diligence Support',
          'Fundraising Strategy & Advisory'
        ],
        stickyFooterCta: {
          text: 'Forecast your growth with a financial model that speaks your business language — and your investor’s too.',
          buttons: [
            { label: 'Get My Financial Model', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Financial Analyst', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Business Plan', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'internal-audit': {
        heroSection: {
          title: 'Go Beyond Compliance — Uncover Risk, Strengthen Controls',
          subtitle:
            'Our Internal Audit services give you clarity, confidence, and control over your operations, processes, and finances. Tailored for startups, SMEs, and growing enterprises.',
          ctas: [
            { label: 'Book Internal Audit Consultation', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Company Info', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to an Audit Specialist', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Risk-Based & Process-Driven', icon: 'SearchOutlined', size: 20 },
            { text: 'Led by Chartered Accountants', icon: 'SchoolOutlined', size: 20 },
            { text: 'Audit Reports Accepted by Banks, Investors, Boards', icon: 'VerifiedOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You’re scaling fast and want to avoid financial blindspots',
          'You need strong financial/process controls for funding, loans, or board reporting',
          'You have multiple branches, verticals, or vendors',
          'You want independent review of your books, workflows, and internal controls',
          'You’re preparing for external/statutory audits or due diligence'
        ],
        pricing: {
          title: 'Structured by Scope, Not Just Size',
          plans: [
            { name: 'Basic Internal Audit', bestFor: '1-location, standard review', price: '₹14,999 onwards' },
            { name: 'Branch/Process Audit', bestFor: 'Multi-unit/departmental audit', price: '₹24,999 onwards' },
            { name: 'Full-Scope Audit', bestFor: 'VC/Investor-ready with risk ratings', price: 'Custom Quote' }
          ],
          note: '*Includes audit plan, execution, report + debrief session. Custom checklists included.'
        },
        whatsIncluded: [
          'Business risk assessment & scope finalization',
          'Review of accounting, billing, and expense processes',
          'Evaluation of internal controls & process gaps',
          'Audit of GST, TDS, payroll, vendor payouts',
          'Inventory, procurement, and cash handling reviews (if applicable)',
          'Surprise checks and control testing',
          'Identification of control weaknesses + corrective action',
          'Independent, detailed audit report with observations & grading',
          'Optional: Follow-up audit / re-audit for corrective action verification',
          'Optional: Integration with internal SOP or ERP audit trails'
        ],
        documentsRequired: [
          'Financial statements & books (past 12–24 months)',
          'Sales, purchase, and expense data',
          'Vendor & employee payouts list',
          'Access to accounting system / ERP',
          'GST & TDS filings + challans',
          'Internal SOPs or control docs (if available)'
        ],
        howItWorks: [
          'Book your audit scope consultation',
          'Share documents + system access',
          'Audit team prepares audit plan + timelines',
          'Execution of checks + red flag identification',
          'Report delivery + action recommendations',
          '(Optional) Post-audit support or re-audit'
        ],
        timeline: '7–15 Working Days based on complexity',
        whyChooseUs: [
          'Audit by senior CA-led team with Big 4 experience',
          'Risk-based, not checkbox-based approach',
          'Actionable reports, not just observations',
          'Used by startups, enterprises, and NGOs alike',
          'Option to train your internal team post-audit'
        ],
        faqs: [
          {
            question: 'Is this the same as statutory audit?',
            answer: 'No — internal audit is management-focused and internal, not regulatory.'
          },
          {
            question: 'Can you customize audit scope for my sector?',
            answer: 'Yes — we build custom checklists based on your industry.'
          },
          {
            question: 'Is this useful for VC-funded startups?',
            answer: 'Absolutely — it builds investor trust and supports compliance readiness.'
          },
          {
            question: 'What if you find major red flags?',
            answer: 'We’ll help fix them or guide your team toward corrective action.'
          },
          {
            question: 'Can this replace in-house audit staff?',
            answer: 'Yes, especially for early-stage or mid-sized companies without internal teams.'
          }
        ],
        relatedServices: [
          'Statutory Audit Assistance',
          'Bookkeeping & Reconciliation',
          'Fix My Books',
          'GST + Payroll Compliance Check',
          'Virtual CFO'
        ],
        stickyFooterCta: {
          text: 'An internal audit isn’t just a check — it’s a strategic investment in your company’s integrity and growth.',
          buttons: [
            { label: 'Start My Internal Audit', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a CA Now', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Company Info', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'working-capital': {
        heroSection: {
          title: 'Improve Cash Flow. Free Up Capital. Grow Sustainably.',
          subtitle:
            'Expert-driven working capital strategies to optimize receivables, payables, and inventory cycles — all without new funding.',
          ctas: [
            { label: 'Book a Free Working Capital Review', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Business Financials', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Finance Strategist', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Cash Flow Optimization', icon: 'AttachMoneyOutlined', size: 20 },
            { text: 'Receivables, Payables, Inventory Strategy', icon: 'AssessmentOutlined', size: 20 },
            { text: 'Advisory + Reporting Support', icon: 'SupportAgentOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Businesses with delayed customer payments or high receivables',
          'Founders facing cash crunch despite decent revenue',
          'Companies with heavy vendor cycles or long inventory holding periods',
          'Businesses trying to avoid short-term borrowing or high working capital interest costs',
          'SMEs looking to streamline operations before scaling or raising debt'
        ],
        pricing: {
          title: 'Affordable Expert-Led Optimization',
          plans: [
            { name: 'One-Time Review', bestFor: '1-month analysis + report', price: '₹4,999' },
            { name: 'Ongoing Monthly Advisory', bestFor: 'Review + tracking + alerts', price: '₹2,999/month' },
            { name: 'Custom Plan', bestFor: 'Multi-branch, high inventory businesses', price: 'Custom Quote' }
          ],
          note: '*Includes ratio analysis, actionable report, and strategic inputs. Can be bundled with CFO or MIS services.'
        },
        whatsIncluded: [
          'Analysis of cash conversion cycle (CCC)',
          'Debtor & creditor ageing analysis',
          'Inventory days & reorder benchmarking',
          'Working capital forecasting',
          'Receivable follow-up strategy',
          'Vendor payment cycle restructuring',
          'Dynamic dashboard (Excel/Google Sheet)',
          'Advisory to unlock tied-up funds'
        ],
        optionalAddOns: [
          'Fundraising consultation (OD/CC/Invoice Discounting)',
          'Bank/investor-ready cash flow packs',
          'Monthly performance monitoring'
        ],
        documentsRequired: [
          'Balance Sheet & P&L (past 2 years)',
          'Current asset & liability breakup',
          'Debtors and creditors list with ageing',
          'Inventory data (if applicable)',
          'Bank statements (last 6 months)',
          'Sales & purchase cycle details'
        ],
        howItWorks: [
          'Book a review and upload financials',
          'We evaluate key working capital drivers',
          'Deliver a customized report with problem areas + solutions',
          '(Optional) Start ongoing tracking + optimization calls'
        ],
        timeline: '5–7 Working Days for one-time report. Ongoing support monthly.',
        whyChooseUs: [
          'Proven frameworks used by CFOs & private equity firms',
          'Strategic, not generic — tailored to your business cycles',
          'Works seamlessly with our MIS, CFO, accounting stack',
          'Unlock internal cash without raising new funding',
          'Monthly tracking available with alerts and variance reports'
        ],
        faqs: [
          {
            question: 'Can this reduce my need for OD/short-term loans?',
            answer: 'Yes — that’s the goal. We help you optimize internal resources first.'
          },
          {
            question: 'What if my receivables are very old?',
            answer: 'We can help build a follow-up + write-off strategy.'
          },
          {
            question: 'Is this only for product-based companies?',
            answer: 'No — it works for service businesses too (long invoice cycles, project delays, etc.).'
          },
          {
            question: 'Will I get a report and dashboard?',
            answer: 'Yes, our deliverable includes an Excel-based actionable working capital report.'
          },
          {
            question: 'Can you help raise working capital funding too?',
            answer: 'Yes — we offer advisory for OD, invoice discounting, and fund-based limits.'
          }
        ],
        relatedServices: [
          'Virtual CFO Services',
          'MIS & Analytics',
          'Invoice Management',
          'Fundraising Support (OD/Invoice Financing)',
          'Accounting & Cash Flow Reporting'
        ],
        stickyFooterCta: {
          text: 'Free up capital stuck in operations — improve your working capital cycle with expert help.',
          buttons: [
            { label: 'Optimize My Working Capital', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Strategist', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Financial Docs', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      }
    }
  },
  payroll: {
    title: 'Payroll Services',
    pages: {
      'payroll-processing': {
        heroSection: {
          title: 'Streamline Your Payroll — Accurate, Compliant, On Time',
          subtitle:
            'From payslip generation to TDS, EPF, ESI, PT filings — we handle your entire payroll process so you can focus on growing your business.',
          ctas: [
            { label: 'Get Payroll Support', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Employee Data', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Payroll Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Salary Processing + Statutory Compliance', icon: 'GroupsOutlined', size: 20 },
            { text: 'Payslips, TDS, EPF, ESI, PT', icon: 'ReceiptLongOutlined', size: 20 },
            { text: 'CA/HR-Verified Payroll Runs', icon: 'CheckCircleOutlineOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'SMEs, startups, and agencies with growing teams',
          'Businesses looking for compliant, headache-free payroll',
          'Companies struggling with EPF, ESI, and PT return deadlines',
          'Founders who want payslips, TDS, and HR policies aligned',
          'Multi-branch or remote employee management'
        ],
        pricing: {
          title: 'Monthly Plans Based on Employee Count',
          plans: [
            { name: 'Starter Plan', bestFor: 'Up to 10 employees', price: '₹999/month' },
            { name: 'Growth Plan', bestFor: '11–50 employees', price: '₹2,499/month' },
            { name: 'Enterprise Plan', bestFor: '51+ employees or custom', price: 'Custom Quote' }
          ],
          note: '*Includes salary processing, payslips, TDS, EPF, ESI, and PT filings. Add-ons billed separately.'
        },
        whatsIncluded: [
          'Monthly salary computation & payroll register',
          'Payslip generation + distribution (PDF/Email)',
          'TDS deduction + Form 16/16AA support',
          'EPF, ESI, PT return filing & challan generation',
          'Bank file preparation for salary transfers',
          'Leave/attendance integration (optional)',
          'HR policy and compliance support (offer letters, exit docs, etc.)'
        ],
        optionalAddOns: [
          'Payroll software setup (Zoho, GreytHR, etc.)',
          'Bonus/gratuity calculations',
          'Employee reimbursement processing'
        ],
        documentsRequired: [
          'Employee master file (name, PAN, Aadhaar, address, bank details)',
          'Salary structure (fixed + variable components)',
          'Attendance/leave summary (if applicable)',
          'Company PAN, TAN, EPF, ESI, and PT registration numbers',
          'Excel template or HRMS system integration available'
        ],
        howItWorks: [
          'Select plan and upload employee & salary data',
          'We compute monthly payroll with taxes & deductions',
          'Generate payslips and bank payment file',
          'File EPF, ESI, PT, and TDS returns',
          'Provide Form 16/12BA at year-end'
        ],
        timeline: 'Monthly cycle. Reports delivered within 2–3 working days post data submission.',
        whyChooseUs: [
          'Payroll managed by CA-backed team',
          'Compliant with all statutory rules (EPF, ESI, PT, TDS)',
          'Confidential, accurate, and timely processing',
          'Payslip + salary proof support for loans, visa, etc.',
          'Integrates with accounting, GST, TDS, VCFO'
        ],
        faqs: [
          {
            question: 'Do you handle EPF, ESI, and PT filings too?',
            answer: 'Yes, that’s part of our core payroll offering.'
          },
          {
            question: 'Can you integrate with our HRMS or ERP?',
            answer: 'Yes — we support Excel-based and API-based workflows.'
          },
          {
            question: 'Will employees get payslips directly?',
            answer: 'Yes — via email or shared folder.'
          },
          {
            question: 'Do I need payroll software for this?',
            answer: 'Not required. We can run payroll without software.'
          },
          {
            question: 'Can you help with Form 16 at year-end?',
            answer: 'Absolutely — we provide complete TDS documentation.'
          }
        ],
        relatedServices: [
          'EPF & ESI Registration',
          'PT Registration & Filing',
          'TDS Return Filing',
          'Virtual CFO',
          'HR & Labour Compliance'
        ],
        stickyFooterCta: {
          text: 'Make payroll stress-free — accurate salaries, on-time compliance, and happy employees every month.',
          buttons: [
            { label: 'Start Payroll Processing', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Payroll Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Employee Data', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'salary-structuring': {
        heroSection: {
          title: 'Structure Salaries That Maximize Take-Home & Minimize Tax',
          subtitle:
            'We help you create tax-optimized, compliant, and flexible salary structures for employees across levels — without complexity.',
          ctas: [
            { label: 'Request Salary Structuring Help', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload CTC Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Compensation Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'CTC Breakdown & Take-Home Optimization', icon: 'MonetizationOnOutlined', size: 20 },
            { text: 'EPF, ESI, TDS, PT Compliant', icon: 'GavelOutlined', size: 20 },
            { text: 'Aligned with Startup + MSME Payrolls', icon: 'BusinessCenterOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Startups onboarding employees for the first time',
          'SMEs formalizing or revising their pay structures',
          'Companies setting up payroll + compliance together',
          'Employers preparing salary offers or revisions',
          'HR teams building offer letter templates'
        ],
        pricing: {
          title: 'Affordable Structuring Plans',
          plans: [
            { name: 'Per Employee', bestFor: 'Single salary structuring', price: '₹299/person' },
            { name: 'Up to 10 Employees', bestFor: 'One-time setup', price: '₹1,999' },
            { name: 'Custom Bulk Plan', bestFor: '11+ employees or HR team', price: 'Custom Quote' }
          ],
          note: '*Includes tax optimization, breakups, and HR-ready templates'
        },
        whatsIncluded: [
          'CTC to net salary breakdown',
          'Component-wise structuring: Basic, HRA, LTA, Bonus, etc.',
          'Tax-saving additions: 80C, 80D, NPS, food, conveyance, etc.',
          'EPF, ESI, PT deduction logic',
          'Payslip + offer letter template (if opted)',
          'TDS + Advance Tax forecasting (optional)',
          'Optional: Year-round TDS tracking',
          'Optional: Integration with payroll or HRMS',
          'Optional: Salary revision & comparison matrix'
        ],
        documentsRequired: [
          'Name, CTC amount, location of employee',
          'Designation & grade (if structured by level)',
          'Bonus/incentive policy (if applicable)',
          'Employer tax & PF/ESI/PT preferences',
          'Salary history (if restructuring existing pay)',
          'HR template or secure form available for uploads'
        ],
        howItWorks: [
          'Share your CTCs or salary plan',
          'We analyze tax + compliance impact',
          'Draft optimal salary breakup for each employee',
          'Share HR-ready template with notes',
          'Optional: upload into payroll software'
        ],
        timeline: '1–2 Working Days (per employee group)',
        whyChooseUs: [
          'Structuring done by payroll + tax experts',
          '100% compliant with EPF, ESI, PT & TDS rules',
          'Helps reduce tax burden for both employer & employee',
          'Offer letter & payslip ready structures',
          'Works with any payroll or HRMS'
        ],
        faqs: [
          {
            question: 'Can this help reduce my employees’ tax liability?',
            answer: 'Yes — we include multiple tax-efficient allowances.'
          },
          {
            question: 'Is this only for new hires?',
            answer: 'No — we also revise or rework existing salaries.'
          },
          {
            question: 'Will this affect my EPF, ESI, or PT filings?',
            answer: 'No — we align structuring with all statutory compliance.'
          },
          {
            question: 'Can I use this to standardize bands/levels?',
            answer: 'Yes — we support grade-wise and vertical-wise structuring.'
          },
          {
            question: 'Will this integrate with my payroll tool?',
            answer: 'Yes — final output can be used directly in Zoho, GreytHR, Tally, etc.'
          }
        ],
        relatedServices: ['Payroll Processing', 'EPF & ESI Registration', 'Advance Tax Planning', 'Offer Letter Templates', 'Virtual CFO'],
        stickyFooterCta: {
          text: 'Pay smart, stay compliant — build salary structures that make everyone happier.',
          buttons: [
            { label: 'Get Salary Structures Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to an Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload CTCs', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'employee-itr-filing': {
        heroSection: {
          title: 'Help Your Team File ITRs — Accurate, Fast & Hassle-Free',
          subtitle:
            'Offer value-added tax support to your employees. We handle their income tax returns, exemptions, deductions, and more — so they can stay focused and stress-free.',
          ctas: [
            { label: 'Offer ITR Filing for My Team', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Employee List or Connect with HR', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Tax Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Salaried Individuals / PAN India', icon: 'PersonOutlined', size: 20 },
            { text: 'Expert Tax Filing with Guidance', icon: 'PsychologyOutlined', size: 20 },
            { text: 'Employer-Branded or White-Label Option', icon: 'VerifiedUserOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Companies that want to offer ITR filing as a benefit',
          'Startups looking to support financial wellness',
          'HR teams planning employee engagement campaigns',
          'Employers with distributed or remote teams',
          'Payroll teams wanting smoother Form 16 reconciliation'
        ],
        pricing: {
          title: 'Simple Per-Employee Plans',
          plans: [
            { name: 'Basic ITR Filing', bestFor: 'Salaried employees (ITR-1/ITR-2)', price: '₹499/person' },
            { name: 'Advanced ITR', bestFor: 'With capital gains, rental income, etc.', price: '₹999/person' },
            { name: 'Bulk Company Offer', bestFor: '10+ employees — includes dashboard, summary', price: 'Custom Quote' }
          ],
          note: '*Includes ITR filing + Form 16 analysis + expert call (if needed)'
        },
        whatsIncluded: [
          'Review of Form 16 + income proofs',
          'Tax computation + deductions (80C, 80D, HRA, LTA, etc.)',
          'Filing ITR on income tax portal',
          'Downloadable ITR-V acknowledgement',
          'Email/WhatsApp delivery + support',
          'Optional 1:1 tax advisory call for employees',
          'Company HR report (filing status, employee-wise summary)',
          'Optional branded tax help portal for your company',
          'FAQ + tax education webinar for employees'
        ],
        documentsRequired: [
          'Form 16 (mandatory)',
          'PAN & Aadhaar',
          'Investment proofs (80C/80D/etc.)',
          'Rental receipts / HRA claim documents (if applicable)',
          'Capital gains statement (for advanced filings)',
          'Excel/Zip upload or individual logins supported'
        ],
        howItWorks: [
          'HR shares employee list or invites employees to tax portal',
          'Employees upload Form 16 & basic info',
          'Our CAs process filings & confirm status',
          'Reports delivered to both employee & HR (optional)',
          'Year-end summary shared with HR (if opted)'
        ],
        timeline: '2–3 working days (per employee). Bulk processing within 7 days.',
        whyChooseUs: [
          'Trusted by 100+ companies to support employee tax filing',
          'Dedicated CA support — no chatbots',
          'Optional webinar + live support during peak season',
          'Fast turnaround and white-label options for HR/brand',
          'Helps improve retention + financial wellness'
        ],
        faqs: [
          {
            question: 'Is this only for salaried employees?',
            answer: 'Mainly yes, but we also handle directors, consultants, and ESOP holders.'
          },
          {
            question: 'Will employees get tax-saving tips too?',
            answer: 'Yes — optional advisory included or can be added.'
          },
          {
            question: 'Can we brand this service for our company?',
            answer: 'Yes — we offer co-branded and white-label portals.'
          },
          {
            question: 'Can employees do this even after leaving the company?',
            answer: 'Yes — just share Form 16 and basic info.'
          },
          {
            question: 'Will you help HR track status?',
            answer: 'Yes — HR gets a dashboard or email summary report.'
          }
        ],
        relatedServices: [
          'Payroll Processing',
          'Form 16 Generation & TDS Returns',
          'Tax Planning Advisory',
          'Advance Tax Calculation',
          'Financial Wellness Workshops'
        ],
        stickyFooterCta: {
          text: 'Empower your team with financial peace — offer them expert-backed ITR filing this season.',
          buttons: [
            { label: 'Launch ITR Help for Employees', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Tax Team', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Form 16 Files', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'epf-esi-registration': {
        heroSection: {
          title: 'Stay Statutory Compliant with EPF & ESI Registration and Filings',
          subtitle: 'We help you register, file returns, and manage contributions under EPFO and ESIC — accurately and on time.',
          ctas: [
            { label: 'Register for EPF/ESI Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Company & Employee Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Compliance Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Government Portal Filing', icon: 'GavelOutlined', size: 20 },
            { text: 'CA/HR-Verified Submissions', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'Monthly Return Compliance', icon: 'CalendarMonthOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Companies with 20 or more employees (EPF)',
          'Companies with 10 or more employees earning ₹21,000/month or less (ESI)',
          'Startups hiring their first batch of full-time employees',
          'Businesses participating in tenders or vendor empanelment',
          'MSMEs/contractors needing compliance documentation'
        ],
        pricing: {
          title: 'Transparent Plans for Registration + Monthly Filings',
          plans: [
            { name: 'EPF/ESI Registration', bestFor: 'One-time setup on EPFO/ESIC portals', price: '₹2,499 each' },
            { name: 'Monthly Filing Plan', bestFor: 'Up to 20 employees (EPF & ESI)', price: '₹1,499/month' },
            { name: 'Extended Filing Plan', bestFor: 'More than 20 employees', price: 'Custom Quote' }
          ],
          note: '*Includes return filing, challan prep, and support. Employee grievances handled as add-on.'
        },
        whatsIncluded: [
          'EPF registration on Shram Suvidha Portal',
          'ESI registration with ESIC office',
          'Generation of establishment code, login credentials',
          'Certificate of registration for both departments',
          'EPF & ESI challan computation and generation',
          'Online submission of monthly returns',
          'UAN generation & linking (for EPF)',
          'ESI IP number management',
          'Salary/wage structure review for deduction alignment',
          'Compliance calendar + filing alerts',
          'Optional: Employee grievance support, Exit/Transfer/Withdrawal assistance, Bonus/Gratuity calculations'
        ],
        documentsRequired: [
          'PAN & CIN of company',
          'Certificate of incorporation',
          'Address proof',
          'Digital signature of director/partner',
          'Employee list with DOJ, PAN, Aadhaar, salary',
          'Bank account details',
          'Monthly payroll sheet',
          'Attendance or leave summary (if applicable)',
          'Salary structure file'
        ],
        howItWorks: [
          'Choose registration or monthly filing support',
          'Upload required documents',
          'We handle end-to-end setup or filing',
          'Monthly returns filed on time with challans',
          'Get confirmation + audit-proof documents'
        ],
        timeline: 'Registration: 3–5 Working Days; Monthly Filing: Within 3 working days of salary finalization',
        whyChooseUs: [
          'Experience across 10+ states and 100+ businesses',
          'CA-backed review of all filings',
          'On-time return submission every month',
          'Fully digitized process with client dashboard',
          'Year-end compliance pack available (Form 3A, 6A, etc.)'
        ],
        faqs: [
          { question: 'Can I voluntarily register under EPF/ESI?', answer: 'Yes — even before you hit the employee threshold.' },
          { question: 'What happens if I delay filing?', answer: 'Penalties + interest apply. We ensure you never miss a deadline.' },
          { question: 'Will you help with UAN/ESIC login issues?', answer: 'Yes — full support on employee onboarding + exit.' },
          { question: 'Are these filings required even for NIL months?', answer: 'Yes, NIL returns are mandatory too.' },
          { question: 'Can I track submissions?', answer: 'Yes — we provide proof of submission and live status.' }
        ],
        relatedServices: [
          'Payroll Processing',
          'Professional Tax Compliance',
          'Bonus & Gratuity Advisory',
          'Virtual CFO',
          'HR Onboarding Kit & Policy Drafting'
        ],
        stickyFooterCta: {
          text: 'Be payroll-compliant and worry-free — let us manage your EPF & ESI from start to finish.',
          buttons: [
            { label: 'Register for EPF/ESI', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Compliance Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Business Details', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'pt-registration': {
        heroSection: {
          title: 'Stay Compliant with State-Wise Professional Tax (PT) Rules',
          subtitle:
            'We handle PT registration, monthly/annual return filings, and challans across all applicable Indian states — seamlessly and on time.',
          ctas: [
            { label: 'Register for PT Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Business & Employee Details', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a PT Compliance Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'State-wise PT Registration', icon: 'GavelOutlined', size: 20 },
            { text: 'Monthly, Quarterly, Annual Filing', icon: 'ReceiptLongOutlined', size: 20 },
            { text: 'HR + Payroll Integration Ready', icon: 'GroupOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Businesses employing salaried individuals in Maharashtra, Karnataka, Telangana, West Bengal, Tamil Nadu, etc.',
          'GST, EPF, ESI registered companies or firms employing >5 people (varies statewise)',
          'Startups, contractors, LLPs, companies, proprietorships, shops needing labour law compliance',
          'Businesses wanting to avoid penalties during labour inspections'
        ],
        pricing: {
          title: 'Registration + Monthly/Annual Filing Plans',
          plans: [
            { name: 'PT Registration', bestFor: 'One-time PT registration (state-wise)', price: '₹999/state' },
            { name: 'Monthly/Annual Filing', bestFor: 'Up to 20 employees', price: '₹999/month or ₹2,999/year' },
            { name: 'Multi-State/PTIN Filing', bestFor: 'Pan-India operations', price: 'Custom Quote' }
          ],
          note: '*Includes challan preparation, return filing, and acknowledgement. Govt. fee extra.'
        },
        whatsIncluded: [
          'PT registration on applicable state portal',
          'Monthly, quarterly or annual return filing (as per rules)',
          'PT payment challan generation and assistance',
          'Employee salary slab mapping and deductions',
          'Support for PTIN (Professional Tax Identification Number)',
          'Acknowledgement receipts for audit or compliance tracking',
          'Optional: Employee-wise PT deduction register and PT integration in payroll software'
        ],
        documentsRequired: [
          'PAN, GST, CIN of the business',
          'Office/branch address proof (rent agreement/EB bill)',
          'Identity proof of employer/director/partner',
          'Employee list with salaries and DOJ',
          'Digital signature (DSC) if mandated for online filing'
        ],
        howItWorks: [
          'Choose registration or filing service',
          'Upload business and employee data',
          'We complete state-wise PT registration or filing',
          'Payment challans generated (if applicable)',
          'Compliance filing done + acknowledgment shared'
        ],
        timeline: 'Registration: 3–5 working days | Filing: Within 3 working days of payroll',
        whyChooseUs: [
          'All major states covered with PT rules compliance',
          'Deadline tracking to avoid late penalties',
          'Works with our payroll, EPF & ESI services',
          'CA-reviewed compliance filings',
          'Single dashboard view for multi-state filings'
        ],
        faqs: [
          {
            question: 'Is PT mandatory in all states?',
            answer: 'No. It’s mandatory in 15+ states and metro cities. We advise based on your location.'
          },
          {
            question: 'Can I file PT returns quarterly or annually?',
            answer: 'Depends on the respective state rules. We manage filing accordingly.'
          },
          {
            question: 'Is PT linked to GST or Income Tax?',
            answer: 'No. Professional Tax is a separate state-level labour tax.'
          },
          {
            question: 'What if I miss PT filing deadlines?',
            answer: 'Interest and penalties apply. Some states even blacklist non-compliant businesses.'
          },
          {
            question: 'Will you manage challan payments?',
            answer: 'Yes — we calculate, generate, and assist in challan payment every filing cycle.'
          }
        ],
        relatedServices: ['Payroll Processing', 'EPF & ESI Filings', 'Labour License & Trade License', 'TDS Return Filing', 'Virtual CFO'],
        stickyFooterCta: {
          text: 'Avoid PT penalties and stay payroll-compliant — let us handle your Professional Tax end-to-end.',
          buttons: [
            { label: 'Register for PT Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Compliance Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Business Details', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'employee-insurance': {
        heroSection: {
          title: 'Offer Health & Life Insurance That Shows You Care',
          subtitle:
            'We help you set up and manage group insurance plans for your employees — health, term life, personal accident, and more — with expert support and zero complexity.',
          ctas: [
            { label: 'Set Up Employee Insurance', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Company & Employee Data', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Benefits Specialist', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Health, Life, Accident, Maternity', icon: 'FavoriteBorderOutlined', size: 20 },
            { text: 'Group Plans for Startups & SMEs', icon: 'BusinessOutlined', size: 20 },
            { text: 'IRDAI-Approved Partners', icon: 'VerifiedUserOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          "You're building a people-first culture",
          "You're hiring talent and want competitive benefits",
          'You want to retain employees with long-term perks',
          "You're looking for tax-deductible employee welfare expenses",
          "You're mandated under client/vendor agreements"
        ],
        pricing: {
          title: 'Customizable Group Plans at Competitive Rates',
          plans: [
            {
              name: 'Group Health (Mediclaim)',
              bestFor: 'Hospitalization + maternity',
              price: '₹450–₹900/employee/month'
            },
            {
              name: 'Group Term Life',
              bestFor: '24/7 death coverage',
              price: '₹99–₹199/employee/month'
            },
            {
              name: 'Group Accident',
              bestFor: 'Disability + accidental death',
              price: '₹50–₹150/employee/month'
            }
          ],
          note: '*Pricing depends on age, sum insured, company size & plan type. No hidden charges.'
        },
        whatsIncluded: [
          'Plan selection from multiple insurers (Bajaj, ICICI, HDFC, etc.)',
          'Premium negotiation & setup with IRDAI-licensed advisor',
          'Custom employee coverage (maternity, parents, top-ups, etc.)',
          'Employee onboarding & e-cards',
          'Claims assistance & documentation support',
          'Annual renewals + exit support',
          'Optional White-labeled insurance helpdesk',
          'Wellness add-ons (telemedicine, health checkups)',
          'HRMS integration for claim status tracking'
        ],
        documentsRequired: [
          'Company PAN, incorporation proof',
          'Employee master data (name, age, salary, email, mobile)',
          'Existing insurance data (if migrating)',
          'Custom coverage preferences (if any)'
        ],
        howItWorks: [
          'Book a discovery call with our benefits expert',
          'Share your team size and preferences',
          'Get quotes from 3+ insurers with plan comparisons',
          'Select a plan, initiate employee onboarding',
          'Policy issued + coverage live + support on demand'
        ],
        timeline: '5–10 Working Days',
        whyChooseUs: [
          'IRDAI-certified advisor network',
          'Multiple insurers + zero commission bias',
          'End-to-end policy + claim lifecycle support',
          'Optional integration with payroll, HRMS, or CFO tools',
          'Great for startups, SMEs, and remote teams'
        ],
        faqs: [
          {
            question: 'Can I offer this to a team smaller than 10?',
            answer: 'Yes — we support micro teams with startup-friendly plans.'
          },
          {
            question: 'Is this tax-deductible for the company?',
            answer: 'Yes — under employee welfare expense head.'
          },
          {
            question: 'Do employees get individual policy access?',
            answer: 'Yes — digital e-cards, WhatsApp claim support & portal access.'
          },
          {
            question: 'Can I include maternity or top-up cover?',
            answer: 'Yes — you can customize plans.'
          },
          {
            question: 'Do you help with claims too?',
            answer: 'Yes — we act as your support arm for employee queries & claims.'
          }
        ],
        relatedServices: ['Payroll Processing', 'Employee ITR Help', 'ESIC Registration', 'HR Onboarding Kits', 'Virtual CFO Services'],
        stickyFooterCta: {
          text: 'Offer benefits your employees actually value — set up group insurance the smart, easy, compliant way.',
          buttons: [
            { label: 'Start Employee Insurance Setup', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Benefits Advisor', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Company & Employee Data', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      }
    }
  },
  gst: {
    title: 'GST',
    pages: {
      registration: {
        heroSection: {
          title: 'Get Your GST Registration Done in 2–5 Days',
          subtitle: 'Completely online, CA-assisted GST registration for businesses, professionals, and startups.',
          ctas: [
            { label: 'Register for GST Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Schedule Free Consultation', icon: 'PhoneOutlined', size: 24 },
            { label: 'Download Document Checklist', icon: 'CloudDownloadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Govt. Approved Process', icon: 'GavelOutlined', size: 20 },
            { text: 'All States Covered', icon: 'PublicOutlined', size: 20 },
            { text: 'Assisted by Chartered Accountants', icon: 'VerifiedUserOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Turnover exceeds ₹40 lakh (₹20 lakh for services)',
          'Engaged in interstate sales',
          'E-commerce seller or aggregator',
          'Exporters and Importers',
          'Liable for reverse charge mechanism',
          'Want to claim input tax credit'
        ],
        pricing: {
          title: 'Transparent Pricing — No Hidden Charges',
          plans: [
            { name: 'Standard', bestFor: 'Registration with expert support', price: '₹999' },
            { name: 'Premium', bestFor: 'Registration + LUT Filing + Advisory', price: '₹1,999' }
          ],
          note: '*Registration is free from GST Dept. Prices include professional charges.'
        },
        whatsIncluded: [
          'Eligibility consultation with CA',
          'Document collection & review',
          'Preparation of application (GST REG-01)',
          'Filing on GST portal',
          'ARN generation',
          'Follow-up for clarification (if any)',
          'Final GSTIN allotment',
          'Post-registration advisory'
        ],
        documentsRequired: [
          'PAN card of proprietor/entity',
          'Aadhaar card',
          'Passport size photo',
          'Address proof (electricity/water bill)',
          'Bank statement / Cancelled cheque',
          'COI, MOA/AOA (for companies/LLPs)',
          'Board resolution / Authorization letter',
          'DSC (for companies)'
        ],
        howItWorks: [
          'Fill basic details & make payment',
          'Upload required documents',
          'Expert CA reviews & prepares application',
          'Filing on GST portal & ARN generation',
          'Verification & clarification (if needed)',
          'Receive GSTIN & login credentials'
        ],
        timeline: '2–5 working days',
        whyChooseUs: [
          '100% Online, Hassle-Free Process',
          'Verified CA Support from Start to Finish',
          'Multi-State Registration Available',
          'Quick Turnaround & Dedicated Manager',
          'Post-Registration Filing & Advisory Support'
        ],
        faqs: [
          {
            question: 'Is GST registration free?',
            answer: 'Yes, the government does not charge any fee. Professional fees apply for CA-assisted filing.'
          },
          {
            question: 'What is ARN?',
            answer: 'Application Reference Number generated after successful submission.'
          },
          {
            question: 'Can I register with a rented office?',
            answer: 'Yes, with a Rent Agreement and NOC from the owner.'
          },
          {
            question: 'Do I need a DSC?',
            answer: 'Only for companies and LLPs.'
          },
          {
            question: 'How long is the GSTIN valid?',
            answer: 'Until cancellation — no expiry if compliance is maintained.'
          }
        ],
        relatedServices: [
          'GST Return Filing (Monthly/Quarterly)',
          'LUT Filing',
          'GST Cancellation/Revocation',
          'Bookkeeping & Accounting',
          'GST Notice Handling'
        ],
        stickyFooterCta: {
          text: 'Get your GST Number in just a few days with expert CA guidance and full support.',
          buttons: [
            { label: 'Apply for GST', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to an Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Download Checklist', icon: 'CloudDownloadOutlined', size: 24 }
          ]
        }
      },
      'return-filing': {
        heroSection: {
          title: 'Timely & Accurate GST Return Filing for Your Business',
          subtitle: 'Avoid penalties and stay compliant — CA-assisted monthly/quarterly GST return filing for businesses of all sizes.',
          ctas: [
            { label: 'File My GST Return', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Book Consultation', icon: 'PhoneOutlined', size: 24 },
            { label: 'Explore Plans', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Timely Filing Guarantee', icon: 'TimerOutlined', size: 20 },
            { text: 'Input Tax Credit Maximization', icon: 'SavingsOutlined', size: 20 },
            { text: 'Real-time GST Reports', icon: 'ShowChartOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You have an active GSTIN (regular taxpayer)',
          'You are involved in interstate supply or e-commerce',
          'You want to claim Input Tax Credit',
          'Your turnover exceeds the composition scheme limit'
        ],
        pricing: {
          title: 'Monthly or Quarterly Plans to Suit Your Business Volume',
          plans: [
            { name: 'Basic', bestFor: 'Up to 50 transactions', price: '₹499/month' },
            { name: 'Standard', bestFor: '51–200 transactions', price: '₹999/month' },
            { name: 'Premium', bestFor: '201+ transactions', price: 'Custom Quote' },
            { name: 'Annual Filing', bestFor: 'GSTR-9 Filing (Optional)', price: '₹1,999/year' }
          ],
          note: '*Includes GSTR-1, GSTR-3B, advisory, reconciliation summary. Prices exclusive of add-ons or penalty handling.'
        },
        whatsIncluded: [
          'Monthly or Quarterly GSTR-1 Filing (Outward Supply)',
          'GSTR-3B Filing (Summary Return with Tax Payment)',
          'Auto-download of GSTR-2A/2B from GST Portal',
          'Input Tax Credit (ITC) Reconciliation',
          'GST Payment Challan Creation',
          'Filing Confirmation & ARN Receipt',
          'Filing of NIL Returns (if no activity)',
          'Reminders & Follow-up by Account Manager'
        ],
        optionalAddOns: ['GSTR-9 (Annual Return)', 'GSTR-9C (Reconciliation Statement)', 'Interest & Late Fee Calculation'],
        documentsRequired: [
          'Sales Invoices (B2B & B2C)',
          'Purchase Invoices',
          'Credit/Debit Notes',
          'E-way Bills (if applicable)',
          'GST Portal Login Credentials',
          'Bank Statement (for verification if needed)'
        ],
        howItWorks: [
          'Select monthly or quarterly plan',
          'Share sales & purchase data or provide software access',
          'We reconcile your data with GSTR-2A/2B',
          'Prepare returns & confirm tax liability',
          'Make GST payment & file returns',
          'Receive filing confirmation (ARN)'
        ],
        timeline: '1–2 working days from receiving complete data',
        whyChooseUs: [
          'Chartered Accountant-verified filings',
          'ITC Optimization to reduce tax outflow',
          'Timely filing reminders via WhatsApp/SMS',
          'Real-time reconciliation reports',
          'Year-round compliance with optional GSTR-9 support'
        ],
        faqs: [
          {
            question: 'Which returns are applicable to me?',
            answer: 'Our CA team will help you understand your applicable returns (1, 3B, 9, etc.).'
          },
          {
            question: 'What happens if I miss a return filing?',
            answer: 'You may incur penalties and interest. We assist with late filing as well.'
          },
          {
            question: 'Do I need to file NIL returns?',
            answer: 'Yes, even if there’s no turnover, you must file NIL returns to stay compliant.'
          },
          {
            question: 'Can I claim missed ITC from previous months?',
            answer: 'Yes, within allowed limits — we help with tracking and claiming eligible ITC.'
          },
          {
            question: 'Do you file returns using my billing software?',
            answer: 'Yes, we can integrate or accept data from Tally, Zoho, Excel, etc.'
          }
        ],
        relatedServices: ['GST Registration', 'GST Refund Application', 'GST Notice Handling', 'Bookkeeping & Accounting', 'Virtual CFO'],
        stickyFooterCta: {
          text: 'Stay compliant and claim your ITC with timely GST filings by our expert CA team.',
          buttons: [
            { label: 'Start Filing Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a GST Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'View Plans', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'notice-management': {
        heroSection: {
          title: 'Respond to GST Notices with Confidence',
          subtitle: 'Got a notice from the GST department? Our experts will review, prepare, and file a proper response on your behalf.',
          ctas: [
            { label: 'Upload GST Notice', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Book Expert Consultation', icon: 'PhoneOutlined', size: 24 },
            { label: 'Know Your Response Deadline', icon: 'EventOutlined', size: 24 }
          ],
          badges: [
            { text: 'Managed by CAs & Tax Lawyers', icon: 'ShieldOutlined', size: 20 },
            { text: 'Timely Filing & Follow-up', icon: 'AccessTimeOutlined', size: 20 },
            { text: 'Covers SCNs, Mismatches, Audit Notices', icon: 'GavelOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Received Show Cause Notice (SCN)',
          'Mismatch between GSTR-1 and GSTR-3B',
          'Mismatch between GSTR-3B and GSTR-2A/2B',
          'Non-filing or NIL return compliance notice',
          'Audit-based demand notice',
          'IGST Refund query'
        ],
        pricing: {
          title: 'Affordable & Urgent Response Plans',
          plans: [
            { name: 'Basic Compliance Notice', bestFor: 'Mismatch, late filing, NIL return', price: '₹1,499' },
            { name: 'SCN or Demand Notice', bestFor: 'Legal Drafting + Portal Filing', price: '₹2,999 – ₹4,999' },
            { name: 'Refund-related Notices', bestFor: 'Clarification on RFD, mismatch, BRC, shipping', price: '₹1,999' }
          ],
          note: '*Includes notice analysis, drafting, filing response & follow-up. Complex cases may attract additional fees (pre-informed).'
        },
        whatsIncluded: [
          'Review of notice and annexures',
          'Evaluation of GST return history & reconciliation',
          'Preparation of a detailed professional response',
          'Drafting legal explanations / justifications',
          'Filing response on GST portal',
          'Clarification support if further queries raised',
          'Call or email assistance from tax expert'
        ],
        documentsRequired: [
          'Copy of GST Notice (PDF or Screenshot)',
          'Filed GSTR-1, 3B, 2A/2B data (for the relevant period)',
          'Sales and Purchase Register',
          'Payment Challans / Refund Files (if applicable)',
          'LUT / Export documents (for export-related notices)',
          'GST portal login credentials (optional)'
        ],
        howItWorks: [
          'Upload your notice or book a consultation',
          'Get call from GST expert for preliminary review',
          'Submit relevant data/documents',
          'Response is drafted, reviewed, and filed',
          'Get response acknowledgment / confirmation',
          'Follow-up handling if required'
        ],
        timeline: '2–5 working days (Urgent option available)',
        whyChooseUs: [
          'Managed by experienced CAs & legal tax professionals',
          'Precise, clear, and compliant responses',
          'On-time portal submission with proof',
          'Advice on correcting root cause (e.g., filing errors)',
          'Post-response monitoring included'
        ],
        faqs: [
          {
            question: 'What happens if I ignore a GST notice?',
            answer: 'Penalties, interest, blocking of ITC, or cancellation of GSTIN may follow.'
          },
          {
            question: 'Can I reply to a GST notice on my own?',
            answer: 'Yes, but legal drafting and technical accuracy is critical — we recommend expert handling.'
          },
          {
            question: 'Can you help if I’ve missed filing returns?',
            answer: 'Yes, we’ll help you file pending returns and then respond to the notice.'
          },
          {
            question: 'Will the officer accept my reply instantly?',
            answer: 'They may raise follow-up queries — we assist with clarifications.'
          },
          {
            question: 'Can you help me avoid such notices in future?',
            answer: 'Yes, with return monitoring, reconciliations, and advisory.'
          }
        ],
        relatedServices: [
          'GST Return Filing',
          'GSTR-2A/2B Reconciliation',
          'GST Refund Assistance',
          'Accounting & Compliance Advisory',
          'Virtual CFO'
        ],
        stickyFooterCta: {
          text: 'Don’t ignore a GST notice — let our experts handle it and safeguard your GSTIN.',
          buttons: [
            { label: 'Upload Notice & Get Help', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to GST Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Learn More About GST Notices', icon: 'InfoOutlined', size: 24 }
          ]
        }
      },
      'cancellation-revocation': {
        heroSection: {
          title: 'Cancel or Revoke Your GST Registration Seamlessly',
          subtitle: 'End-to-end support for voluntary cancellation, surrender, or revocation of cancelled GSTIN.',
          ctas: [
            { label: 'Cancel My GSTIN', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Revoke My Cancelled GST', icon: 'ReplayCircleFilledOutlined', size: 24 },
            { label: 'Schedule Free Consultation', icon: 'CalendarTodayOutlined', size: 24 }
          ],
          badges: [
            { text: 'CA-Verified Process', icon: 'VerifiedUserOutlined', size: 20 },
            { text: 'MCA & GST Portal Experts', icon: 'AccountBalanceOutlined', size: 20 },
            { text: 'Fast Turnaround', icon: 'TimerOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Business is closed or no longer operational',
          'GST registration was obtained but not used',
          'Change in business structure or PAN',
          'Turnover now under threshold limit',
          'Revocation if GST was cancelled due to non-filing or non-compliance'
        ],
        pricing: {
          title: 'Clear Pricing, Fast Resolution',
          plans: [
            { name: 'Voluntary Cancellation', bestFor: 'Business closure, PAN change, or unused GSTIN', price: '₹999' },
            { name: 'Revocation of GSTIN', bestFor: 'Reviving cancelled GST due to non-compliance', price: '₹1,499' }
          ],
          note: '*Price includes professional charges. Govt fee is ₹0.'
        },
        whatsIncluded: [
          'Consultation on eligibility for cancellation',
          'Preparation and filing of Form GST REG-16 (for cancellation)',
          'Guidance on filing Final Return (GSTR-10)',
          'Review and filing Form REG-21 for Revocation',
          'Drafting justification letter for revocation',
          'Submission tracking and updates',
          'Clarification support for GST officer queries'
        ],
        documentsRequired: [
          'GST login credentials',
          'Reason for cancellation',
          'Final invoices/stock details (if applicable)',
          'PAN and Aadhaar (optional)',
          'Cancellation order copy (for revocation)',
          'Proof of return filings (for revocation)',
          'Authorized signatory documents'
        ],
        howItWorks: [
          'Choose Cancellation or Revocation option',
          'Submit basic details and make payment securely',
          'Upload required documents',
          'We prepare and file application',
          'We liaise for clarification if GST officer raises queries',
          'Get cancellation acknowledgment or revived GSTIN'
        ],
        timeline: '3–7 working days (subject to document readiness)',
        whyChooseUs: [
          'Handled entirely by CA experts',
          'Drafting assistance for revocation justifications',
          'Support for clarifications raised by GST officers',
          'Track your application 24x7',
          'Free consultation included'
        ],
        faqs: [
          {
            question: 'Can I cancel GST if I’ve never used it?',
            answer: 'Yes, voluntary cancellation is allowed for unused GST registrations.'
          },
          {
            question: 'Can I cancel GST without filing returns?',
            answer: 'No. You must file the Final Return (GSTR-10) before cancellation.'
          },
          {
            question: 'What if my GST was cancelled for non-filing?',
            answer: 'We assist you with pending return filing and revocation process.'
          },
          {
            question: 'Is there a time limit for revocation?',
            answer: 'Yes, you must apply within 30 days from the cancellation order (can be extended).'
          },
          {
            question: 'Will I get a new GSTIN after revocation?',
            answer: 'No. Your old GSTIN will be reactivated after successful revocation.'
          }
        ],
        relatedServices: [
          'GST Return Filing',
          'GST Notice Handling',
          'GSTR-10 Final Return Filing',
          'Accounting Support',
          'Startup Advisory'
        ],
        stickyFooterCta: {
          text: 'Shut it down or bring it back — we’ll handle your GSTIN cancellation or revival with full compliance.',
          buttons: [
            { label: 'Cancel GST Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Apply for Revocation', icon: 'ReplayCircleFilledOutlined', size: 24 },
            { label: 'Talk to a GST Expert', icon: 'PhoneOutlined', size: 24 }
          ]
        }
      },
      refund: {
        heroSection: {
          title: 'Claim Your GST Refunds Smoothly & Quickly',
          subtitle:
            'Expert-handled GST refund filing for exporters, inverted duty cases, and excess tax paid. Maximize your refund — minimize follow-up hassles.',
          ctas: [
            { label: 'Apply for GST Refund', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Book a Free Consultation', icon: 'PhoneOutlined', size: 24 },
            { label: 'Download Checklist', icon: 'CloudUploadOutlined', size: 24 }
          ],
          badges: [
            { text: 'Refunds for Exporters, ITC, Excess Tax', icon: 'CurrencyRupeeOutlined', size: 20 },
            { text: 'End-to-End Filing & Follow-up', icon: 'TimerOutlined', size: 20 },
            { text: 'CA-Assisted Process', icon: 'VerifiedUserOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You export goods/services without paying IGST (under LUT)',
          'You pay IGST on exports and claim refund',
          'You have accumulated ITC due to inverted duty structure',
          'You have paid excess GST by mistake',
          'You have unutilized balance in Electronic Cash Ledger'
        ],
        pricing: {
          title: 'Transparent & Tailored Pricing',
          plans: [
            { name: 'Export Without IGST (LUT Route)', price: '₹2,499 – ₹4,999' },
            { name: 'Export With IGST (Shipping Bill)', price: '₹1,499' },
            { name: 'Inverted Duty ITC Refund', price: '₹3,999' },
            { name: 'Excess GST Paid / Wrong Head', price: '₹1,999' },
            { name: 'Electronic Cash Ledger Refund', price: '₹999' }
          ],
          note: '*Final price may vary based on state, data volume & complexity. Includes expert review, documentation, online filing & tracking.'
        },
        whatsIncluded: [
          'CA consultation & eligibility assessment',
          'Preparation of refund application (Form RFD-01)',
          'Preparation of supporting documentation',
          'Export Invoices / Shipping Bills',
          'GSTR-3B & GSTR-1 returns',
          'Reconciliation sheets',
          'Statement 3 & Annexures',
          'Filing refund on GST portal',
          'Application tracking & communication with GST officer',
          'Support with clarifications & deficiency memos',
          'Receipt of refund in bank account'
        ],
        documentsRequired: [
          'Export Invoices',
          'LUT Acknowledgment (if filed under LUT)',
          'GSTR-1, GSTR-3B for refund period',
          'Shipping Bills & EGM copy',
          'Bank Realization Certificates (FIRC/BRC)',
          'Electronic Credit Ledger extract',
          'Purchase & Sale Invoice Summary',
          'Product HSN mapping',
          'GSTR-2A/2B reconciliation',
          'Tax rate matrix',
          'Excess GST payment proof',
          'Challans, payment receipts',
          'Bank details'
        ],
        howItWorks: [
          'Choose refund type and submit basic info',
          'Upload documents or connect books',
          'CA reviews data and prepares refund file',
          'Filing of RFD-01 with digital sign',
          'Liaison for clarification/deficiency memo',
          'Refund processed and credited to account'
        ],
        timeline: '15–45 working days depending on refund type & officer response',
        whyChooseUs: [
          'Specialized in Refund Filings Across India',
          '100% CA-Verified Process',
          'Timely follow-up with GST officers',
          'Response to deficiency memos included',
          'Refund tracker & alerts'
        ],
        faqs: [
          {
            question: 'How long does it take to get a GST refund?',
            answer: 'Typically 15–45 working days depending on the refund type and completeness of documents.'
          },
          {
            question: 'Do I need a LUT for refund without IGST?',
            answer: 'Yes, you must file LUT to claim refund without paying IGST on exports.'
          },
          {
            question: 'Is refund available for services too?',
            answer: 'Yes, both goods and services exporters are eligible.'
          },
          {
            question: 'Can I file refund manually?',
            answer: 'All GST refunds must be filed online through the GST portal.'
          },
          {
            question: 'What happens if refund is rejected?',
            answer: 'We help you refile or escalate with additional clarification.'
          }
        ],
        relatedServices: [
          'LUT Filing',
          'GST Return Filing',
          'Export Documentation Assistance',
          'Bookkeeping & Accounting',
          'Virtual CFO Services'
        ],
        stickyFooterCta: {
          text: 'Let our experts get your GST refund filed the right way — fast, error-free, and fully compliant.',
          buttons: [
            { label: 'Apply for Refund Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to GST Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Download Document List', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      'lut-filing': {
        heroSection: {
          title: 'File Your LUT Under GST — Quick & Easy',
          subtitle: 'Export without paying IGST — Let our experts handle your Letter of Undertaking (LUT) filing online.',
          ctas: [
            { label: 'File LUT Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to an Export Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Download LUT Checklist', icon: 'CloudDownloadOutlined', size: 24 }
          ],
          badges: [
            { text: 'For Exporters & SEZ Units', icon: 'PublicOutlined', size: 20 },
            { text: 'Valid for One Financial Year', icon: 'EventAvailableOutlined', size: 20 },
            { text: 'Handled by Qualified CAs', icon: 'GavelOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Exporter of goods or services',
          'Want to export without paying IGST',
          'Supplying to SEZ units',
          'Avoiding working capital blockage from IGST refunds',
          'No prosecution for tax evasion > ₹2.5 crore in last 5 years'
        ],
        pricing: {
          title: 'Affordable Expert Filing',
          plans: [
            { name: 'LUT Filing', bestFor: 'End-to-end filing with expert handling', price: '₹999' },
            { name: 'LUT + Advisory', bestFor: 'Filing + GST Export Refund Advisory', price: '₹1,999' }
          ],
          note: '*Includes preparation, filing, acknowledgment download, and one-time advisory.'
        },
        whatsIncluded: [
          'Consultation on LUT eligibility',
          'Preparation of LUT declaration form',
          'Upload on GST portal (Form RFD-11)',
          'Submission of supporting documents',
          'Digital signing (DSC or EVC)',
          'Download of filed LUT acknowledgment',
          'Reminder for renewal before next FY'
        ],
        documentsRequired: [
          'GST Login Credentials',
          'PAN and Aadhaar of Authorized Signatory',
          'IEC Certificate (if available)',
          'Letterhead Declaration (we provide draft)',
          'Last year’s LUT (if renewal)',
          'Authorized Signatory’s DSC (if company/LLP)'
        ],
        howItWorks: [
          'Book service & upload documents',
          'We review and prepare the application',
          'File LUT on GST portal (RFD-11)',
          'Digital sign & submit',
          'Get filed acknowledgment within 24–48 hours'
        ],
        timeline: '1–2 Working Days',
        whyChooseUs: [
          'Expert-reviewed LUT filings',
          'Faster turnaround with digital support',
          'Document templates provided',
          'Valid for full financial year',
          'Email/WhatsApp reminders for annual renewal'
        ],
        faqs: [
          {
            question: 'What is LUT?',
            answer:
              'LUT (Letter of Undertaking) is a declaration for GST-registered exporters to export goods/services without paying IGST.'
          },
          {
            question: 'Is LUT mandatory for all exports?',
            answer: 'Yes, unless you are ready to pay IGST and claim refund.'
          },
          {
            question: 'Is LUT filing a one-time process?',
            answer: 'No, it must be filed every financial year.'
          },
          {
            question: 'What if I forget to file LUT?',
            answer: "You'll need to pay IGST on exports, then claim refund — which takes time."
          },
          {
            question: 'Do I need a DSC for filing?',
            answer: 'Only for companies or LLPs. Proprietors can use OTP/EVC.'
          }
        ],
        relatedServices: [
          'GST Export Refund Filing',
          'GST Registration',
          'GST Return Filing',
          'Accounting & Bookkeeping',
          'Virtual CFO Services'
        ],
        stickyFooterCta: {
          text: 'Don’t let taxes block your exports — file your LUT now and export tax-free.',
          buttons: [
            { label: 'File LUT Today', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to Our Expert', icon: 'PhoneOutlined', size: 24 },
            { label: 'Download Checklist', icon: 'CloudDownloadOutlined', size: 24 }
          ]
        }
      }
    }
  },
  wealth: {
    title: 'Fund & Wealth',
    pages: {
      loan: {
        heroSection: {
          title: 'Get the Right Loan for the Right Reason — with Zero Guesswork',
          subtitle:
            'Whether it’s a business loan, working capital, OD/CC, personal loan, or loan against property — we match you with the right lender, paperwork, and strategy.',
          ctas: [
            { label: 'Get Loan Advisory Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Basic Financials', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Loan Expert', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Business, Personal, Property Loans', icon: 'BusinessCenterOutlined', size: 20 },
            { text: 'OD/CC, Term Loans, Project Finance', icon: 'CreditScoreOutlined', size: 20 },
            { text: '50+ Banks, NBFCs, Fintechs', icon: 'AccountBalanceOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'SMEs and startups exploring loan options for growth or cash flow',
          'Founders confused between OD, CC, term loan, or invoice discounting',
          'Businesses seeking secured/unsecured loans with better rates',
          'Individuals seeking personal loans or loan against property (LAP)',
          'Anyone looking to structure debt smartly, not desperately'
        ],
        pricing: {
          title: "Pay Nothing Until You're Matched or Sanctioned",
          plans: [
            { name: 'Loan Strategy Call', bestFor: '20-min call + eligibility mapping', price: '₹499' },
            { name: 'Documentation Support', bestFor: 'File-ready application pack', price: '₹1,999 onwards' },
            { name: 'End-to-End Advisory', bestFor: 'Matching + docs + lender coordination', price: 'Success-Based' }
          ],
          note: '*Basic advisory free for CFO/Accounting clients. Bank charges separate.'
        },
        whatsIncluded: [
          'Eligibility check + product matching',
          'Understanding your use case and suggesting right loan type',
          'Preparation of financial documents, projections, ratios',
          'Customizable CMA data, DSCR, and banking analysis',
          'Application packaging for bank/NBFC/fintech',
          'Direct lender coordination + follow-ups',
          'Term sheet/NOC/closure advisory'
        ],
        documentsRequired: [
          'PAN, Aadhaar, and business registration documents',
          'Last 2–3 years ITR and financial statements',
          'GST returns (if applicable)',
          'Bank statements (6–12 months)',
          'Property documents (for LAP)',
          'Projections / CMA (if needed)'
        ],
        howItWorks: [
          'Share loan requirement + financials',
          'We assess eligibility and recommend best loan types',
          'Prepare documents and application file',
          'Connect you to 2–3 best matched lenders',
          'Assist through sanction, documentation, and disbursal'
        ],
        timeline: '2–10 Working Days (depending on product/lender)',
        whyChooseUs: [
          'We work for you — not the bank',
          'CA-led documentation with lender-friendly formats',
          'Network of 50+ lenders, NBFCs, fintechs',
          'End-to-end handholding till funds are in',
          'Loan review and restructuring also available'
        ],
        faqs: [
          {
            question: 'Will I be charged even if my loan isn’t sanctioned?',
            answer: 'No. Our advisory is free until matched or file is submitted.'
          },
          {
            question: 'Can you help me choose between OD, CC, and term loan?',
            answer: 'Yes — we analyze use case and match accordingly.'
          },
          {
            question: 'Can you also help improve my credit eligibility?',
            answer: 'Yes — we offer credit health review and lender-fit analysis.'
          },
          {
            question: 'Do you also offer loans directly?',
            answer: 'No — we advise, package, and connect you to authorized lenders.'
          },
          {
            question: 'What if I already have a bank in mind?',
            answer: 'We’ll still improve your file and coordinate directly.'
          }
        ],
        relatedServices: [
          'CMA Data & Financial Projections',
          'Virtual CFO',
          'Business Valuation',
          'Loan Restructuring Advisory',
          'FHI Score (Financial Health Index)'
        ],
        stickyFooterCta: {
          text: 'The right loan can fuel your growth — the wrong one can choke it. Let’s get you the right fit, the right way.',
          buttons: [
            { label: 'Get My Loan Strategy', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Loan Advisor', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Financials', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      investments: {
        heroSection: {
          title: 'Invest Smarter — With Expert-Backed Advice, Not Random Tips',
          subtitle:
            'Whether you’re a first-time investor or building a long-term portfolio, we guide you with research-backed, goal-based investment planning.',
          ctas: [
            { label: 'Start My Investment Plan', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Share My Financial Goals', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a SEBI-Registered Advisor', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Mutual Funds, Bonds, NPS, ETFs', icon: 'TrendingUpOutlined', size: 20 },
            { text: 'SIP, Lumpsum, Portfolio Reviews', icon: 'AssessmentOutlined', size: 20 },
            { text: 'SEBI & AMFI-Compliant Advice', icon: 'VerifiedOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'First-time investors starting SIPs or mutual funds',
          'Professionals planning for retirement, home, education',
          'Founders/SMEs with surplus cash to invest',
          'Investors moving from insurance/ULIP to market plans',
          'Anyone confused by random tips or agent advice'
        ],
        pricing: {
          title: 'Transparent Advisory, No Hidden Commissions',
          plans: [
            { name: 'Goal-Based Planning', bestFor: 'Single goal advisory (retirement, travel, education)', price: '₹999/goal' },
            { name: 'Portfolio Review & Fix', bestFor: 'Audit of your current investments', price: '₹1,499' },
            { name: 'Full-Fledged Advisory', bestFor: 'Multi-goal, year-round plan', price: '₹4,999/year' }
          ],
          note: '*No sales, no commissions — just unbiased advisory. Execution support available separately.'
        },
        whatsIncluded: [
          'Risk profiling & asset allocation',
          'Fund/ETF selection based on goals',
          'SIP & lumpsum planning',
          'Tax optimization & withdrawal strategy',
          'Portfolio review and rebalancing',
          'Access to monthly reports (optional)'
        ],
        documentsRequired: [
          'PAN Card & Basic KYC (if onboarding needed)',
          'Risk profile questionnaire (shared by us)',
          'Existing investment summary',
          'Financial goals: amount, timeline, preferences'
        ],
        howItWorks: [
          'Fill investment goals form or book call',
          'We analyze your profile and investments',
          'Create personalized investment strategy',
          'Suggest top funds and platforms',
          'Guide you for execution and review yearly'
        ],
        timeline: '2–5 working days for full strategy report',
        whyChooseUs: [
          'SEBI-registered & AMFI-certified advisors',
          'Zero commission, 100% fee-only model',
          'Goal-first, not product-first advisory',
          'Tax-efficient planning strategies',
          'Perfect for beginners and experienced investors'
        ],
        faqs: [
          {
            question: 'Can you help me choose the best mutual fund?',
            answer: 'Absolutely — based on your goals and risk profile, not commissions.'
          },
          {
            question: 'Do you sell mutual funds directly?',
            answer: 'No, we only advise — you invest via platforms directly for transparency.'
          },
          {
            question: 'Why not just follow YouTube advice?',
            answer: 'Because we provide customized, SEBI-compliant, expert-reviewed advice.'
          },
          {
            question: 'Will you rebalance my SIPs?',
            answer: 'Yes — portfolio review and rebalancing is included.'
          },
          {
            question: 'Do you help me with investments after advice?',
            answer: 'Yes — we guide where and how to invest after you approve the plan.'
          }
        ],
        relatedServices: [
          'Tax Planning Advisory (80C, 80D, etc.)',
          'Retirement & Goal Planning',
          'Insurance Advisory',
          'Virtual CFO Services',
          'Financial Health Score Analysis (FHI)'
        ],
        stickyFooterCta: {
          text: 'Don’t follow random trends — invest with confidence through personalized, expert advice.',
          buttons: [
            { label: 'Start My Investment Plan', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Certified Advisor', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Financial Goals', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      insurance: {
        heroSection: {
          title: 'Protect What Matters Most — With the Right Insurance, Not Just Any Insurance',
          subtitle:
            'Health, life, term, property, or business insurance — we help you choose the right policy with IRDAI-approved partners and expert-led analysis.',
          ctas: [
            { label: 'Get My Insurance Plan Reviewed', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Current Policy or Requirements', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to an Insurance Advisor', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Term, Health, Group, Property, Cyber', icon: 'ShieldOutlined', size: 20 },
            { text: 'Business + Personal Advisory', icon: 'BusinessOutlined', size: 20 },
            { text: 'IRDAI-Certified Partners', icon: 'VerifiedOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Individuals/families confused between term vs endowment vs ULIP',
          'Startups and companies buying group health or term plans',
          'Professionals with limited time and high risk exposure',
          'First-time buyers looking for clarity, not hard sales',
          'Businesses looking for asset protection (property, fire, E&O, etc.)'
        ],
        pricing: {
          title: 'Flat Fee for Unbiased Advisory — Not Sales',
          plans: [
            { name: 'Individual Insurance Review', bestFor: 'Health, life, or term plan audit', price: '₹499' },
            { name: 'Family / Group Plan Setup', bestFor: 'Comparison + onboarding (5+ lives)', price: '₹1,499 onwards' },
            { name: 'Business / Asset Insurance', bestFor: 'Property, liability, cyber, office coverage', price: 'Custom Quote' }
          ],
          note: '*We don’t sell policies. We help you choose, compare & buy better. IRDAI advisor included.'
        },
        whatsIncluded: [
          'One-on-one consultation (Zoom/Call)',
          'Risk profiling + needs-based coverage analysis',
          'Comparison across 5+ insurers',
          'Breakdown of inclusions, exclusions, waiting periods, riders',
          'Advisory on tax benefits (80C, 80D, etc.)',
          'Final policy selection support',
          'Optional hand-holding for claim support or renewal tracking'
        ],
        typesOfInsuranceCovered: [
          'Term Insurance',
          'Health Insurance (Individual, Family, Top-up)',
          'Group Insurance (SMEs)',
          'Motor Insurance',
          'Property / Fire Insurance',
          'Cyber & Professional Liability'
        ],
        documentsRequired: [
          'Existing policy copy (if available)',
          'Age, gender, lifestyle, income info (for term/health)',
          'Business registration, location, assets (for business)',
          'Group employee list (for corporate/group cover)'
        ],
        howItWorks: [
          'Book your consultation or upload existing plans',
          'We assess your goals, risks & policy gaps',
          'Shortlist best-fit insurers & plan types',
          'Assist with policy purchase, e-KYC, and onboarding',
          'Stay in touch for renewals, add-ons, and claims'
        ],
        timeline: '1–3 Days for review + comparison. Same-day if urgent.',
        whyChooseUs: [
          'No commission bias — we’re on your side',
          'Certified insurance advisors + financial planners',
          'Policy support even post-purchase',
          'SME and startup group plan experts',
          'Tax-optimized advisory with wealth planning included'
        ],
        faqs: [
          {
            question: 'Are you an insurance company?',
            answer: 'No — we are advisory partners who help you choose right. Policies are issued by IRDAI-approved insurers.'
          },
          {
            question: 'Can you help me claim on my existing policy?',
            answer: 'Yes — we offer optional claim assistance.'
          },
          {
            question: 'What is your commission model?',
            answer: 'We offer flat-fee, unbiased advice. Any incentives go towards advisory benefits.'
          },
          {
            question: 'Do you help with top-ups or renewals?',
            answer: 'Yes — both new and existing policies.'
          },
          {
            question: 'Is this service only for health/life?',
            answer: 'No — we also cover cyber, motor, liability, property, travel, and group plans.'
          }
        ],
        relatedServices: [
          'Employee Insurance (Group Health/Term)',
          'Tax Planning & Deductions (80C/80D)',
          'Virtual CFO',
          'Financial Health Score (FHI)',
          'Wealth Advisory & Investments'
        ],
        stickyFooterCta: {
          text: 'Don’t buy insurance blindly — protect what matters with expert-backed advice and the best plans for your needs.',
          buttons: [
            { label: 'Get My Policy Reviewed', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Certified Advisor', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Existing Policy or Info', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      retirement: {
        heroSection: {
          title: 'Plan Your Retirement. Save on Taxes. Sleep Better.',
          subtitle:
            "Whether you're 28 or 58 — it's never too early (or late) to plan your retirement. We build tax-saving, goal-based plans that secure your future while saving money today.",
          ctas: [
            { label: 'Start Retirement Planning', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Share My Income & Goals', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Tax + Investment Advisor', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: '80C, 80CCD, 80D, LTCG Strategies', icon: 'ReceiptOutlined', size: 20 },
            { text: 'NPS, PPF, ELSS, Retirement Corpus Planning', icon: 'SavingsOutlined', size: 20 },
            { text: 'Works for Salaried + Business Owners', icon: 'BusinessCenterOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          "You're paying tax but not sure how to save more",
          'You want to build a retirement corpus but don’t know how much you need',
          'You want to compare ELSS vs NPS vs ULIP vs FD',
          'You’re confused about 80C/80D deductions and don’t want to miss out',
          "You're approaching 40s or 50s and want to speed up planning"
        ],
        pricing: {
          title: 'Affordable, One-Time or Ongoing Planning',
          plans: [
            { name: 'Basic Tax Saving Plan', bestFor: '80C + 80D structure & proof checklist', price: '₹499' },
            { name: 'Retirement Goal Plan', bestFor: 'Corpus target + fund planning', price: '₹999' },
            { name: 'Full Plan (Tax + Retirement)', bestFor: 'Combo + projections + tracker', price: '₹1,499' }
          ],
          note: '*Includes consultation, plan PDF, tax-saving summary, investment roadmap'
        },
        whatsIncluded: [
          'Review of current income, deductions, savings, and goals',
          'Calculation of retirement corpus (based on inflation, timeline, lifestyle)',
          'Tax-saving structure using 80C, 80D, 80CCD(1B), etc.',
          'Fund selection (ELSS, NPS, PPF, FDs, Bonds, etc.)',
          'SIP/Lumpsum mapping to goals',
          'Downloadable PDF report with strategy and timelines',
          'Optional: 1:1 call to tweak or clarify the plan'
        ],
        documentsRequired: [
          'PAN & age',
          'Monthly income & expenses',
          'Existing investments (PPF, EPF, MF, etc.)',
          'Insurance and tax deduction details',
          'Retirement age goal & desired monthly pension'
        ],
        howItWorks: [
          'Fill quick info form or upload existing documents',
          'We review current status and goals',
          'Build a plan that balances tax savings + retirement growth',
          'Deliver report with options, timelines, and investment routes'
        ],
        timeline: '2–3 Working Days',
        whyChooseUs: [
          'Built by CAs + Certified Financial Planners',
          'Plans that balance short-term tax savings with long-term growth',
          'Independent of commission — unbiased advisory',
          'Works for first-time planners and seasoned investors',
          'No jargon. Just actionable guidance.'
        ],
        faqs: [
          {
            question: 'Is this only for salaried people?',
            answer: 'No — it works for professionals, freelancers, and business owners too.'
          },
          {
            question: 'Will you tell me where to invest for tax saving?',
            answer: 'Yes — we help you choose the best options based on your profile.'
          },
          {
            question: 'Can I do this in March to save last-minute tax?',
            answer: "Yes — but it's better to plan in advance. We support both."
          },
          {
            question: 'Will this show how much I need for retirement?',
            answer: 'Yes — we calculate your target corpus and how to reach it.'
          },
          {
            question: 'Do I need to buy products from you?',
            answer: 'No — we only advise. You can invest on your own or with our recommended platform.'
          }
        ],
        relatedServices: ['Tax Filing + Advance Tax', 'Investment Advisory', 'Insurance Review', 'FHI Score', 'Virtual CFO'],
        stickyFooterCta: {
          text: 'Save smarter, retire stronger — get your tax + retirement plan built for today and tomorrow.',
          buttons: [
            { label: 'Get My Tax + Retirement Plan', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Planner', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Income Details', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      advisory: {
        heroSection: {
          title: 'Build, Protect & Multiply Your Wealth — With Strategic Guidance',
          subtitle:
            'Our comprehensive wealth advisory helps you balance risk, taxes, and growth across investments, insurance, estate planning, and more.',
          ctas: [
            { label: 'Book Wealth Advisory Session', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Share My Financial Overview', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Certified Wealth Planner', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'High Net-Worth & Aspiring HNIs', icon: 'PersonOutlined', size: 20 },
            { text: 'Multi-Asset, Multi-Goal Strategy', icon: 'BarChartOutlined', size: 20 },
            { text: 'Tax-Efficient + Holistic Planning', icon: 'GavelOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'Founders, professionals, and business families with multi-crore net worth',
          'Salaried individuals growing past ₹25L annual income',
          'People with existing investments needing consolidation & clarity',
          'First-gen wealth creators ready for long-term strategy',
          'Anyone confused between real estate, equity, mutual funds, FDs, NPS, and insurance'
        ],
        pricing: {
          title: 'Transparent Fee-Only Wealth Advisory',
          plans: [
            { name: 'Mini Wealth Session', bestFor: '60-min strategy call + summary report', price: '₹2,999' },
            { name: 'Annual Wealth Plan', bestFor: 'Full lifecycle plan + quarterly reviews', price: '₹14,999/year' },
            { name: 'Family Office Advisory', bestFor: 'Multi-person, multi-goal strategic planning', price: 'Custom Quote' }
          ],
          note: '*No product selling. No commissions. All advice.'
        },
        whatsIncluded: [
          'Goal setting & cash flow mapping',
          'Asset allocation across equity, debt, gold, real estate, and alternatives',
          'Insurance audit + retirement planning',
          'Tax optimization and advance tax tracking',
          'Real estate vs. REIT vs. debt comparison',
          'Mutual fund + PMS + fixed income alignment',
          'Access to financial dashboard & net worth tracker',
          'Portfolio review and consolidation (optional)',
          'Estate & succession advisory (optional)',
          'NRI planning + repatriation (optional)'
        ],
        documentsRequired: [
          'Income summary (salary/business)',
          'Existing investments (MFs, equity, FDs, ULIPs, real estate)',
          'Loans/liabilities',
          'Insurance portfolio',
          'Future financial goals (buying house, retirement, kids’ education, etc.)'
        ],
        howItWorks: [
          'Share your financial overview',
          'Book a wealth strategy consultation',
          'Receive a custom plan + investment/exposure snapshot',
          'Optional quarterly reviews & rebalancing',
          'Coordinate with your CA, legal, or family stakeholders'
        ],
        timeline: '5–10 Working Days for full plan. Monthly/Quarterly reviews optional.',
        whyChooseUs: [
          'No product bias — we advise, not sell',
          'Certified financial planners + chartered accountants',
          'Wealth plans aligned with taxes, estate, and goals',
          'Seamless integration with your business finances',
          'Fully digital, collaborative, and confidential'
        ],
        faqs: [
          {
            question: 'Is this for high net-worth individuals only?',
            answer: 'No — we also advise rising professionals building ₹50L+ portfolios.'
          },
          {
            question: 'Will you tell me where to invest?',
            answer: 'Yes — via allocation strategy and recommended platforms/funds.'
          },
          {
            question: 'Can I include my spouse/kids in planning?',
            answer: 'Yes — we recommend family-level consolidation.'
          },
          {
            question: 'What if I already have a CA or advisor?',
            answer: 'We coordinate with them or offer a second opinion.'
          },
          {
            question: 'Do you track my investments after setup?',
            answer: 'Yes — if you opt for our annual or review-based plan.'
          }
        ],
        relatedServices: ['Investment Advisory', 'Insurance & Risk Management', 'Tax Planning', 'Virtual CFO', 'Estate & Will Planning'],
        stickyFooterCta: {
          text: 'Wealth isn’t just about returns — it’s about structure, clarity, and legacy. Let’s build yours the right way.',
          buttons: [
            { label: 'Book Wealth Advisory Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Planner', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload My Financial Snapshot', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      },
      fhi: {
        heroSection: {
          title: 'Know Your Financial Fitness in One Powerful Score',
          subtitle:
            'The FHI Score (Financial Health Index) is a comprehensive assessment of your personal or business financial strength — covering cash flow, debt, savings, insurance, taxes, and investments.',
          ctas: [
            { label: 'Check My FHI Score', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Upload Financial Snapshot or Statements', icon: 'CloudUploadOutlined', size: 24 },
            { label: 'Talk to a Financial Analyst', icon: 'PhoneOutlined', size: 24 }
          ],
          badges: [
            { text: 'Personal + Business Score Available', icon: 'PersonOutlined', size: 20 },
            { text: 'Actionable Insights with Score Breakdown', icon: 'LightbulbOutlined', size: 20 },
            { text: 'Track Progress Every Quarter', icon: 'TimelineOutlined', size: 20 }
          ]
        },
        whoIsThisFor: [
          'You want to benchmark your financial health and fix gaps',
          'You’re applying for a loan or preparing for funding',
          'You’ve never reviewed your finances holistically',
          'You’re curious about where you stand vs. industry norms',
          'You want to improve credit, savings, or cash reserves'
        ],
        pricing: {
          title: 'One-Time or Quarterly Tracking Options',
          plans: [
            { name: 'One-Time Report', bestFor: '6-metric FHI Score + Recommendations', price: '₹499' },
            { name: 'Quarterly Tracker', bestFor: 'Score + Action Plan + Review', price: '₹1,499/year' },
            { name: 'Business + Personal Combo', bestFor: 'Combo Score for Founder or SME', price: '₹1,999' }
          ],
          note: '*Includes PDF report, benchmarks, and action steps.'
        },
        whatsIncluded: [
          'Calculation of Financial Health Index (FHI Score out of 100)',
          'Coverage across 6 key areas: Cash Flow Stability, Debt Management, Savings Adequacy, Insurance Coverage, Tax Efficiency, Investment Diversification',
          'Strengths & weakness map',
          'Custom recommendations for improvement',
          'Comparison to industry or income peer benchmarks',
          'Optional: Net Worth Report, Credit Score Review, Investment Readiness Meter'
        ],
        documentsRequired: [
          'Monthly income and expenses',
          'Loan EMIs and credit card dues',
          'Insurance policies and coverage',
          'Tax returns (summary)',
          'Investment portfolio (if any)',
          'Revenue & expense summary (for businesses)',
          'Loan statements or working capital details',
          'Owner’s draw or retained profits',
          'Tax & GST summaries'
        ],
        howItWorks: [
          'Fill a short financial info form or upload documents',
          'Our system + analyst team crunch the numbers',
          'Receive your FHI score, report & action checklist',
          'Track progress with optional quarterly reviews'
        ],
        timeline: '2–3 Working Days',
        whyChooseUs: [
          'FHI backed by CAs, CFPs & data models',
          'Easy-to-read, color-coded scorecard',
          'Practical suggestions you can implement instantly',
          'Works for individuals, founders & families',
          'Trackable over time like a financial fitness test'
        ],
        faqs: [
          {
            question: 'Is this like a credit score?',
            answer: 'No — it’s broader. It covers liquidity, investments, insurance, and taxes.'
          },
          {
            question: 'Will my data be safe?',
            answer: 'Yes — we use encrypted upload and secure storage.'
          },
          {
            question: 'Can I use this to apply for a loan or investment?',
            answer: 'Yes — it helps show financial stability.'
          },
          {
            question: 'Is this only for individuals?',
            answer: 'No — founders and SMEs can get a business FHI Score too.'
          },
          {
            question: 'What if I score low?',
            answer: 'No worries — we give you exact next steps to improve.'
          }
        ],
        relatedServices: [
          'Tax Planning',
          'Insurance & Investment Advisory',
          'Loan & Credit Score Advisory',
          'Virtual CFO',
          'Net Worth Certificate'
        ],
        stickyFooterCta: {
          text: 'If your body needs a health check, so does your money — know your FHI score and take control.',
          buttons: [
            { label: 'Check My FHI Score Now', icon: 'AssignmentTurnedInOutlined', size: 24 },
            { label: 'Talk to a Financial Advisor', icon: 'PhoneOutlined', size: 24 },
            { label: 'Upload Financial Info Securely', icon: 'CloudUploadOutlined', size: 24 }
          ]
        }
      }
    }
  }
};

export default servicesData;
