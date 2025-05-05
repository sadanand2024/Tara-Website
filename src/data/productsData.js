import image1 from 'assets/images/payrollimages/image1.png';
import image2 from 'assets/images/payrollimages/image2.png';
import image3 from 'assets/images/payrollimages/image3.png';
import image4 from 'assets/images/payrollimages/image4.png';

import invoiceimage1 from 'assets/images/invoiceimages/image1.png';
import invoiceimage2 from 'assets/images/invoiceimages/image2.png';
import invoiceimage3 from 'assets/images/invoiceimages/image3.png';
import {
  IconUsers,
  IconBuildingStore,
  IconBriefcase,
  IconBuildingFactory,
  IconUser,
  IconRocket,
  IconShoppingCart,
  IconTools
} from '@tabler/icons-react';
import { IconCreditCard, IconChartLine, IconShieldCheck } from '@tabler/icons-react';

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
      light: [image1, image2, image3, image4],
      dark: [image1, image2, image3, image4]
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
        title: 'Salary Structuring',
        description: 'Define flexible salary components with automated tax and deduction calculations.',
        icon: 'IconCalculator'
      },
      {
        title: 'Statutory Setup',
        description: 'Set up statutory parameters like EPF, ESI, PT, and TDS for full compliance.',
        icon: 'IconShieldCheck'
      },
      {
        title: 'Pay Schedule Management',
        description: 'Configure and manage pay cycles, frequency, and processing timelines.',
        icon: 'IconCalendarTime'
      },
      {
        title: 'Employee Master',
        description: 'Centralized database to manage employee profiles, bank details, and documents.',
        icon: 'IconIdBadge2'
      },
      {
        title: 'Payslip Generation',
        description: 'Auto-generate and distribute detailed monthly payslips with compliance summary.',
        icon: 'IconFileText'
      },
      {
        title: 'Leave Management',
        description: 'Track leave balances, define leave policies, and manage employee leave requests.',
        icon: 'IconUsers'
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
    ],
    targetAudience: [
      {
        title: 'Startups',
        description: 'Perfect for startups and small businesses looking to streamline their operations',
        icon: IconBuildingStore
      },
      {
        title: 'MSME',
        description: 'Scalable solutions for large organizations with complex requirements',
        icon: IconBriefcase
      },
      {
        title: 'Internal HR Teams',
        description: 'Ideal for freelancers and independent professionals managing their business',
        icon: IconUsers
      },
      {
        title: 'Coorporates',
        description: 'Ideal for freelancers and independent professionals managing their business',
        icon: IconUsers
      }
    ],
    plans: [
      {
        title: 'Essentials',
        icon: IconCreditCard,
        description: 'For small teams',
        price: '399',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19],
        details: {
          'Payroll Setup Wizard': 'Full Access',
          'Employees Limit': '10',
          Locations: '1',
          'Salary Templates': '1',
          'Salary Components': 'Unlimited',
          'Pay Schedule': 'Monthly Only',
          'Departments & Designations': 'Yes',
          'Leave Management': '1 Leave Head (Basic)',
          'Payslip Download': 'Yes',
          Attendance: 'No',
          'Compliance Config': 'PF / ESI / PT / TDS',
          'No of Users': '1',
          'Email Payslips': 'Yes',
          'Custom Payslip Format': 'No',
          'Extra Employee (per 10)': 'INR 150/month',
          'Payslip via WhatsApp': '₹0.75/message',
          'Additional Admin Users': '₹99/month/user',
          'Salary Structuring Assistance': '₹499 one-time',
          'Form 16 Auto Generator (Beta)': '₹499/month',
          'PF/ESI/PT Filings (Service)': '₹499/month'
        }
      },
      {
        title: 'Pro Edge',
        icon: IconChartLine,
        description: 'For growing businesses',
        price: '999',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        details: {
          'Payroll Setup Wizard': 'Full Access',
          'Employees Limit': '50',
          Locations: '3',
          'Salary Templates': 'Multiple',
          'Salary Components': 'Unlimited',
          'Pay Schedule': 'Monthly / Fortnightly',
          'Departments & Designations': 'Yes',
          'Leave Management': 'Multiple Heads + Accruals',
          'Payslip Download': 'Yes',
          Attendance: 'Excel Upload',
          'Compliance Config': 'PF / ESI / PT / TDS',
          'No of Users': '2',
          'Email Payslips': 'Yes',
          'Custom Payslip Format': 'No',
          'Extra Employee (per 10)': 'INR 150/month',
          'Payslip via WhatsApp': '₹0.75/message',
          'Additional Admin Users': '₹99/month/user',
          'Salary Structuring Assistance': '₹499 one-time',
          'Form 16 Auto Generator (Beta)': '₹499/month',
          'PF/ESI/PT Filings (Service)': '₹499/month'
        }
      },
      {
        title: 'Ultimate Control',
        icon: IconShieldCheck,
        description: 'For large enterprises',
        price: '1999',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        details: {
          'Payroll Setup Wizard': 'Full Access',
          'Employees Limit': '100',
          Locations: 'Unlimited',
          'Salary Templates': 'Multiple',
          'Salary Components': 'Unlimited',
          'Pay Schedule': 'Custom',
          'Departments & Designations': 'Yes',
          'Leave Management': 'Rule-Based (Custom Policies)',
          'Payslip Download': 'Yes',
          Attendance: 'Excel + Manual',
          'Compliance Config': 'PF / ESI / PT / TDS + Summary View',
          'No of Users': 'Unlimited',
          'Email Payslips': 'Yes',
          'Custom Payslip Format': 'Yes',
          'Extra Employee (per 10)': 'INR 150/month',
          'Payslip via WhatsApp': '₹0.75/message',
          'Additional Admin Users': '₹99/month/user',
          'Salary Structuring Assistance': '₹499 one-time',
          'Form 16 Auto Generator (Beta)': '₹499/month',
          'PF/ESI/PT Filings (Service)': '₹499/month'
        }
      }
    ],
    planList: [
      'Payroll Setup Wizard',
      'Employees Limit',
      'Locations',
      'Salary Templates',
      'Salary Components',
      'Pay Schedule',
      'Departments & Designations',
      'Leave Management',
      'Payslip Download',
      'Attendance',
      'Compliance Config',
      'No of Users',
      'Email Payslips',
      'Custom Payslip Format',
      'Extra Employee (per 10)',
      'Payslip via WhatsApp',
      'Additional Admin Users',
      'Salary Structuring Assistance',
      'Form 16 Auto Generator (Beta)',
      'PF/ESI/PT Filings (Service)'
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
      light: [invoiceimage1, invoiceimage2, invoiceimage3],
      dark: [invoiceimage1, invoiceimage2, invoiceimage3]
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
        title: 'GST Compliant Invoices',
        description: 'Generate legally compliant GST invoices with ease',
        icon: 'IconFileCertificate' // Represents compliance
      },
      {
        title: 'Real-Time Payment Status',
        description: 'Monitor live payment updates and statuses',
        icon: 'IconTimelineEvent' // Reflects tracking over time
      },
      {
        title: 'Custom Invoice Formats',
        description: 'Personalize invoice layouts and branding',
        icon: 'IconLayoutDashboard' // Symbolizes customizable layouts
      },
      {
        title: 'Recurring Invoices',
        description: 'Automate recurring billing cycles effortlessly',
        icon: 'IconRepeat' // Represents repetition and automation
      },
      {
        title: 'Auto Email & Tax Calculation',
        description: 'Automate email dispatch and tax computation',
        icon: 'IconCalculator' // Indicates calculation logic
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
    ],
    targetAudience: [
      {
        title: 'Freelancers',
        description: 'Simple and efficient invoicing and payment tools for independent professionals',
        icon: IconUser
      },
      {
        title: 'Startups',
        description: 'Perfect for early-stage businesses to manage billing and finances smoothly',
        icon: IconRocket
      },
      {
        title: 'Retailers',
        description: 'Easy billing and GST support for physical and online retail businesses',
        icon: IconShoppingCart
      },
      {
        title: 'Service Providers',
        description: 'Seamless tools for consultants, agencies, and other service-based businesses',
        icon: IconTools
      },
      {
        title: 'MSMEs',
        description: 'Scalable solutions for micro, small, and medium enterprises with growing needs',
        icon: IconBuildingFactory
      }
    ],
    plans: [
      {
        title: 'Essentials',
        icon: IconCreditCard,
        description: 'For individuals and small businesses',
        price: '199',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        details: {
          Pricing: '199',
          'Invoices Limit': '100',
          'No of Users': '1',
          GSTINs: '1',
          Branches: '1',
          'Invoice Format': 'Basic (Pre-defined)',
          'Payment Status Tracker': 'No',
          'Inventory & Items Master': 'No',
          'Customer Master': 'No',
          'Import from Excel': 'No',
          'Download in PDF': 'Yes',
          'Email/Whatsapp Invoices': 'No',
          'Reports & Filters': 'No',
          'Branding (Custom color/theme)': 'No',
          Support: 'Email',
          'Extra User': 'INR 50/Month',
          'Extra GSTIN': 'INR 100/Month',
          'Custom Template Setup': 'INR 499 one time'
        }
      },
      {
        title: 'Pro Edge',
        icon: IconChartLine,
        description: 'For growing businesses',
        price: '499',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        details: {
          'Payroll Setup Wizard': 'Full Access',
          'Employees Limit': '50',
          Locations: '3',
          'Salary Templates': 'Multiple',
          'Salary Components': 'Unlimited',
          'Pay Schedule': 'Monthly / Fortnightly',
          'Departments & Designations': 'Yes',
          'Leave Management': 'Multiple Heads + Accruals',
          'Payslip Download': 'Yes',
          Attendance: 'Excel Upload',
          'Compliance Config': 'PF / ESI / PT / TDS',
          'No of Users': '2',
          'Email Payslips': 'Yes',
          'Custom Payslip Format': 'No',
          'Extra Employee (per 10)': 'INR 150/month',
          'Payslip via WhatsApp': '₹0.75/message',
          'Additional Admin Users': '₹99/month/user',
          'Salary Structuring Assistance': '₹499 one-time',
          'Form 16 Auto Generator (Beta)': '₹499/month',
          'PF/ESI/PT Filings (Service)': '₹499/month'
        }
      },
      {
        title: 'Ultimate Control',
        icon: IconShieldCheck,
        description: 'For large enterprises',
        price: '899',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        details: {
          'Payroll Setup Wizard': 'Full Access',
          'Employees Limit': '100',
          Locations: 'Unlimited',
          'Salary Templates': 'Multiple',
          'Salary Components': 'Unlimited',
          'Pay Schedule': 'Custom',
          'Departments & Designations': 'Yes',
          'Leave Management': 'Rule-Based (Custom Policies)',
          'Payslip Download': 'Yes',
          Attendance: 'Excel + Manual',
          'Compliance Config': 'PF / ESI / PT / TDS + Summary View',
          'No of Users': 'Unlimited',
          'Email Payslips': 'Yes',
          'Custom Payslip Format': 'Yes',
          'Extra Employee (per 10)': 'INR 150/month',
          'Payslip via WhatsApp': '₹0.75/message',
          'Additional Admin Users': '₹99/month/user',
          'Salary Structuring Assistance': '₹499 one-time',
          'Form 16 Auto Generator (Beta)': '₹499/month',
          'PF/ESI/PT Filings (Service)': '₹499/month'
        }
      }
    ],
    planList: [
      'Invoices Limit',
      'No of Users',
      'GSTINs',
      'Branches',
      'Invoice Format',
      'Payment Status Tracker',
      'Inventory & Items Master',
      'Customer Master',
      'Import from Excel',
      'Download in PDF',
      'Email/Whatsapp Invoices',
      'Reports & Filters',
      'Branding (Custom color/theme)',
      'Support',
      'Extra User',
      'Extra GSTIN',
      'Custom Template Setup',
      'Add ons',
      'Custom Layout Control',
      'Advanced Reports',
      'Priority/Call Support'
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
