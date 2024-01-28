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

        const data = await response.json(); // Parse la réponse du serveur
        // Vérifiez si data.transactions et data.transactions.body existent et sont des chaînes
        if (data.transactions && typeof data.transactions.body === 'string') {
          const transactionsObject = JSON.parse(data.transactions.body); // Parsez le contenu de body pour obtenir l'objet des transactions
          if (transactionsObject.transactions && transactionsObject.transactions.length > 0) {
            setUserPayments(transactionsObject.transactions);
          } else {
            setError('Aucun paiement trouvé.');
          }
        } else {
          // Gérer le cas où data.transactions.body est undefined ou n'est pas une chaîne
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
  }, [user]); // La dépendance [user] permet de refaire la requête si l'utilisateur change

  if (loading) {
    return <div>Chargement de votre profil...</div>;
  }

  if (error) {
    return (
      <div className="profile-container">
        <h1>Mon Profil</h1>
        <p>{error}</p>
        <button type="button" onClick={logout}>Déconnexion</button>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 text-white p-5 rounded-lg">
      <h1 className="text-xl font-bold">Mon Profil</h1>
      <button type="button"
        onClick={logout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-3"
      >
        Déconnexion
      </button>
      <div>
        <p>Nom: {user.name}</p>
        <p>Email: {user.email}</p>
        {userPayments.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold mt-3 mb-2">Paiements</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="border-b-2 border-gray-600 text-left px-3 py-2">
                      ID de Transaction
                    </th>
                    <th className="border-b-2 border-gray-600 text-left px-3 py-2">
                      Articles
                    </th>
                    <th className="border-b-2 border-gray-600 text-left px-3 py-2">
                      Montant Total
                    </th>
                    <th className="border-b-2 border-gray-600 text-left px-3 py-2">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {userPayments.map((payment, index) => (
                    <tr key={index}>
                      <td className="border-b border-gray-700 px-3 py-2">{payment.transactionId}</td>
                      <td className="border-b border-gray-700 px-3 py-2">
                        {payment.items.map((item) => `ID: ${item.id}, Quantité: ${item.quantity}`).join(', ')}
                      </td>
                      <td className="border-b border-gray-700 px-3 py-2">{payment.totalAmount.toFixed(2)}</td>
                      <td className="border-b border-gray-700 px-3 py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Aucun paiement trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default MonProfil;
