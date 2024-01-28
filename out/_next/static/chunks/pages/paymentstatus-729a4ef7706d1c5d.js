(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[378],{1848:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/paymentstatus",function(){return __webpack_require__(7124)}])},7127:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),framer_motion__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(2020),_constants__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(8392),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(9176),_utils_motion__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(621);let Footer=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_4__.E.footer,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_3__.FT,initial:"hidden",whileInView:"show",className:"".concat(_styles__WEBPACK_IMPORTED_MODULE_2__.Z.xPaddings," py-8 relative"),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"footer-gradient"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"".concat(_styles__WEBPACK_IMPORTED_MODULE_2__.Z.innerWidth," mx-auto flex flex-col gap-8"),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-5",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4",{className:"font-bold md:text-[64px] text-[44px] text-white",children:"ADOPTEZ LA NOUVEAUT\xc9"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button",{type:"button",className:"flex items-center h-fit py-4 px-6 bg-[#25618B] rounded-[32px] gap-[12px]",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:"/scan.png",alt:"headset",className:"w-[24px] h-[24px] object-contain"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"font-normal text-[16px] text-white",children:"Choisissez le nouveau monde"})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex flex-col",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"mb-[50px] h-[2px] bg-white opacity-10"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-4",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4",{className:"font-extrabold text-[24px] text-white",children:"SCAN'AVIS"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{className:"font-normal text-[14px] text-white opacity-50",children:"Copyright \xa9 2024 Scan'Avis. Tout droits r\xe9serv\xe9s."}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex gap-4",children:_constants__WEBPACK_IMPORTED_MODULE_1__.UY.map(social=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:social.url,alt:social.name,className:"w-[24px] h-[24px] object-contain cursor-pointer"},social.name))})]})]})]})]});__webpack_exports__.Z=Footer},2787:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),framer_motion__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(2020),next_link__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(1664),next_link__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__),_CartSummary__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(9723),_context_AuthContext__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(4642);let Navbar=()=>{let[isMenuOpen,setIsMenuOpen]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),[isCartOpen,setIsCartOpen]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),[navbarHeight,setNavbarHeight]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0),navbarRef=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(),{isAuthenticated,logout}=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_4__.Vo),handleToggleMenu=()=>setIsMenuOpen(!isMenuOpen),toggleCart=()=>setIsCartOpen(!isCartOpen);return(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{navbarRef.current&&setNavbarHeight(navbarRef.current.offsetHeight)},[navbarRef]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav",{ref:navbarRef,className:"fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-gray-900 text-white z-50",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2",{className:"font-extrabold text-2xl",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/",children:"SCAN'AVIS"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center",children:[isAuthenticated?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",onClick:logout,className:"px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded text-white","aria-label":"D\xe9connexion",children:"D\xe9connexion"}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/login",className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white",children:"Se connecter"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{onClick:toggleCart,className:"relative cursor-pointer ml-4",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:"/cart-icon.svg",alt:"Cart",className:"w-6 h-6"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",onClick:handleToggleMenu,className:"ml-4","aria-label":"Menu",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:"/menu.svg",alt:"Menu",className:"w-6 h-6"})})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_5__.E.div,{initial:"closed",animate:isMenuOpen?"open":"closed",variants:{open:{x:0},closed:{x:"-100%"}},className:"fixed left-0 w-64 bg-gray-800 text-white shadow-xl z-40 p-5",style:{top:"".concat(navbarHeight,"px")},transition:{type:"spring",stiffness:260,damping:20},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex justify-end -mt-12 mr-4",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",onClick:handleToggleMenu,className:"text-white","aria-label":"Fermer",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:"/iconarrow.png",alt:"Fermer",className:"w-6 h-6"})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"space-y-4",children:[isAuthenticated&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/mon-profil",className:"block hover:text-gray-300",children:"Mon Profil"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/",className:"block hover:text-gray-300",children:"Accueil"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_2___default(),{href:"/tarifs",className:"block hover:text-gray-300",children:"Nos offres"})]})]}),isCartOpen&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_CartSummary__WEBPACK_IMPORTED_MODULE_3__.Z,{isCartOpen:isCartOpen,toggleCart:toggleCart})]})};__webpack_exports__.Z=Navbar},8655:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893);__webpack_require__(7294);let Spinner=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner-container",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"spinner"})});__webpack_exports__.Z=Spinner},8392:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{UY:function(){return socials},gw:function(){return newFeatures},nw:function(){return exploreWorlds},pT:function(){return startingFeatures}});let exploreWorlds=[{id:"world-1",imgUrl:"/planet-01.png",title:"FORMULE STARTER",sectionId:"world-1"},{id:"world-2",imgUrl:"/planet-02.png",title:"OPTION BRONZE",sectionId:"world-2"},{id:"world-3",imgUrl:"/planet-03.png",title:"OPTION SILVER",sectionId:"world-3"},{id:"world-4",imgUrl:"/planet-04.png",title:"OPTION GOLD",sectionId:"world-4"}],startingFeatures=["Inscrivez-vous et connectez-vous \xe0 votre compte","Souscrivez a la formule de votre choix","Recevez votre QR code, et vos fonctionnalit\xe9s"],newFeatures=[{imgUrl:"/web.png",title:"Acc\xe9dez \xe0 un nouveau monde",subtitle:"Un nouveau monde s’ouvre \xe0 vous, avec de nouvelles possibilit\xe9s"},{imgUrl:"/scan.png",title:"D\xe9cuplez vos avis",subtitle:"Un lien suppl\xe9mentaire avec vos clients, qui vous assure un rendement plus important"}],socials=[{name:"twitter",url:"/twitter.svg"},{name:"linkedin",url:"/linkedin.svg"},{name:"instagram",url:"/instagram.svg"},{name:"facebook",url:"/facebook.svg"}]},7124:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),next_router__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(1163),next_link__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(1664),next_link__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__),_components_Navbar__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(2787),_components_Footer__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(7127),_components_Spinner__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(8655);let PaymentStatusPage=()=>{let router=(0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)(),{paymentStatus,paymentIntentId}=router.query,[transaction,setTransaction]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),[loading,setLoading]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0),[error,setError]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");return((0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{let fetchTransactionDetails=async()=>{if("succeeded"!==paymentStatus||!paymentIntentId){setLoading(!1);return}try{let response=await fetch("/.netlify/functions/get-transaction?paymentIntentId=".concat(paymentIntentId));if(!response.ok)throw Error("Erreur HTTP ! Statut : ".concat(response.status));let data=await response.json();if(!data.transaction)throw Error("Aucune donn\xe9e de transaction re\xe7ue");setTransaction(data.transaction)}catch(err){console.error("Erreur lors de la r\xe9cup\xe9ration de la transaction:",err),setError("\xc9chec de la r\xe9cup\xe9ration des donn\xe9es de transaction")}finally{setLoading(!1)}};fetchTransactionDetails()},[paymentStatus,paymentIntentId]),loading)?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Spinner__WEBPACK_IMPORTED_MODULE_6__.Z,{}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"page-container",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Navbar__WEBPACK_IMPORTED_MODULE_4__.Z,{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"payment-status-main",children:error?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"message-container error-message",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2",{children:"Oups !"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:["Erreur : ",error]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3___default(),{href:"/",passHref:!0,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",className:"btn btn-primary",children:"Retour \xe0 l'accueil"})})]}):paymentStatus&&"failed"!==paymentStatus?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"message-container success-message",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{children:"Merci pour votre achat !"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{children:"Votre transaction a \xe9t\xe9 r\xe9alis\xe9e avec succ\xe8s."}),transaction&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:["ID de transaction : ",transaction.transactionId]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:["Montant : $",(transaction.totalAmount/100).toFixed(2)]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:["Date de cr\xe9ation : ",new Date(transaction.createdAt).toLocaleString()]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{children:"Articles :"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul",{children:transaction.items.map((item,index)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li",{children:[item.name," - Quantit\xe9 : ",item.quantity," - Prix : $",(item.price/100).toFixed(2)]},index))})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3___default(),{href:"/",passHref:!0,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",className:"btn btn-success",children:"Retour \xe0 l'accueil"})})]}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"message-container error-message",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2",{children:"Statut de Paiement Inconnu"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{children:"Acc\xe8s non autoris\xe9 \xe0 cette page ou param\xe8tre manquant."}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3___default(),{href:"/",passHref:!0,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",className:"btn btn-secondary",children:"Retour \xe0 l'accueil"})})]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Footer__WEBPACK_IMPORTED_MODULE_5__.Z,{})]})};__webpack_exports__.default=PaymentStatusPage},9176:function(__unused_webpack_module,__webpack_exports__){"use strict";__webpack_exports__.Z={innerWidth:"2xl:max-w-[1280px] w-full",interWidth:"lg:w-[80%] w-[100%]",paddings:"sm:p-16 xs:p-8 px-6 py-12",yPaddings:"sm:py-16 xs:py-8 py-12",xPaddings:"sm:px-16 px-6",topPaddings:"sm:pt-16 xs:pt-8 pt-12",bottomPaddings:"sm:pb-16 xs:pb-8 pb-12",flexCenter:"flex justify-center items-center",flexStart:"flex justify-start items-start",flexEnd:"flex justify-end",navPadding:"pt-[98px]",heroHeading:"font-bold lg:text-[100px] md:text-[100px] sm:text-[60px] text-[44px] lg:leading-[158.4px] md:leading-[114.4px] sm:leading-[74.4px] leading-[64.4px] uppercase text-white",heroDText:"md:w-[212px] sm:w-[80px] w-[60px] md:h-[108px] sm:h-[48px] h-[38px] md:border-[18px] border-[9px] rounded-r-[50px] border-white sm:mx-2 mx-[6px]"}},621:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{AR:function(){return textContainer},FT:function(){return footerVariants},Ji:function(){return fadeIn},Jm:function(){return staggerContainer},Ym:function(){return slideIn},lM:function(){return textVariant2},vk:function(){return planetVariants},wt:function(){return textVariant}});let slideIn=(direction,type,delay,duration)=>({hidden:{x:"left"===direction?"-100%":"right"===direction?"100%":0,y:"up"===direction?"100%":"down"===direction?"100%":0},show:{x:0,y:0,transition:{type,delay,duration,ease:"easeOut"}}}),staggerContainer=(staggerChildren,delayChildren)=>({hidden:{},show:{transition:{staggerChildren,delayChildren}}}),textVariant=delay=>({hidden:{y:50,opacity:0},show:{y:0,opacity:1,transition:{type:"spring",duration:1.25,delay}}}),textContainer={hidden:{opacity:0},show:function(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return{opacity:1,transition:{staggerChildren:.1,delayChildren:.1*i}}}},textVariant2={hidden:{opacity:0,y:20},show:{opacity:1,y:0,transition:{type:"tween",ease:"easeIn"}}},fadeIn=(direction,type,delay,duration)=>({hidden:{x:"left"===direction?100:"right"===direction?-100:0,y:"up"===direction?100:"down"===direction?-100:0,opacity:0},show:{x:0,y:0,opacity:1,transition:{type,delay,duration,ease:"easeOut"}}}),planetVariants=direction=>({hidden:{x:"left"===direction?"-100%":"100%",rotate:120},show:{x:0,rotate:0,transition:{type:"spring",duration:1.8,delay:.5}}}),footerVariants={hidden:{opacity:0,y:50,transition:{type:"spring",stiffness:300,damping:140}},show:{opacity:1,y:0,transition:{type:"spring",stiffness:80,delay:.5}}}}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=1848)}),_N_E=__webpack_require__.O()}]);