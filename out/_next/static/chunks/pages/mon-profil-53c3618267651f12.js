(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[866],{6690:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/mon-profil",function(){return __webpack_require__(7518)}])},7518:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return pages_mon_profil}});var jsx_runtime=__webpack_require__(5893),react=__webpack_require__(7294),motion=__webpack_require__(2020),AuthContext=__webpack_require__(4642);let MonProfil=()=>{let{user,userSubscriptions,handleResubscribe,handleCancelSubscription,errorMessage}=(0,react.useContext)(AuthContext.Vo),formatAmount=amount=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(amount);return user?(0,jsx_runtime.jsxs)("div",{className:"container mx-auto pt-16 p-4",children:[(0,jsx_runtime.jsx)("h1",{className:"text-2xl font-bold mb-4",children:"Mon Profil"}),(0,jsx_runtime.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-6 mb-6",children:[(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Nom :"})," ",user.name]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Email :"})," ",user.email]})]}),errorMessage&&(0,jsx_runtime.jsx)("p",{className:"text-red-500",children:errorMessage}),userSubscriptions.length>0?(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("h2",{className:"text-xl font-bold mb-4",children:"Abonnements"}),(0,jsx_runtime.jsx)("div",{className:"grid md:grid-cols-2 gap-4",children:userSubscriptions.map((subscription,index)=>(0,jsx_runtime.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-4",children:[(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Produit :"})," ",subscription.items]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Statut :"})," ",subscription.status]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Montant Prochain Paiement :"})," ",formatAmount(subscription.nextPaymentAmount)]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Date du Prochain Paiement :"})," ",new Date(subscription.nextPaymentDate).toLocaleDateString()]}),"active"===subscription.status?(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>handleCancelSubscription(subscription.subscriptionId),className:"bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700",children:"Se d\xe9sabonner"}):(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>handleResubscribe(subscription.subscriptionId),className:"bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-700",children:"Se r\xe9abonner"})]},index))})]}):(0,jsx_runtime.jsx)("p",{children:"Aucun abonnement trouv\xe9."})]}):(0,jsx_runtime.jsx)("div",{children:"Chargement..."})},buttonVariants={hover:{scale:1.1,textShadow:"0px 0px 8px rgb(255,255,255)",boxShadow:"0px 0px 8px rgb(255,255,255)",transition:{duration:.3}},initial:{scale:1}},MonProfilPage=()=>{let[activeSection,setActiveSection]=(0,react.useState)("profil");return(0,jsx_runtime.jsxs)("div",{className:"relative z-10 min-h-screen",children:[(0,jsx_runtime.jsxs)("div",{className:"flex justify-start space-x-4 p-4 bg-blue-500 text-white",children:[(0,jsx_runtime.jsx)(motion.E.button,{variants:buttonVariants,initial:"initial",whileHover:"hover",onClick:()=>setActiveSection("profil"),className:"hover:bg-blue-700",children:"Profil"}),(0,jsx_runtime.jsx)(motion.E.button,{variants:buttonVariants,initial:"initial",whileHover:"hover",onClick:()=>setActiveSection("creation"),className:"hover:bg-blue-700",children:"Cr\xe9ation de votre page"})]}),(()=>{switch(activeSection){case"profil":return(0,jsx_runtime.jsx)(MonProfil,{});case"creation":return(0,jsx_runtime.jsx)("div",{});default:return(0,jsx_runtime.jsx)("div",{children:"Section non trouv\xe9e"})}})()]})};var pages_mon_profil=MonProfilPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=6690)}),_N_E=__webpack_require__.O()}]);