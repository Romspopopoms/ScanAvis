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

  // Log whenever paymentDetails is updated
  useEffect(() => {
    console.log('Payment Details set in context:', paymentDetails);
  }, [paymentDetails]);

  const clearPaymentInfo = () => {
    console.log('Clearing payment info');
    setPaymentStatus(null);
    setPaymentMessage('');
    setPaymentDetails({});
  };

  const setPaymentStatusDebug = (status) => {
    console.log('setPaymentStatus called with:', status);
    setPaymentStatus(status);
  };

  const setPaymentMessageDebug = (message) => {
    console.log('setPaymentMessage called with:', message);
    setPaymentMessage(message);
  };

  const setPaymentDetailsDebug = (details) => {
    console.log('setPaymentDetails called with:', details);
    setPaymentDetails(details);
  };

  const contextValue = {
    paymentStatus,
    setPaymentStatus: setPaymentStatusDebug,
    paymentMessage,
    setPaymentMessage: setPaymentMessageDebug,
    paymentDetails,
    setPaymentDetails: setPaymentDetailsDebug,
    clearPaymentInfo,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};
