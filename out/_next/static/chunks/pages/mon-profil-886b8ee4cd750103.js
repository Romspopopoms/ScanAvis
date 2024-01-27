(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[866],{6690:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/mon-profil",function(){return __webpack_require__(7518)}])},7518:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return pages_mon_profil}});var jsx_runtime=__webpack_require__(5893),components=__webpack_require__(5361),react=__webpack_require__(7294),AuthContext=__webpack_require__(4642);let MonProfil=()=>{let{user,logout}=(0,react.useContext)(AuthContext.Vo),[userPayments,setUserPayments]=(0,react.useState)([]),[loading,setLoading]=(0,react.useState)(!0),[error,setError]=(0,react.useState)("");return((0,react.useEffect)(()=>{let fetchPayments=async()=>{if(!user||!user.uuid){setLoading(!1),setError("Aucun utilisateur connect\xe9.");return}setLoading(!0);try{let response=await fetch("/.netlify/functions/getUserPayments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userUuid:user.uuid})});if(!response.ok)throw Error("Erreur HTTP ! Statut : ".concat(response.status));let data=await response.json();console.log(data),data.transactions&&data.transactions.length>0?setUserPayments(data.transactions):setError("Aucun paiement trouv\xe9.")}catch(fetchError){console.error("Erreur lors de la r\xe9cup\xe9ration des paiements utilisateur :",fetchError),setError("Erreur lors de la r\xe9cup\xe9ration des paiements.")}finally{setLoading(!1)}};fetchPayments()},[user]),loading)?(0,jsx_runtime.jsx)("div",{children:"Chargement de votre profil..."}):error?(0,jsx_runtime.jsxs)("div",{className:"profile-container",children:[(0,jsx_runtime.jsx)("h1",{children:"Mon Profil"}),(0,jsx_runtime.jsx)("p",{children:error}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:logout,children:"D\xe9connexion"})]}):(0,jsx_runtime.jsxs)("div",{className:"profile-container",children:[(0,jsx_runtime.jsx)("h1",{children:"Mon Profil"}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:logout,children:"D\xe9connexion"}),(0,jsx_runtime.jsxs)("div",{className:"profile-details",children:[(0,jsx_runtime.jsxs)("p",{children:["Nom: ",user.name]}),(0,jsx_runtime.jsxs)("p",{children:["Email: ",user.email]}),userPayments.length>0?(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("h2",{children:"Paiements"}),userPayments.map((payment,index)=>(0,jsx_runtime.jsxs)("div",{className:"payment-details",children:[(0,jsx_runtime.jsxs)("p",{children:["Transaction ID: ",payment.transactionId]}),(0,jsx_runtime.jsxs)("p",{children:["Articles: ",payment.items.map(item=>"ID: ".concat(item.id,", Quantit\xe9: ").concat(item.quantity)).join(", ")]}),(0,jsx_runtime.jsxs)("p",{children:["Montant Total: ",payment.totalAmount]}),(0,jsx_runtime.jsxs)("p",{children:["Date: ",new Date(payment.createdAt).toLocaleDateString()]})]},index))]}):(0,jsx_runtime.jsx)("p",{children:"Aucun paiement trouv\xe9."})]})]})},MonProfilPage=()=>(0,jsx_runtime.jsxs)("div",{className:"relative z-10 min-h-screen",children:[(0,jsx_runtime.jsx)(components.wp,{}),(0,jsx_runtime.jsx)(MonProfil,{}),(0,jsx_runtime.jsx)(components.$_,{})]});var pages_mon_profil=MonProfilPage}},function(__webpack_require__){__webpack_require__.O(0,[361,774,888,179],function(){return __webpack_require__(__webpack_require__.s=6690)}),_N_E=__webpack_require__.O()}]);