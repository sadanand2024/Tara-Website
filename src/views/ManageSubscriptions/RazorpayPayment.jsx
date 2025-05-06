import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Factory from 'utils/Factory';

export default function RazorparPayment({
  type,
  plan,
  contextId,
  onSuccess,
  onFailure,
  userId,
  label,
  service_id,
  status,
  service_request_id
}) {
  const navigate = useNavigate();
  const handlePayment = async () => {
    let orderData = {};
    let orderURl = '/user_management/create-order/';
    if (status === 'pending') {
      orderURl = '/user_management/service-payment/create-order/';
      orderData = {
        context_id: contextId,
        service_request_id: service_request_id,
        plan_id: plan.id,
        added_by_id: userId
      };
    } else if (type === 'service') {
      orderURl = '/user_management/service-request/create/';
      orderData = {
        context_id: contextId,
        service_id: parseInt(service_id),
        plan_id: plan.id,
        user_id: userId
      };
    } else {
      orderData = {
        added_by_id: userId,
        context_id: contextId,
        plan_id: plan.id
      };
    }
    try {
      const orderRes = await Factory('post', orderURl, orderData);
      if (orderRes.res.status_cd === 0 && orderRes.res.data && orderRes.res.data.order_id) {
        openRazorpay(orderRes.res.data.order_id, orderRes.res.data.amount);
      } else {
        if (onFailure) onFailure();
      }
      navigate('/app/subscriptions');
    } catch (err) {
      if (onFailure) onFailure();
    }
  };

  const openRazorpay = (orderId, amount) => {
    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID_DEVELOPMENT,
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      name: plan.name,
      description: plan.description,
      order_id: orderId, // <-- Use backend order ID here
      handler: function (response) {
        if (onSuccess) onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          if (onFailure) onFailure();
        }
      }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Button
      sx={{
        pt: 1,
        borderRadius: 2,
        fontWeight: 700,
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        '&:hover': {
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
          boxShadow: 3
        }
      }}
      variant="contained"
      color="primary"
      onClick={handlePayment}
    >
      {label ? label : 'Order Now'}
    </Button>
  );
}
