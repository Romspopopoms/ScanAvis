import { createContext, useState, useContext, useEffect } from 'react';

const PaymentContext = createContext({
  paymentStatus: null,
  paymentMessage: '',
  paymentDetails: {},
  setPaymentStatus: () => {},
  setPaymentMessage: () => {},
  setPaymentDetails: () => {},
  clearPaymentInfo: () => {},
});

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    console.log('Payment Details set in context:', paymentDetails);
  }, [paymentDetails]);

  const setPaymentDetailsDebug = (details) => {
    console.log('setPaymentDetails called with:', details);
    setPaymentDetails(details);
  };
  const clearPaymentInfo = () => {
    setPaymentStatus(null);
    setPaymentMessage('');
    setPaymentDetails({});
  };

  const contextValue = {
    paymentStatus,
    setPaymentStatus,
    paymentMessage,
    setPaymentMessage,
    paymentDetails,
    setPaymentDetails,
    clearPaymentInfo,
    setPaymentDetailsDebug,

  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};
