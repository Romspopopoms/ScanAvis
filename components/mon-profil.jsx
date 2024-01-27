import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que le chemin est correct

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
          body: JSON.stringify({ userUuid: user.uuid }), // Assurez-vous que user.uuid est correct et contient l'UUID de l'utilisateur
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        const data = await response.json();
        setUserPayments(data.transactions); // Assurez-vous que data.transactions contient bien les transactions
      } catch (error) {
        console.error('Erreur lors de la récupération des paiements utilisateur :', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.uuid) {
      fetchPayments();
    }
  }, [user]);

  if (!user || loading) {
    return <div>Chargement de votre profil...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Mon Profil</h1>
      <button type="button" onClick={logout}>Déconnexion</button>
      <table className="profile-table">
        <tbody>
          <tr>
            <th>Nom</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>
          {/* Vous pouvez ajouter plus d'informations ici */}
          {userPayments && userPayments.length > 0 && (
            <tr>
              <th>Paiements</th>
              <td>
                {/* Vous pouvez formater et afficher les informations de paiement comme vous le souhaitez */}
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
