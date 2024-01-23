import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Make sure the path is correct

const MonProfil = () => {
  const { user, logout } = useContext(AuthContext);
  const [userPayments, setUserPayments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/getUserPayments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }), // Make sure user ID is correctly passed
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserPayments(data.transactions); // Adjust according to the actual key in the response
      } catch (error) {
        console.error('Error fetching user payments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  if (!user || loading) {
    return <div>Loading your profile...</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <button type="button" onClick={logout}>Log Out</button>
      <table className="profile-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>
          {/* You can add more information here */}
          {userPayments && userPayments.length > 0 && (
            <tr>
              <th>Payments</th>
              <td>
                {/* You can format and display the payment information as you wish */}
                {userPayments.map((payment, index) => (
                  <div key={index}>
                    {payment.items} - {payment.totalAmount} - {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                ))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonProfil;
