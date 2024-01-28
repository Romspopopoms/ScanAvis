import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const { user, logout } = useContext(AuthContext);
  const [userPayments, setUserPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      // Votre code existant pour le début de la fonction

      try {
        const response = await fetch('/.netlify/functions/getUserPayments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userUuid: user.uuid }),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        const data = await response.json();
        if (data.transactions && typeof data.transactions.body === 'string') {
          const transactionsObject = JSON.parse(data.transactions.body);
          if (transactionsObject.transactions && transactionsObject.transactions.length > 0) {
            setUserPayments(transactionsObject.transactions);
          } else {
            setError('Aucun paiement trouvé.');
          }
        } else {
          setError('Réponse inattendue du serveur.');
        }
      } catch (fetchError) {
        console.error('Erreur lors de la récupération des paiements utilisateur :', fetchError);
        setError(`Erreur lors de la récupération des paiements : ${fetchError.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  if (loading) {
    return <div className="text-center">Chargement de votre profil...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto my-4 p-4 bg-blue-900 text-white rounded-lg">
        <h1 className="text-xl font-bold mb-4">Mon Profil</h1>
        <p>{error}</p>
        <button type="button"
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-4 p-4 bg-blue-900 text-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Mon Profil</h1>
      <button type="button"
        onClick={logout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Déconnexion
      </button>
      <div>
        <p>Nom: {user.name}</p>
        <p>Email: {user.email}</p>
        {userPayments.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-3">Paiements</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-blue-800 rounded-lg">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left p-3">Transaction ID</th>
                    <th className="text-left p-3">Articles</th>
                    <th className="text-left p-3">Montant Total</th>
                    <th className="text-left p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userPayments.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-3">{payment.transactionId}</td>
                      <td className="p-3">
                        {payment.items.map((item) => `ID: ${item.id}, Quantité: ${item.quantity}`).join(', ')}
                      </td>
                      <td className="p-3">{payment.totalAmount.toFixed(2)}</td>
                      <td className="p-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="mt-4">Aucun paiement trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default MonProfil;
