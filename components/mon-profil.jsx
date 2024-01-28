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
    return <div className="text-center mt-10">Chargement de votre profil...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
        <p className="text-red-500">{error}</p>
        <button type="button" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition" onClick={logout}>Déconnexion</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition" onClick={logout}>Déconnexion</button>

      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <p><span className="font-bold">Nom:</span> {user.name}</p>
          <p><span className="font-bold">Email:</span> {user.email}</p>
        </div>

        {userPayments.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-white rounded">Paiements</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {userPayments.map((payment, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                  <p><span className="font-bold">Transaction ID:</span> {payment.transactionId}</p>
                  <p><span className="font-bold">Articles:</span> {payment.items.map((item) => `ID: ${item.id}, Quantité: ${item.quantity}`).join(', ')}</p>
                  <p><span className="font-bold">Montant Total:</span> {payment.totalAmount}</p>
                  <p><span className="font-bold">Date:</span> {new Date(payment.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Aucun paiement trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default MonProfil;
