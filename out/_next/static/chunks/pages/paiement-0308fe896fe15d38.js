(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[611],{9211:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/paiement",function(){return __webpack_require__(7934)}])},8655:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893);__webpack_require__(7294);let Spinner=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner-container",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner"})});__webpack_exports__.Z=Spinner},7934:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return paiement}});var jsx_runtime=__webpack_require__(5893),react=__webpack_require__(7294),stripe_esm=__webpack_require__(1291),react_stripe_umd=__webpack_require__(6664),next_router=__webpack_require__(1163),CartContext=__webpack_require__(4426),AuthContext=__webpack_require__(4642);let PaymentForm=param=>{let{onSuccessfulPayment,onFailedPayment}=param,stripe=(0,react_stripe_umd.useStripe)(),elements=(0,react_stripe_umd.useElements)(),[isProcessing,setIsProcessing]=(0,react.useState)(!1),[errorMessage,setErrorMessage]=(0,react.useState)(""),{cartItems,formatCartItemsForPayment}=(0,CartContext.jD)(),{user}=(0,react.useContext)(AuthContext.Vo),createPaymentIntent=async()=>{try{let formattedCartItems=formatCartItemsForPayment(),response=await fetch("/.netlify/functions/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:formattedCartItems,userUuid:user.uuid})}),data=await response.json();if(!response.ok)throw Error(data.error||"Erreur du serveur");return data.clientSecret}catch(error){throw console.error("Erreur lors de la cr\xe9ation de l’intention de paiement:",error),setErrorMessage(error.message),onFailedPayment&&onFailedPayment(error.message),error}},handleSubmit=async event=>{if(event.preventDefault(),!stripe||!elements){setErrorMessage("Stripe.js n’a pas encore \xe9t\xe9 charg\xe9!");return}setIsProcessing(!0),setErrorMessage("");try{let clientSecret=await createPaymentIntent(),cardElement=elements.getElement(react_stripe_umd.CardNumberElement),paymentResult=await stripe.confirmCardPayment(clientSecret,{payment_method:{card:cardElement}});if(paymentResult.error)setErrorMessage(paymentResult.error.message),onFailedPayment&&onFailedPayment(paymentResult.error.message);else if(paymentResult.paymentIntent&&"succeeded"===paymentResult.paymentIntent.status)onSuccessfulPayment&&onSuccessfulPayment(paymentResult.paymentIntent.id);else throw Error("Le paiement a \xe9chou\xe9 pour une raison inconnue.")}catch(error){console.error("Erreur de paiement:",error),setErrorMessage(error.message),onFailedPayment&&onFailedPayment(error.message)}finally{setIsProcessing(!1)}};return(0,jsx_runtime.jsx)("div",{className:"min-h-screen flex justify-center items-center",children:(0,jsx_runtime.jsxs)("div",{className:"bg-white p-8 rounded-lg shadow-xl max-w-md w-full",children:[(0,jsx_runtime.jsx)("h2",{className:"text-2xl font-semibold mb-6",children:"Mon Panier"}),(0,jsx_runtime.jsx)("ul",{className:"mb-6",children:cartItems.map(item=>(0,jsx_runtime.jsxs)("li",{className:"flex justify-between text-lg mb-2",children:[(0,jsx_runtime.jsxs)("span",{children:[item.name," - ",item.quantity]}),(0,jsx_runtime.jsxs)("span",{children:["$",(item.price/100).toFixed(2)]})]},item.id))}),(0,jsx_runtime.jsxs)("p",{className:"text-lg font-semibold mb-6",children:["Total \xe0 payer: $",(cartItems.reduce((total,item)=>total+item.quantity*item.price,0)/100).toFixed(2)]}),(0,jsx_runtime.jsxs)("form",{onSubmit:handleSubmit,className:"space-y-4",children:[errorMessage&&(0,jsx_runtime.jsx)("div",{className:"text-red-500",children:errorMessage}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"Num\xe9ro de la carte"}),(0,jsx_runtime.jsx)(react_stripe_umd.CardNumberElement,{className:"stripe-element p-2 border border-gray-300 rounded mt-1"})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"Date d'expiration"}),(0,jsx_runtime.jsx)(react_stripe_umd.CardExpiryElement,{className:"stripe-element p-2 border border-gray-300 rounded mt-1"})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"CVC"}),(0,jsx_runtime.jsx)(react_stripe_umd.CardCvcElement,{className:"stripe-element p-2 border border-gray-300 rounded mt-1"})]}),(0,jsx_runtime.jsx)("button",{type:"submit",disabled:!stripe||isProcessing,className:"w-full text-white font-bold py-2 px-4 rounded ".concat(!stripe||isProcessing?"bg-gray-400":"bg-blue-600 hover:bg-blue-700"),children:isProcessing?"Traitement...":"Payer"})]})]})})};var Spinner=__webpack_require__(8655);let stripePromise=(0,stripe_esm.J)("pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx"),PagePaiement=()=>{let[loading,setLoading]=(0,react.useState)(!0),{clearCart}=(0,CartContext.jD)(),router=(0,next_router.useRouter)();(0,react.useEffect)(()=>{stripePromise.then(()=>{setLoading(!1)}).catch(error=>{console.error("Erreur lors du chargement de Stripe:",error),setLoading(!1)})},[]);let onSuccessfulPayment=paymentIntentId=>{clearCart(),router.push("/paymentstatus?paymentStatus=succeeded&paymentIntentId=".concat(paymentIntentId))},onFailedPayment=message=>{console.error("Erreur de paiement:",message),router.push("/paymentstatus?paymentStatus=failed&message=".concat(encodeURIComponent(message)))};return loading?(0,jsx_runtime.jsx)(Spinner.Z,{}):(0,jsx_runtime.jsx)("div",{className:"relative z-10 min-h-screen",children:(0,jsx_runtime.jsx)(react_stripe_umd.Elements,{stripe:stripePromise,children:(0,jsx_runtime.jsx)("div",{className:"page-container",children:(0,jsx_runtime.jsx)(PaymentForm,{onSuccessfulPayment:onSuccessfulPayment,onFailedPayment:onFailedPayment})})})})};var paiement=PagePaiement}},function(__webpack_require__){__webpack_require__.O(0,[101,774,888,179],function(){return __webpack_require__(__webpack_require__.s=9211)}),_N_E=__webpack_require__.O()}]);