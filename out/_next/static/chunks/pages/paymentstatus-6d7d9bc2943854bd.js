(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[378],{1848:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/paymentstatus",function(){return __webpack_require__(7124)}])},8655:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893);__webpack_require__(7294);let Spinner=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner-container",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner"})});__webpack_exports__.Z=Spinner},7124:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893);__webpack_require__(7294);var next_link__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(1664),next_link__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__),_context_PaymentContext__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(6728),_components_Spinner__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(8655);let PaymentStatusPage=()=>{var ref,_subscriptionId,ref1,_serviceName;let{paymentStatus,paymentMessage,paymentDetails}=(0,_context_PaymentContext__WEBPACK_IMPORTED_MODULE_3__.V)();return(console.log("Payment Status:",paymentStatus),console.log("Payment Message:",paymentMessage),console.log("Payment Details in PaymentStatusPage:",paymentDetails),paymentStatus&&"loading"!==paymentStatus)?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"min-h-screen flex justify-center items-center p-4",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"max-w-lg w-full bg-white shadow-xl rounded-lg p-8",children:["failed"===paymentStatus&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"text-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2",{className:"text-xl font-bold text-red-600 mb-4",children:"Oups !"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"mb-4",children:["Erreur : ",paymentMessage]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/paiement",className:"inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200",children:"R\xe9essayer le paiement"})]}),"succeeded"===paymentStatus&&paymentDetails&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"text-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{className:"text-2xl font-bold text-green-600 mb-4",children:"Merci pour votre achat !"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{className:"mb-4",children:"Votre transaction a \xe9t\xe9 r\xe9alis\xe9e avec succ\xe8s."}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"text-left",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"font-semibold",children:["ID de souscription : ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"font-normal",children:null!==(_subscriptionId=paymentDetails.subscriptionId)&&void 0!==_subscriptionId?_subscriptionId:"Non disponible"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"font-semibold",children:["Montant : ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span",{className:"font-normal",children:["$",null!==(ref1=null===(ref=paymentDetails.amount)||void 0===ref?void 0:ref.toFixed(2))&&void 0!==ref1?ref1:"Non disponible"]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"font-semibold",children:["Nom du service : ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"font-normal",children:null!==(_serviceName=paymentDetails.serviceName)&&void 0!==_serviceName?_serviceName:"Non disponible"})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/",className:"inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200 mt-4",children:"Retour \xe0 l'accueil"})]}),"failed"!==paymentStatus&&"succeeded"!==paymentStatus&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"text-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2",{className:"text-xl font-bold text-yellow-500 mb-4",children:"Statut de Paiement Inconnu"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{className:"mb-4",children:"Acc\xe8s non autoris\xe9 \xe0 cette page ou param\xe8tre manquant."}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/",className:"inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200",children:"Retour \xe0 l'accueil"})]})]})}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Spinner__WEBPACK_IMPORTED_MODULE_4__.Z,{})};__webpack_exports__.default=PaymentStatusPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=1848)}),_N_E=__webpack_require__.O()}]);