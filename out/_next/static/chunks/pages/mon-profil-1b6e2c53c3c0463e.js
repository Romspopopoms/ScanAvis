(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[866],{6690:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/mon-profil",function(){return __webpack_require__(7518)}])},2169:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{e:function(){return TitleText},g:function(){return TypingText}});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),framer_motion__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2020),_utils_motion__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(621);let TypingText=param=>{let{title,textStyles}=param;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.E.p,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_1__.AR,className:"font-normal text-[14px] text-secondary-white ".concat(textStyles),children:Array.from(title).map((letter,index)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.E.span,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_1__.lM,children:" "===letter?"\xa0":letter},index))})},TitleText=param=>{let{title,textStyles}=param;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.E.h2,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_1__.lM,initial:"hidden",whileInView:"show",className:"mt-[8px] font-bold md:text-[64px] text-[40px] text-white ".concat(textStyles),children:title})}},5361:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{NM:function(){return components_ExploreCard},$_:function(){return Footer.Z},wp:function(){return Navbar.Z},Oz:function(){return components_NewFeatures},dy:function(){return components_StartSteps},eN:function(){return CustomTexts.e},gw:function(){return CustomTexts.g}});var Navbar=__webpack_require__(2787),CustomTexts=__webpack_require__(2169),jsx_runtime=__webpack_require__(5893),next_link=__webpack_require__(1664),link_default=__webpack_require__.n(next_link),react=__webpack_require__(7294),dom_motion=__webpack_require__(2020),styles=__webpack_require__(9176),utils_motion=__webpack_require__(621);let ExploreCard=param=>{let{id,imgUrl,title,index,active,handleClick,sectionId}=param,[isMounted,setIsMounted]=(0,react.useState)(!1);return(0,react.useEffect)(()=>{setIsMounted(!0)},[]),(0,jsx_runtime.jsxs)(dom_motion.E.div,{variants:(0,utils_motion.Ji)("right","spring",.5*index,.75),className:"relative ".concat(active===id?"lg:flex-[3.5] flex-[10]":"lg:flex-[0.5] flex-[2]"," group flex items-center justify-center min-w-[170px] h-[700px] transition-[flex] duration-[0.7s] ease-out-flex cursor-pointer"),onClick:()=>handleClick(id),children:[(0,jsx_runtime.jsx)("img",{src:imgUrl,alt:title,className:"absolute w-full h-full object-cover rounded-[24px]"}),active!==id?(0,jsx_runtime.jsx)("h3",{className:"font-semibold sm:text-[26px] text-[18px] text-white absolute z-10 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0]",children:title}):(0,jsx_runtime.jsxs)("div",{className:"absolute bottom-0 p-8 flex justify-start w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-b-[24px]",children:[(0,jsx_runtime.jsx)("div",{className:"".concat(styles.Z.flexCenter," w-[60px] h-[60px] rounded-[24px] glassmorphism mb-[16px]"),children:(0,jsx_runtime.jsx)("img",{src:"/scan.png",alt:"scan",className:"w-1/2 h-1/2 object-contain"})}),(0,jsx_runtime.jsx)("p",{className:"font-normal text-[16px] leading-[20.16px] text-white uppercase",children:"Amorcez le changement"}),(0,jsx_runtime.jsx)("h2",{className:"mt-[24px] font-semibold sm:text-[32px] text-[24px] text-white",children:title}),isMounted&&(0,jsx_runtime.jsx)(link_default(),{href:"/tarifs#".concat(sectionId),legacyBehavior:!0,children:(0,jsx_runtime.jsx)("a",{className:"opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-10 right-10",children:"En savoir plus"})})]})]})};var components_ExploreCard=ExploreCard;let StartSteps=param=>{let{number,text}=param;return(0,jsx_runtime.jsxs)("div",{className:"".concat(styles.Z.flexCenter," flex-row"),children:[(0,jsx_runtime.jsx)("div",{className:"".concat(styles.Z.flexCenter," w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]"),children:(0,jsx_runtime.jsx)("p",{className:"font-bold text-[20px] text-white",children:number})}),(0,jsx_runtime.jsx)("p",{className:"flex-1 ml-[30px] font-normal text-[18px] text-[#B0B0B0] leading-[32.4px]",children:text})]})};var components_StartSteps=StartSteps;let NewFeatures=param=>{let{imgUrl,title,subtitle}=param;return(0,jsx_runtime.jsxs)("div",{className:"flex-1 flex flex-col sm:max-w-[250px] min-w-[210px]",children:[(0,jsx_runtime.jsx)("div",{className:"".concat(styles.Z.flexCenter," w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]"),children:(0,jsx_runtime.jsx)("img",{src:imgUrl,alt:"icon",className:"w-1/2 h-1/2 object-contain"})}),(0,jsx_runtime.jsx)("h1",{className:"mt-[26px] font-bold text-[24px] leading-[30.24px] text-white",children:title}),(0,jsx_runtime.jsx)("p",{className:"flex-1 mt-[16px] font-normal text-[18px] text-[#B0B0B0] leading-[32.4px]",children:subtitle})]})};var components_NewFeatures=NewFeatures,Footer=__webpack_require__(7127)},7518:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return pages_mon_profil}});var jsx_runtime=__webpack_require__(5893),components=__webpack_require__(5361),react=__webpack_require__(7294),AuthContext=__webpack_require__(4642);let MonProfil=()=>{let{user}=(0,react.useContext)(AuthContext.Vo),[userPayments,setUserPayments]=(0,react.useState)([]),[loading,setLoading]=(0,react.useState)(!0),[error,setError]=(0,react.useState)("");return((0,react.useEffect)(()=>{let fetchPayments=async()=>{try{let response=await fetch("/.netlify/functions/getUserPayments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userUuid:user.uuid})});if(!response.ok)throw Error("Erreur HTTP ! Statut : ".concat(response.status));let data=await response.json();if(data.transactions&&"string"==typeof data.transactions.body){let transactionsObject=JSON.parse(data.transactions.body);transactionsObject.transactions&&transactionsObject.transactions.length>0?setUserPayments(transactionsObject.transactions):setError("Aucun paiement trouv\xe9.")}else setError("R\xe9ponse inattendue du serveur.")}catch(fetchError){console.error("Erreur lors de la r\xe9cup\xe9ration des paiements utilisateur :",fetchError),setError("Erreur lors de la r\xe9cup\xe9ration des paiements : ".concat(fetchError.message))}finally{setLoading(!1)}};fetchPayments()},[user]),loading)?(0,jsx_runtime.jsx)("div",{className:"text-center mt-10",children:"Chargement de votre profil..."}):error?(0,jsx_runtime.jsxs)("div",{className:"container mx-auto p-4",children:[(0,jsx_runtime.jsx)("h1",{className:"text-2xl font-bold mb-4",children:"Mon Profil"}),(0,jsx_runtime.jsx)("p",{className:"text-red-500",children:error})]}):(0,jsx_runtime.jsxs)("div",{className:"container mx-auto p-4",children:[(0,jsx_runtime.jsx)("h1",{className:"text-2xl font-bold mb-4",children:"Mon Profil"}),(0,jsx_runtime.jsxs)("div",{className:"mt-8",children:[(0,jsx_runtime.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-6 mb-6",children:[(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Nom:"})," ",user.name]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Email:"})," ",user.email]})]}),userPayments.length>0?(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("h2",{className:"text-xl font-bold mb-4 text-white rounded",children:"Paiements"}),(0,jsx_runtime.jsx)("div",{className:"grid md:grid-cols-2 gap-4",children:userPayments.map((payment,index)=>(0,jsx_runtime.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-4",children:[(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Transaction ID:"})," ",payment.transactionId]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Articles:"})," ",payment.items.map(item=>"ID: ".concat(item.id,", Quantit\xe9: ").concat(item.quantity)).join(", ")]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Montant Total:"})," ",payment.totalAmount]}),(0,jsx_runtime.jsxs)("p",{children:[(0,jsx_runtime.jsx)("span",{className:"font-bold",children:"Date:"})," ",new Date(payment.createdAt).toLocaleDateString()]})]},index))})]}):(0,jsx_runtime.jsx)("p",{children:"Aucun paiement trouv\xe9."})]})]})},MonProfilPage=()=>(0,jsx_runtime.jsxs)("div",{className:"relative z-10 min-h-screen",children:[(0,jsx_runtime.jsx)(components.wp,{}),(0,jsx_runtime.jsx)(MonProfil,{}),(0,jsx_runtime.jsx)(components.$_,{})]});var pages_mon_profil=MonProfilPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=6690)}),_N_E=__webpack_require__.O()}]);