(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[866],{6690:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/mon-profil",function(){return __webpack_require__(7518)}])},7518:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return pages_mon_profil}});var jsx_runtime=__webpack_require__(5893),react=__webpack_require__(7294),AuthContext=__webpack_require__(4642);let MonProfil=()=>{let{user}=(0,react.useContext)(AuthContext.Vo),[userSubscriptions,setUserSubscriptions]=(0,react.useState)([]),[loading,setLoading]=(0,react.useState)(!0),[error,setError]=(0,react.useState)(""),formatAmount=amount=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(amount),fetchSubscriptions=async()=>{setLoading(!0),setError("");try{let response=await fetch("/.netlify/functions/getUserSubscriptions?userUuid=".concat(user.uuid),{method:"GET",headers:{"Content-Type":"application/json"}});if(404===response.status)setUserSubscriptions([]);else if(response.ok){let data=await response.json();setUserSubscriptions(data.subscriptions||[])}else throw Error("Erreur HTTP ! Statut : ".concat(response.status))}catch(fetchError){console.error("Erreur lors de la r\xe9cup\xe9ration des abonnements utilisateur:",fetchError),setError("Erreur lors de la r\xe9cup\xe9ration des abonnements: ".concat(fetchError.message))}finally{setLoading(!1)}};(0,react.useEffect)(()=>{user&&user.uuid&&fetchSubscriptions()},[user]);let handleSubscriptionAction=async(subscription,action)=>{try{let payload="resubscribe"===action?{userUuid:user.uuid}:{subscriptionId:subscription.subscriptionId},response=await fetch("/.netlify/functions/".concat(action,"Subscription"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!response.ok)throw Error("Erreur HTTP ! Statut : ".concat(response.status));fetchSubscriptions()}catch(actionError){console.error("Erreur lors de l'action sur l'abonnement:",actionError),setError("Erreur lors de l'action sur l'abonnement: ".concat(actionError.message))}};return loading?(0,jsx_runtime.jsx)("div",{className:"text-center mt-10",children:"Chargement de vos abonnements..."}):error?(0,jsx_runtime.jsxs)("div",{className:"container mx-auto pt-16 p-4",children:[(0,jsx_runtime.jsx)("h1",{className:"text-2xl font-bold mb-4",children:"Mon Profil"}),(0,jsx_runtime.jsx)("p",{className:"text-red-500",children:error})]}):(0,jsx_runtime.jsxs)("div",{className:"container mx-auto pt-16 p-4",children:[(0,jsx_runtime.jsx)("h1",{className:"text-2xl font-bold mb-4",children:"Mon Profil"}),(0,jsx_runtime.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-6 mb-6",children:[(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Nom:"})," ",user.name]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Email:"})," ",user.email]})]}),userSubscriptions.length>0?(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("h2",{className:"text-xl font-bold mb-4",children:"Abonnements"}),(0,jsx_runtime.jsx)("div",{className:"grid md:grid-cols-2 gap-4",children:userSubscriptions.map((subscription,index)=>(0,jsx_runtime.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-4",children:[(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"ID de souscription:"})," ",subscription.subscriptionId]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Produit:"})," ",subscription.items]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Statut:"})," ",subscription.status]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Montant Prochain Paiement:"})," ",formatAmount(subscription.nextPaymentAmount)]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Date du Prochain Paiement:"})," ",new Date(subscription.nextPaymentDate).toLocaleDateString()]}),"active"===subscription.status?(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>handleSubscriptionAction(subscription.subscriptionId,"cancel"),className:"bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700",children:"Se d\xe9sabonner"}):(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>handleSubscriptionAction(subscription.subscriptionId,"resubscribe"),className:"bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-700",children:"Se r\xe9abonner"})]},index))})]}):(0,jsx_runtime.jsx)("p",{children:"Aucun abonnement trouv\xe9."})]})},MonProfilPage=()=>(0,jsx_runtime.jsx)("div",{className:"relative z-10 min-h-screen",children:(0,jsx_runtime.jsx)(MonProfil,{})});var pages_mon_profil=MonProfilPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=6690)}),_N_E=__webpack_require__.O()}]);