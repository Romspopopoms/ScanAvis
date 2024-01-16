"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[788],{2169:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{e:function(){return TitleText},g:function(){return TypingText}});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),framer_motion__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2020),_utils_motion__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(621);let TypingText=param=>{let{title,textStyles}=param;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.E.p,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_1__.AR,className:"font-normal text-[14px] text-secondary-white ".concat(textStyles),children:Array.from(title).map((letter,index)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.E.span,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_1__.lM,children:" "===letter?"\xa0":letter},index))})},TitleText=param=>{let{title,textStyles}=param;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.E.h2,{variants:_utils_motion__WEBPACK_IMPORTED_MODULE_1__.lM,initial:"hidden",whileInView:"show",className:"mt-[8px] font-bold md:text-[64px] text-[40px] text-white ".concat(textStyles),children:title})}},2788:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{NM:function(){return components_ExploreCard},$_:function(){return components_Footer},wp:function(){return components_Navbar},Oz:function(){return components_NewFeatures},dy:function(){return components_StartSteps},eN:function(){return CustomTexts.e},gw:function(){return CustomTexts.g}});var jsx_runtime=__webpack_require__(5893),react=__webpack_require__(7294),dom_motion=__webpack_require__(2020),netlify_identity=__webpack_require__(1535),netlify_identity_default=__webpack_require__.n(netlify_identity),next_link=__webpack_require__(1664),link_default=__webpack_require__.n(next_link);let Navbar=()=>{let[isMenuOpen,setIsMenuOpen]=(0,react.useState)(!1),user=netlify_identity_default().currentUser();(0,react.useEffect)(()=>{netlify_identity_default().init()},[]);let handleLogin=()=>{netlify_identity_default().open("login")},handleLogout=()=>{netlify_identity_default().logout()},handleToggleMenu=()=>{setIsMenuOpen(!isMenuOpen)};return(0,jsx_runtime.jsxs)("nav",{className:"fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-gray-900 text-white z-50",children:[(0,jsx_runtime.jsx)("h2",{className:"font-extrabold text-2xl",children:(0,jsx_runtime.jsx)(link_default(),{href:"/",children:"SCAN'AVIS"})}),(0,jsx_runtime.jsxs)("div",{className:"flex items-center",children:[user?(0,jsx_runtime.jsx)("button",{type:"button",onClick:handleLogout,className:"mr-4",children:"D\xe9connexion"}):(0,jsx_runtime.jsx)("button",{type:"button",onClick:handleLogin,children:(0,jsx_runtime.jsx)("img",{src:"/user.svg",alt:"User"})}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:handleToggleMenu,className:"ml-4",children:(0,jsx_runtime.jsx)("img",{src:"/menu.svg",alt:"Menu"})})]}),(0,jsx_runtime.jsx)(dom_motion.E.div,{initial:!1,animate:isMenuOpen?"open":"closed",variants:{open:{x:0},closed:{x:"-100%"}},className:"fixed top-0 left-0 w-[250px] h-full bg-gray-800 shadow-lg z-40",children:(0,jsx_runtime.jsxs)("nav",{className:"flex flex-col",children:[(0,jsx_runtime.jsx)("button",{type:"button",onClick:handleToggleMenu,className:"text-right px-4 py-2",children:"Fermer"}),user&&(0,jsx_runtime.jsx)(link_default(),{href:"/mon-profil",className:"px-4 py-2 hover:bg-gray-700",children:"Mon Profil"}),(0,jsx_runtime.jsx)(link_default(),{href:"/",className:"px-4 py-2 hover:bg-gray-700",children:"Accueil"}),(0,jsx_runtime.jsx)(link_default(),{href:"/tarifs",className:"px-4 py-2 hover:bg-gray-700",children:"Nos offres"})]})})]})};var components_Navbar=Navbar,CustomTexts=__webpack_require__(2169),styles=__webpack_require__(9176),utils_motion=__webpack_require__(621);let ExploreCard=param=>{let{id,imgUrl,title,index,active,handleClick,sectionId}=param,[isMounted,setIsMounted]=(0,react.useState)(!1);return(0,react.useEffect)(()=>{setIsMounted(!0)},[]),(0,jsx_runtime.jsxs)(dom_motion.E.div,{variants:(0,utils_motion.Ji)("right","spring",.5*index,.75),className:"relative ".concat(active===id?"lg:flex-[3.5] flex-[10]":"lg:flex-[0.5] flex-[2]"," group flex items-center justify-center min-w-[170px] h-[700px] transition-[flex] duration-[0.7s] ease-out-flex cursor-pointer"),onClick:()=>handleClick(id),children:[(0,jsx_runtime.jsx)("img",{src:imgUrl,alt:title,className:"absolute w-full h-full object-cover rounded-[24px]"}),active!==id?(0,jsx_runtime.jsx)("h3",{className:"font-semibold sm:text-[26px] text-[18px] text-white absolute z-10 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0]",children:title}):(0,jsx_runtime.jsxs)("div",{className:"absolute bottom-0 p-8 flex justify-start w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-b-[24px]",children:[(0,jsx_runtime.jsx)("div",{className:"".concat(styles.Z.flexCenter," w-[60px] h-[60px] rounded-[24px] glassmorphism mb-[16px]"),children:(0,jsx_runtime.jsx)("img",{src:"/scan.png",alt:"scan",className:"w-1/2 h-1/2 object-contain"})}),(0,jsx_runtime.jsx)("p",{className:"font-normal text-[16px] leading-[20.16px] text-white uppercase",children:"Amorcez le changement"}),(0,jsx_runtime.jsx)("h2",{className:"mt-[24px] font-semibold sm:text-[32px] text-[24px] text-white",children:title}),isMounted&&(0,jsx_runtime.jsx)(link_default(),{href:"/tarifs#".concat(sectionId),legacyBehavior:!0,children:(0,jsx_runtime.jsx)("a",{className:"opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-10 right-10",children:"En savoir plus"})})]})]})};var components_ExploreCard=ExploreCard;let StartSteps=param=>{let{number,text}=param;return(0,jsx_runtime.jsxs)("div",{className:"".concat(styles.Z.flexCenter," flex-row"),children:[(0,jsx_runtime.jsx)("div",{className:"".concat(styles.Z.flexCenter," w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]"),children:(0,jsx_runtime.jsx)("p",{className:"font-bold text-[20px] text-white",children:number})}),(0,jsx_runtime.jsx)("p",{className:"flex-1 ml-[30px] font-normal text-[18px] text-[#B0B0B0] leading-[32.4px]",children:text})]})};var components_StartSteps=StartSteps;let NewFeatures=param=>{let{imgUrl,title,subtitle}=param;return(0,jsx_runtime.jsxs)("div",{className:"flex-1 flex flex-col sm:max-w-[250px] min-w-[210px]",children:[(0,jsx_runtime.jsx)("div",{className:"".concat(styles.Z.flexCenter," w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]"),children:(0,jsx_runtime.jsx)("img",{src:imgUrl,alt:"icon",className:"w-1/2 h-1/2 object-contain"})}),(0,jsx_runtime.jsx)("h1",{className:"mt-[26px] font-bold text-[24px] leading-[30.24px] text-white",children:title}),(0,jsx_runtime.jsx)("p",{className:"flex-1 mt-[16px] font-normal text-[18px] text-[#B0B0B0] leading-[32.4px]",children:subtitle})]})};var components_NewFeatures=NewFeatures,constants=__webpack_require__(8392);let Footer=()=>(0,jsx_runtime.jsxs)(dom_motion.E.footer,{variants:utils_motion.FT,initial:"hidden",whileInView:"show",className:"".concat(styles.Z.xPaddings," py-8 relative"),children:[(0,jsx_runtime.jsx)("div",{className:"footer-gradient"}),(0,jsx_runtime.jsxs)("div",{className:"".concat(styles.Z.innerWidth," mx-auto flex flex-col gap-8"),children:[(0,jsx_runtime.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-5",children:[(0,jsx_runtime.jsx)("h4",{className:"font-bold md:text-[64px] text-[44px] text-white",children:"ADOPTEZ LA NOUVEAUT\xc9"}),(0,jsx_runtime.jsxs)("button",{type:"button",className:"flex items-center h-fit py-4 px-6 bg-[#25618B] rounded-[32px] gap-[12px]",children:[(0,jsx_runtime.jsx)("img",{src:"/scan.png",alt:"headset",className:"w-[24px] h-[24px] object-contain"}),(0,jsx_runtime.jsx)("span",{className:"font-normal text-[16px] text-white",children:"Choisissez le nouveau monde"})]})]}),(0,jsx_runtime.jsxs)("div",{className:"flex flex-col",children:[(0,jsx_runtime.jsx)("div",{className:"mb-[50px] h-[2px] bg-white opacity-10"}),(0,jsx_runtime.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-4",children:[(0,jsx_runtime.jsx)("h4",{className:"font-extrabold text-[24px] text-white",children:"SCAN'AVIS"}),(0,jsx_runtime.jsx)("p",{className:"font-normal text-[14px] text-white opacity-50",children:"Copyright \xa9 2024 Scan'Avis. Tout droits r\xe9serv\xe9s."}),(0,jsx_runtime.jsx)("div",{className:"flex gap-4",children:constants.UY.map(social=>(0,jsx_runtime.jsx)("img",{src:social.url,alt:social.name,className:"w-[24px] h-[24px] object-contain cursor-pointer"},social.name))})]})]})]})]});var components_Footer=Footer},8392:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{UY:function(){return socials},gw:function(){return newFeatures},nw:function(){return exploreWorlds},pT:function(){return startingFeatures}});let exploreWorlds=[{id:"world-1",imgUrl:"/planet-01.png",title:"FORMULE STARTER",sectionId:"world-1"},{id:"world-2",imgUrl:"/planet-02.png",title:"OPTION BRONZE",sectionId:"world-2"},{id:"world-3",imgUrl:"/planet-03.png",title:"OPTION SILVER",sectionId:"world-3"},{id:"world-4",imgUrl:"/planet-04.png",title:"OPTION GOLD",sectionId:"world-4"}],startingFeatures=["Inscrivez-vous et connectez-vous \xe0 votre compte","Souscrivez a la formule de votre choix","Recevez votre QR code, et vos fonctionnalit\xe9s"],newFeatures=[{imgUrl:"/web.png",title:"Acc\xe9dez \xe0 un nouveau monde",subtitle:"Un nouveau monde s’ouvre \xe0 vous, avec de nouvelles possibilit\xe9s"},{imgUrl:"/scan.png",title:"D\xe9cuplez vos avis",subtitle:"Un lien suppl\xe9mentaire avec vos clients, qui vous assure un rendement plus important"}],socials=[{name:"twitter",url:"/twitter.svg"},{name:"linkedin",url:"/linkedin.svg"},{name:"instagram",url:"/instagram.svg"},{name:"facebook",url:"/facebook.svg"}]},9176:function(__unused_webpack_module,__webpack_exports__){__webpack_exports__.Z={innerWidth:"2xl:max-w-[1280px] w-full",interWidth:"lg:w-[80%] w-[100%]",paddings:"sm:p-16 xs:p-8 px-6 py-12",yPaddings:"sm:py-16 xs:py-8 py-12",xPaddings:"sm:px-16 px-6",topPaddings:"sm:pt-16 xs:pt-8 pt-12",bottomPaddings:"sm:pb-16 xs:pb-8 pb-12",flexCenter:"flex justify-center items-center",flexStart:"flex justify-start items-start",flexEnd:"flex justify-end",navPadding:"pt-[98px]",heroHeading:"font-bold lg:text-[100px] md:text-[100px] sm:text-[60px] text-[44px] lg:leading-[158.4px] md:leading-[114.4px] sm:leading-[74.4px] leading-[64.4px] uppercase text-white",heroDText:"md:w-[212px] sm:w-[80px] w-[60px] md:h-[108px] sm:h-[48px] h-[38px] md:border-[18px] border-[9px] rounded-r-[50px] border-white sm:mx-2 mx-[6px]"}},621:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{AR:function(){return textContainer},FT:function(){return footerVariants},Ji:function(){return fadeIn},Jm:function(){return staggerContainer},Ym:function(){return slideIn},lM:function(){return textVariant2},vk:function(){return planetVariants},wt:function(){return textVariant}});let slideIn=(direction,type,delay,duration)=>({hidden:{x:"left"===direction?"-100%":"right"===direction?"100%":0,y:"up"===direction?"100%":"down"===direction?"100%":0},show:{x:0,y:0,transition:{type,delay,duration,ease:"easeOut"}}}),staggerContainer=(staggerChildren,delayChildren)=>({hidden:{},show:{transition:{staggerChildren,delayChildren}}}),textVariant=delay=>({hidden:{y:50,opacity:0},show:{y:0,opacity:1,transition:{type:"spring",duration:1.25,delay}}}),textContainer={hidden:{opacity:0},show:function(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return{opacity:1,transition:{staggerChildren:.1,delayChildren:.1*i}}}},textVariant2={hidden:{opacity:0,y:20},show:{opacity:1,y:0,transition:{type:"tween",ease:"easeIn"}}},fadeIn=(direction,type,delay,duration)=>({hidden:{x:"left"===direction?100:"right"===direction?-100:0,y:"up"===direction?100:"down"===direction?-100:0,opacity:0},show:{x:0,y:0,opacity:1,transition:{type,delay,duration,ease:"easeOut"}}}),planetVariants=direction=>({hidden:{x:"left"===direction?"-100%":"100%",rotate:120},show:{x:0,rotate:0,transition:{type:"spring",duration:1.8,delay:.5}}}),footerVariants={hidden:{opacity:0,y:50,transition:{type:"spring",stiffness:300,damping:140}},show:{opacity:1,y:0,transition:{type:"spring",stiffness:80,delay:.5}}}}}]);