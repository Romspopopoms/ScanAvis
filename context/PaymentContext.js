import { createContext, useState, useContext } from 'react';

const PaymentContext = createContext(null);

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const clearPaymentInfo = () => {
    setPaymentStatus(null);
    setPaymentMessage('');
    setPaymentDetails(null);
  };

  const contextValue = {
    paymentStatus,
    setPaymentStatus,
    paymentMessage,
    setPaymentMessage,
    paymentDetails,
    setPaymentDetails,
    clearPaymentInfo,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};
