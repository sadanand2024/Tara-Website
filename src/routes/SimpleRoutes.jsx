import { lazy } from 'react';

// project imports
import SimpleLayout from 'layout/SimpleLayout';
import Loadable from 'ui-component/Loadable';
import ProductPage from 'views/pages/products/ProductPage';

// lazy loaded pages
const ContactUs = Loadable(lazy(() => import('views/pages/contact-us')));

const AboutUs = Loadable(lazy(() => import('views/pages/about-us')));
const SaasPageFaqs = Loadable(lazy(() => import('views/pages/saas-pages/Faqs')));
const SaasPagePrivacyPolicy = Loadable(lazy(() => import('views/pages/saas-pages/PrivacyPolicy')));
const ServicePage = Loadable(lazy(() => import('views/pages/services/ServicePage')));
const ServiceCategory = Loadable(lazy(() => import('views/pages/services/ServiceCategory')));
// const PayrollPage = Loadable(lazy(() => import('views/pages/products/Payroll')));
// const InvoicingPage = Loadable(lazy(() => import('views/pages/products/invoicing/InvoicingPage')));
const KnowledgePage = Loadable(lazy(() => import('views/pages/knowledge')));
const CompanyPage = Loadable(lazy(() => import('views/pages/company')));
const BookConsultationPage = Loadable(lazy(() => import('views/pages/BookConsultation')));
const ProductDetails = Loadable(lazy(() => import('views/pages/products/ProductDetails')));
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
      path: '/knowledge',
      element: <KnowledgePage />
    },
    {
      path: '/company',
      element: <CompanyPage />
    },
   
   
    {
      path: '/book-consultation',
      element: <BookConsultationPage />
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
      path: 'products/:category',
      element: <ProductPage />
    },
    {
      path: 'products/plans',
      element: <ProductDetails />
    }
  ]
};

export default SimpleRoutes;
