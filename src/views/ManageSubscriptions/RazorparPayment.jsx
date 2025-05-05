import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Factory from 'utils/Factory';

export default function RazorparPayment({ plan, contextId, onSuccess, onFailure, userId }) {
  const navigate = useNavigate();
  const handlePayment = async () => {
    try {
      const orderRes = await Factory('post', '/user_management/create-order/', {
        context_id: contextId,
        plan_id: plan.id,
        added_by_id: userId
      });
      if (orderRes.res.status_cd === 0 && orderRes.res.data && orderRes.res.data.order_id) {
        openRazorpay(orderRes.res.data.order_id, orderRes.res.data.amount);
      } else {
        alert('Failed to create order. Please try again.');
        if (onFailure) onFailure();
      }
      navigate('/app/subscriptions');
    } catch (err) {
      alert('Failed to create order. Please try again.');
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
    <Button variant="contained" color="primary" onClick={handlePayment}>
      Order Now
    </Button>
  );
}
