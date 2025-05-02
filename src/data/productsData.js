const productsData = {
  payroll: {
    id: 'payroll',
    name: 'Payroll',
    title: 'Smart Payroll That Pays Off',
    description:
      'Automate salary processing, compliance filings, payslip generation, and employee management — all in one unified payroll system.',
    icon: 'IconCreditCard',
    color: '#FF6B6B',
    path: '/products/payroll',
    images: {
      light: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      ],
      dark: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      ]
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        order: 1
      },
      {
        id: 'features',
        type: 'features',
        order: 2
      },
      {
        id: 'how-it-works',
        type: 'howItWorks',
        order: 3
      },
      {
        id: 'why-choose-us',
        type: 'whyChooseUs',
        order: 4
      },
      {
        id: 'pricing',
        type: 'pricing',
        order: 5
      },
      {
        id: 'faqs',
        type: 'faqs',
        order: 6
      },
      {
        id: 'cta',
        type: 'cta',
        order: 7
      }
    ],
    features: [
      {
        title: 'Salary Processing',
        description: 'Automated salary calculations and processing',
        icon: 'IconCalculator'
      },
      {
        title: 'Employee Management',
        description: 'Complete employee data and profile management',
        icon: 'IconUsers'
      },
      {
        title: 'Compliance',
        description: 'EPF, ESI, PT, and TDS compliance handling',
        icon: 'IconShieldCheck'
      },
      {
        title: 'Reports',
        description: 'Comprehensive payroll and tax reports',
        icon: 'IconChartBar'
      }
    ],
    howItWorks: [
      {
        title: 'Setup Your Account',
        description: 'Create your account and configure basic settings'
      },
      {
        title: 'Add Employees',
        description: 'Import or add employee details and documents'
      },
      {
        title: 'Configure Salary',
        description: 'Set up salary structures and components'
      },
      {
        title: 'Process Payroll',
        description: 'Run payroll and generate payslips automatically'
      }
    ],
    whyChooseUs: [
      {
        title: 'Automated Calculations',
        description: 'Save time with automatic salary calculations'
      },
      {
        title: 'Compliance Ready',
        description: 'Stay compliant with all statutory requirements'
      },
      {
        title: 'Employee Portal',
        description: 'Self-service portal for employees'
      }
    ],
    faqs: [
      {
        question: 'How does the payroll system work?',
        answer: 'Our payroll system automates the entire process from salary calculation to compliance filing.'
      },
      {
        question: 'What compliance features are included?',
        answer: 'We handle EPF, ESI, Professional Tax, and TDS calculations and filings.'
      }
    ]
  },
  invoice: {
    id: 'invoice',
    name: 'Invoice',
    title: 'Smart Invoicing Made Simple',
    description: 'Create professional invoices, track payments, and manage your business finances with ease.',
    icon: 'IconReceipt',
    color: '#4D96FF',
    path: '/products/invoice',
    images: {
      light: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85'
      ],
      dark: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85'
      ]
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        order: 1
      },
      {
        id: 'features',
        type: 'features',
        order: 2
      },
      {
        id: 'how-it-works',
        type: 'howItWorks',
        order: 3
      },
      {
        id: 'why-choose-us',
        type: 'whyChooseUs',
        order: 4
      },
      {
        id: 'pricing',
        type: 'pricing',
        order: 5
      },
      {
        id: 'faqs',
        type: 'faqs',
        order: 6
      },
      {
        id: 'cta',
        type: 'cta',
        order: 7
      }
    ],
    features: [
      {
        title: 'Invoice Generation',
        description: 'Create professional GST compliant invoices',
        icon: 'IconFileInvoice'
      },
      {
        title: 'Payment Tracking',
        description: 'Track payments and send reminders',
        icon: 'IconCreditCard'
      },
      {
        title: 'Online Payments',
        description: 'Accept payments online with multiple options',
        icon: 'IconCash'
      },
      {
        title: 'Reports & Analytics',
        description: 'Generate detailed reports and insights',
        icon: 'IconChartBar'
      }
    ],
    howItWorks: [
      {
        title: 'Create Invoice',
        description: 'Design professional invoices with your branding'
      },
      {
        title: 'Send to Client',
        description: 'Share invoices via email or download as PDF'
      },
      {
        title: 'Track Payment',
        description: 'Monitor payment status and send reminders'
      },
      {
        title: 'Generate Reports',
        description: 'Get insights with detailed financial reports'
      }
    ],
    whyChooseUs: [
      {
        title: 'GST Compliant',
        description: 'All invoices are GST compliant and ready to use'
      },
      {
        title: 'Multiple Payment Options',
        description: 'Accept payments through various channels'
      },
      {
        title: 'Automated Reminders',
        description: 'Never miss a payment with automatic reminders'
      }
    ],
    faqs: [
      {
        question: 'Is the invoicing GST compliant?',
        answer: 'Yes, all invoices are fully GST compliant and include necessary fields.'
      },
      {
        question: 'Can I customize invoice templates?',
        answer: 'Yes, you can customize invoice templates with your logo and branding.'
      }
    ]
  },
  accounting: {
    id: 'accounting',
    name: 'Accounting',
    description: 'Track income, expenses, and manage books easily.',
    icon: 'AccountBalance',
    color: '#00C9A7',
    path: '/products/accounting',
    sections: [
      {
        id: 'first-section',
        component: 'FirstSection',
        order: 1
      },
      {
        id: 'key-features',
        component: 'KeyFeaturesSection',
        order: 2
      },
      {
        id: 'target-audience',
        component: 'TargetAudienceSection',
        order: 3
      }
    ],
    features: [
      {
        title: 'Bookkeeping',
        description: 'Easy-to-use double-entry bookkeeping',
        icon: 'Book'
      },
      {
        title: 'Bank Reconciliation',
        description: 'Automated bank reconciliation',
        icon: 'AccountBalance'
      },
      {
        title: 'Financial Reports',
        description: 'P&L, Balance Sheet, and more',
        icon: 'Assessment'
      },
      {
        title: 'GST Filing',
        description: 'Automated GST return filing',
        icon: 'Receipt'
      }
    ]
  },
  documentVault: {
    id: 'document-vault',
    name: 'Document Vault',
    description: 'Securely store and access all your financial documents.',
    icon: 'Folder',
    color: '#FFA94D',
    path: '/products/document-vault',
    sections: [
      {
        id: 'first-section',
        component: 'FirstSection',
        order: 1
      },
      {
        id: 'key-features',
        component: 'KeyFeaturesSection',
        order: 2
      },
      {
        id: 'target-audience',
        component: 'TargetAudienceSection',
        order: 3
      }
    ],
    features: [
      {
        title: 'Secure Storage',
        description: 'Bank-level encrypted document storage',
        icon: 'Security'
      },
      {
        title: 'Easy Access',
        description: 'Quick search and retrieval',
        icon: 'Search'
      },
      {
        title: 'Sharing',
        description: 'Secure document sharing',
        icon: 'Share'
      },
      {
        title: 'Version Control',
        description: 'Track document versions and changes',
        icon: 'History'
      }
    ]
  }
};

export default productsData;
