(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[611],{9211:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/paiement",function(){return __webpack_require__(7934)}])},7127:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),framer_motion__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(2020),_constants__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(8392),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(9176),_utils_motion__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(621);let Footer=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_4__.E.footer,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_3__.FT,initial:"hidden",whileInView:"show",className:"".concat(_styles__WEBPACK_IMPORTED_MODULE_2__.Z.xPaddings," py-8 relative"),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"footer-gradient"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"".concat(_styles__WEBPACK_IMPORTED_MODULE_2__.Z.innerWidth," mx-auto flex flex-col gap-8"),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-5",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4",{className:"font-bold md:text-[64px] text-[44px] text-white",children:"ADOPTEZ LA NOUVEAUT\xc9"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button",{type:"button",className:"flex items-center h-fit py-4 px-6 bg-[#25618B] rounded-[32px] gap-[12px]",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:"/scan.png",alt:"headset",className:"w-[24px] h-[24px] object-contain"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"font-normal text-[16px] text-white",children:"Choisissez le nouveau monde"})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex flex-col",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"mb-[50px] h-[2px] bg-white opacity-10"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-4",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4",{className:"font-extrabold text-[24px] text-white",children:"SCAN'AVIS"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{className:"font-normal text-[14px] text-white opacity-50",children:"Copyright \xa9 2024 Scan'Avis. Tout droits r\xe9serv\xe9s."}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex gap-4",children:_constants__WEBPACK_IMPORTED_MODULE_1__.UY.map(social=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:social.url,alt:social.name,className:"w-[24px] h-[24px] object-contain cursor-pointer"},social.name))})]})]})]})]});__webpack_exports__.Z=Footer},8095:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return components_Navbar}});var jsx_runtime=__webpack_require__(5893),react=__webpack_require__(7294),motion=__webpack_require__(2020),next_link=__webpack_require__(1664),link_default=__webpack_require__.n(next_link),CartSummary=__webpack_require__(9723),AuthContext=__webpack_require__(4642);let LoginButton=()=>{let{getAuthUrl}=(0,react.useContext)(AuthContext.Vo);return(0,jsx_runtime.jsx)("button",{type:"button",onClick:getAuthUrl,style:{cursor:"pointer"},children:"Se connecter avec Google"})},LogoutButton=()=>{let{logout}=(0,react.useContext)(AuthContext.Vo);return(0,jsx_runtime.jsx)("button",{type:"button",onClick:logout,style:{cursor:"pointer"},children:"D\xe9connexion"})},Navbar=()=>{let[isMenuOpen,setIsMenuOpen]=(0,react.useState)(!1),[isCartOpen,setIsCartOpen]=(0,react.useState)(!1),{isAuthenticated}=(0,react.useContext)(AuthContext.Vo),handleToggleMenu=()=>setIsMenuOpen(!isMenuOpen),toggleCart=()=>setIsCartOpen(!isCartOpen);return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsxs)("nav",{className:"fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-gray-900 text-white z-50",children:[(0,jsx_runtime.jsx)("h2",{className:"font-extrabold text-2xl",children:(0,jsx_runtime.jsx)(link_default(),{href:"/",children:"SCAN'AVIS"})}),(0,jsx_runtime.jsxs)("div",{className:"flex items-center",children:[isAuthenticated?(0,jsx_runtime.jsx)(LogoutButton,{}):(0,jsx_runtime.jsx)(LoginButton,{}),(0,jsx_runtime.jsxs)("div",{onClick:toggleCart,className:"relative cursor-pointer ml-4",children:[(0,jsx_runtime.jsx)("img",{src:"/cart-icon.svg",alt:"Cart",style:{width:"24px",height:"24px"}}),(0,jsx_runtime.jsx)("span",{className:"absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"})]}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:handleToggleMenu,className:"ml-4",children:(0,jsx_runtime.jsx)("img",{src:"/menu.svg",alt:"Menu",style:{width:"24px",height:"24px"}})})]}),(0,jsx_runtime.jsxs)(motion.E.div,{initial:"closed",animate:isMenuOpen?"open":"closed",variants:{open:{x:0},closed:{x:"-100%"}},className:"fixed top-0 left-0 w-[250px] h-full bg-gray-800 shadow-lg z-40",children:[(0,jsx_runtime.jsx)("button",{type:"button",onClick:handleToggleMenu,children:"Fermer"}),isAuthenticated&&(0,jsx_runtime.jsx)(link_default(),{href:"/mon-profil",children:"Mon Profil"}),(0,jsx_runtime.jsx)(link_default(),{href:"/",children:"Accueil"}),(0,jsx_runtime.jsx)(link_default(),{href:"/tarifs",children:"Nos offres"})]})]}),isCartOpen&&(0,jsx_runtime.jsx)(CartSummary.Z,{isCartOpen:isCartOpen,toggleCart:toggleCart})]})};var components_Navbar=Navbar},8655:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893);__webpack_require__(7294);let Spinner=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner-container",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner"})});__webpack_exports__.Z=Spinner},8392:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{UY:function(){return socials},gw:function(){return newFeatures},nw:function(){return exploreWorlds},pT:function(){return startingFeatures}});let exploreWorlds=[{id:"world-1",imgUrl:"/planet-01.png",title:"FORMULE STARTER",sectionId:"world-1"},{id:"world-2",imgUrl:"/planet-02.png",title:"OPTION BRONZE",sectionId:"world-2"},{id:"world-3",imgUrl:"/planet-03.png",title:"OPTION SILVER",sectionId:"world-3"},{id:"world-4",imgUrl:"/planet-04.png",title:"OPTION GOLD",sectionId:"world-4"}],startingFeatures=["Inscrivez-vous et connectez-vous \xe0 votre compte","Souscrivez a la formule de votre choix","Recevez votre QR code, et vos fonctionnalit\xe9s"],newFeatures=[{imgUrl:"/web.png",title:"Acc\xe9dez \xe0 un nouveau monde",subtitle:"Un nouveau monde s’ouvre \xe0 vous, avec de nouvelles possibilit\xe9s"},{imgUrl:"/scan.png",title:"D\xe9cuplez vos avis",subtitle:"Un lien suppl\xe9mentaire avec vos clients, qui vous assure un rendement plus important"}],socials=[{name:"twitter",url:"/twitter.svg"},{name:"linkedin",url:"/linkedin.svg"},{name:"instagram",url:"/instagram.svg"},{name:"facebook",url:"/facebook.svg"}]},7934:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return paiement}});var jsx_runtime=__webpack_require__(5893),react=__webpack_require__(7294),stripe_esm=__webpack_require__(1291),react_stripe_umd=__webpack_require__(6664),next_router=__webpack_require__(1163),CartContext=__webpack_require__(4426);let PaymentForm=param=>{let{onSuccessfulPayment,onFailedPayment}=param,stripe=(0,react_stripe_umd.useStripe)(),elements=(0,react_stripe_umd.useElements)(),[isProcessing,setIsProcessing]=(0,react.useState)(!1),[errorMessage,setErrorMessage]=(0,react.useState)(""),{cartItems,formatCartItemsForPayment}=(0,CartContext.jD)(),createPaymentIntent=async()=>{try{let formattedCartItems=formatCartItemsForPayment(),response=await fetch("/.netlify/functions/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:formattedCartItems})}),data=await response.json();if(!response.ok)throw Error(data.error||"Erreur du serveur");return data.clientSecret}catch(error){throw console.error("Erreur lors de la cr\xe9ation de l’intention de paiement:",error),setErrorMessage(error.message),onFailedPayment&&onFailedPayment(error.message),error}},handleSubmit=async event=>{if(event.preventDefault(),!stripe||!elements){setErrorMessage("Stripe.js n’a pas encore \xe9t\xe9 charg\xe9!");return}setIsProcessing(!0),setErrorMessage("");try{let clientSecret=await createPaymentIntent(),cardElement=elements.getElement(react_stripe_umd.CardNumberElement),paymentResult=await stripe.confirmCardPayment(clientSecret,{payment_method:{card:cardElement}});if(paymentResult.error)setErrorMessage(paymentResult.error.message),onFailedPayment&&onFailedPayment(paymentResult.error.message);else if(paymentResult.paymentIntent&&"succeeded"===paymentResult.paymentIntent.status)onSuccessfulPayment&&onSuccessfulPayment(paymentResult.paymentIntent.id);else throw Error("Le paiement a \xe9chou\xe9 pour une raison inconnue.")}catch(error){console.error("Erreur de paiement:",error),setErrorMessage(error.message),onFailedPayment&&onFailedPayment(error.message)}finally{setIsProcessing(!1)}};return(0,jsx_runtime.jsxs)("div",{className:"payment-form",children:[(0,jsx_runtime.jsxs)("div",{className:"payment-details",children:[(0,jsx_runtime.jsx)("h2",{children:"Mon Panier"}),(0,jsx_runtime.jsx)("ul",{children:cartItems.map(item=>(0,jsx_runtime.jsxs)("li",{children:[item.name," - ",item.quantity," x $",(item.price/100).toFixed(2)]},item.id))}),(0,jsx_runtime.jsxs)("p",{className:"cart-total",children:["Total \xe0 payer: $",(cartItems.reduce((total,item)=>total+item.quantity*item.price,0)/100).toFixed(2)]})]}),(0,jsx_runtime.jsxs)("form",{onSubmit:handleSubmit,children:[errorMessage&&(0,jsx_runtime.jsx)("div",{className:"error-message",children:errorMessage}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{children:"Num\xe9ro de la carte"}),(0,jsx_runtime.jsx)(react_stripe_umd.CardNumberElement,{className:"stripe-element"})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{children:"Date d'expiration"}),(0,jsx_runtime.jsx)(react_stripe_umd.CardExpiryElement,{className:"stripe-element"})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{children:"CVC"}),(0,jsx_runtime.jsx)(react_stripe_umd.CardCvcElement,{className:"stripe-element"})]}),(0,jsx_runtime.jsx)("button",{type:"submit",disabled:!stripe||isProcessing,children:isProcessing?"Traitement...":"Payer"})]})]})};var Navbar=__webpack_require__(8095),Footer=__webpack_require__(7127),Spinner=__webpack_require__(8655);let stripePromise=(0,stripe_esm.J)("pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx"),PagePaiement=()=>{let[loading,setLoading]=(0,react.useState)(!0),{clearCart}=(0,CartContext.jD)(),router=(0,next_router.useRouter)();(0,react.useEffect)(()=>{stripePromise.then(()=>{setLoading(!1)}).catch(error=>{console.error("Erreur lors du chargement de Stripe:",error),setLoading(!1)})},[]);let onSuccessfulPayment=paymentIntentId=>{clearCart(),router.push("/paymentstatus?paymentStatus=succeeded&paymentIntentId=".concat(paymentIntentId))},onFailedPayment=message=>{console.error("Erreur de paiement:",message),router.push("/paymentstatus?paymentStatus=failed&message=".concat(encodeURIComponent(message)))};return loading?(0,jsx_runtime.jsx)(Spinner.Z,{}):(0,jsx_runtime.jsxs)("div",{className:"relative z-10 min-h-screen",children:[(0,jsx_runtime.jsx)(Navbar.Z,{}),(0,jsx_runtime.jsx)(react_stripe_umd.Elements,{stripe:stripePromise,children:(0,jsx_runtime.jsx)("div",{className:"page-container",children:(0,jsx_runtime.jsx)(PaymentForm,{onSuccessfulPayment:onSuccessfulPayment,onFailedPayment:onFailedPayment})})}),(0,jsx_runtime.jsx)(Footer.Z,{})]})};var paiement=PagePaiement},9176:function(__unused_webpack_module,__webpack_exports__){"use strict";__webpack_exports__.Z={innerWidth:"2xl:max-w-[1280px] w-full",interWidth:"lg:w-[80%] w-[100%]",paddings:"sm:p-16 xs:p-8 px-6 py-12",yPaddings:"sm:py-16 xs:py-8 py-12",xPaddings:"sm:px-16 px-6",topPaddings:"sm:pt-16 xs:pt-8 pt-12",bottomPaddings:"sm:pb-16 xs:pb-8 pb-12",flexCenter:"flex justify-center items-center",flexStart:"flex justify-start items-start",flexEnd:"flex justify-end",navPadding:"pt-[98px]",heroHeading:"font-bold lg:text-[100px] md:text-[100px] sm:text-[60px] text-[44px] lg:leading-[158.4px] md:leading-[114.4px] sm:leading-[74.4px] leading-[64.4px] uppercase text-white",heroDText:"md:w-[212px] sm:w-[80px] w-[60px] md:h-[108px] sm:h-[48px] h-[38px] md:border-[18px] border-[9px] rounded-r-[50px] border-white sm:mx-2 mx-[6px]"}},621:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{AR:function(){return textContainer},FT:function(){return footerVariants},Ji:function(){return fadeIn},Jm:function(){return staggerContainer},Ym:function(){return slideIn},lM:function(){return textVariant2},vk:function(){return planetVariants},wt:function(){return textVariant}});let slideIn=(direction,type,delay,duration)=>({hidden:{x:"left"===direction?"-100%":"right"===direction?"100%":0,y:"up"===direction?"100%":"down"===direction?"100%":0},show:{x:0,y:0,transition:{type,delay,duration,ease:"easeOut"}}}),staggerContainer=(staggerChildren,delayChildren)=>({hidden:{},show:{transition:{staggerChildren,delayChildren}}}),textVariant=delay=>({hidden:{y:50,opacity:0},show:{y:0,opacity:1,transition:{type:"spring",duration:1.25,delay}}}),textContainer={hidden:{opacity:0},show:function(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return{opacity:1,transition:{staggerChildren:.1,delayChildren:.1*i}}}},textVariant2={hidden:{opacity:0,y:20},show:{opacity:1,y:0,transition:{type:"tween",ease:"easeIn"}}},fadeIn=(direction,type,delay,duration)=>({hidden:{x:"left"===direction?100:"right"===direction?-100:0,y:"up"===direction?100:"down"===direction?-100:0,opacity:0},show:{x:0,y:0,opacity:1,transition:{type,delay,duration,ease:"easeOut"}}}),planetVariants=direction=>({hidden:{x:"left"===direction?"-100%":"100%",rotate:120},show:{x:0,rotate:0,transition:{type:"spring",duration:1.8,delay:.5}}}),footerVariants={hidden:{opacity:0,y:50,transition:{type:"spring",stiffness:300,damping:140}},show:{opacity:1,y:0,transition:{type:"spring",stiffness:80,delay:.5}}}}},function(__webpack_require__){__webpack_require__.O(0,[101,774,888,179],function(){return __webpack_require__(__webpack_require__.s=9211)}),_N_E=__webpack_require__.O()}]);