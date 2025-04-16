import { lazy } from 'react';

// project imports
import SimpleLayout from 'layout/SimpleLayout';
import Loadable from 'ui-component/Loadable';

// login routing
const ContactUs = Loadable(lazy(() => import('views/pages/contact-us')));
const AboutUs = Loadable(lazy(() => import('views/pages/about-us')));
const SaasPageFaqs = Loadable(lazy(() => import('views/pages/saas-pages/Faqs')));
const SaasPagePrivacyPolicy = Loadable(lazy(() => import('views/pages/saas-pages/PrivacyPolicy')));
import ServicePage from 'views/pages/services/ServicePage';
import ServiceCategory from 'views/pages/services/ServiceCategory';
import PayrollPage from '../views/pages/products/Payroll';
import InvoicingPage from 'views/pages/products/invoicing/InvoicingPage';
// ==============================|| SIMPLE ROUTING ||============================== //

const SimpleRoutes = {
  path: '/',
  element: <SimpleLayout />,
  children: [
    {
      path: '/pages/about-us',
      element: <AboutUs />
    },
    {
      path: '/pages/contact-us',
      element: <ContactUs />
    },
    {
      path: '/pages/faqs',
      element: <SaasPageFaqs />
    },
    {
      path: '/pages/privacy-policy',
      element: <SaasPagePrivacyPolicy />
    },
    {
      path: 'services/:category',
      element: <ServiceCategory />
    },
    {
      path: 'services/:category/:slug',
      element: <ServicePage />
    },
    {
      path: 'products/payroll',
      element: <PayrollPage />
    },
    {
      path: 'products/invoicing',
      element: <InvoicingPage />
    }
  ]
};

export default SimpleRoutes;
