(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[947],{6753:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/tarifs",function(){return __webpack_require__(774)}])},774:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return tarifs}});var jsx_runtime=__webpack_require__(5893),components=__webpack_require__(6307),react=__webpack_require__(7294),errors=__webpack_require__(5487),setters=__webpack_require__(4330),visual_element=__webpack_require__(6432);function animationControls(){let hasMounted=!1,subscribers=new Set,controls={subscribe:visualElement=>(subscribers.add(visualElement),()=>void subscribers.delete(visualElement)),start(definition,transitionOverride){(0,errors.k)(hasMounted,"controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.");let animations=[];return subscribers.forEach(visualElement=>{animations.push((0,visual_element.d)(visualElement,definition,{transitionOverride}))}),Promise.all(animations)},set:definition=>((0,errors.k)(hasMounted,"controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook."),subscribers.forEach(visualElement=>{(0,setters.gg)(visualElement,definition)})),stop(){subscribers.forEach(visualElement=>{!function(visualElement){visualElement.values.forEach(value=>value.stop())}(visualElement)})},mount:()=>(hasMounted=!0,()=>{hasMounted=!1,controls.stop()})};return controls}var use_constant=__webpack_require__(6681),use_isomorphic_effect=__webpack_require__(8868);let useAnimation=function(){let controls=(0,use_constant.h)(animationControls);return(0,use_isomorphic_effect.L)(controls.mount,[]),controls};var motion=__webpack_require__(2020),__defProp=Object.defineProperty,observerMap=new Map,RootIds=new WeakMap,rootId=0,unsupportedValue=void 0;function useInView({threshold,delay,trackVisibility,rootMargin,root,triggerOnce,skip,initialInView,fallbackInView,onChange}={}){var _a;let[ref,setRef]=react.useState(null),callback=react.useRef(),[state,setState]=react.useState({inView:!!initialInView,entry:void 0});callback.current=onChange,react.useEffect(()=>{let unobserve;if(!skip&&ref)return unobserve=function(element,callback,options={},fallbackInView=unsupportedValue){if(void 0===window.IntersectionObserver&&void 0!==fallbackInView){let bounds=element.getBoundingClientRect();return callback(fallbackInView,{isIntersecting:fallbackInView,target:element,intersectionRatio:"number"==typeof options.threshold?options.threshold:0,time:0,boundingClientRect:bounds,intersectionRect:bounds,rootBounds:bounds}),()=>{}}let{id,observer,elements}=function(options){let id=Object.keys(options).sort().filter(key=>void 0!==options[key]).map(key=>{var root;return`${key}_${"root"===key?(root=options.root)?(RootIds.has(root)||(rootId+=1,RootIds.set(root,rootId.toString())),RootIds.get(root)):"0":options[key]}`}).toString(),instance=observerMap.get(id);if(!instance){let thresholds;let elements=new Map,observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{var _a;let inView=entry.isIntersecting&&thresholds.some(threshold=>entry.intersectionRatio>=threshold);options.trackVisibility&&void 0===entry.isVisible&&(entry.isVisible=inView),null==(_a=elements.get(entry.target))||_a.forEach(callback=>{callback(inView,entry)})})},options);thresholds=observer.thresholds||(Array.isArray(options.threshold)?options.threshold:[options.threshold||0]),instance={id,observer,elements},observerMap.set(id,instance)}return instance}(options),callbacks=elements.get(element)||[];return elements.has(element)||elements.set(element,callbacks),callbacks.push(callback),observer.observe(element),function(){callbacks.splice(callbacks.indexOf(callback),1),0===callbacks.length&&(elements.delete(element),observer.unobserve(element)),0===elements.size&&(observer.disconnect(),observerMap.delete(id))}}(ref,(inView,entry)=>{setState({inView,entry}),callback.current&&callback.current(inView,entry),entry.isIntersecting&&triggerOnce&&unobserve&&(unobserve(),unobserve=void 0)},{root,rootMargin,threshold,trackVisibility,delay},fallbackInView),()=>{unobserve&&unobserve()}},[Array.isArray(threshold)?threshold.toString():threshold,ref,root,rootMargin,triggerOnce,skip,trackVisibility,fallbackInView,delay]);let entryTarget=null==(_a=state.entry)?void 0:_a.target,previousEntryTarget=react.useRef();ref||!entryTarget||triggerOnce||skip||previousEntryTarget.current===entryTarget||(previousEntryTarget.current=entryTarget,setState({inView:!!initialInView,entry:void 0}));let result=[setRef,state.inView,state.entry];return result.ref=result[0],result.inView=result[1],result.entry=result[2],result}react.Component;var styles=__webpack_require__(9176);let SectionOne=()=>{let controls=useAnimation(),[ref,inView]=useInView({threshold:.1,triggerOnce:!1});return react.useEffect(()=>{inView?controls.start({x:0,opacity:1,transition:{duration:.5}}):controls.start({x:"100%",opacity:0,transition:{duration:.5}})},[controls,inView]),(0,jsx_runtime.jsx)("section",{ref:ref,className:"".concat(styles.Z.paddings," bg-dark"),id:"world-1",children:(0,jsx_runtime.jsxs)(motion.E.div,{initial:{x:"-100%",opacity:0},animate:controls,className:"flex flex-col items-center justify-center p-6 text-white",children:[(0,jsx_runtime.jsx)("h1",{className:"text-5xl font-bold mb-4 text-center leading-tight",children:"Notre option de base"}),(0,jsx_runtime.jsx)("div",{className:"w-full max-w-4xl mb-6",children:(0,jsx_runtime.jsx)("iframe",{src:"https://www.youtube.com/embed/zoVBnmjNKUQ",title:"YouTube video",allowFullScreen:!0,className:"w-full aspect-video shadow-lg rounded-lg"})}),(0,jsx_runtime.jsxs)("div",{className:"max-w-3xl text-center",children:[(0,jsx_runtime.jsx)("h2",{className:"text-4xl font-semibold mb-3 leading-normal",children:"Optimisation de la Visibilit\xe9 en Ligne avec Scan'Avis"}),(0,jsx_runtime.jsx)("p",{className:"text-2xl mb-4",children:"Boostez votre visibilit\xe9 en ligne et attirez plus de clients !"}),["G\xe9n\xe9ration de QR Codes Uniques : Nous cr\xe9ons automatiquement des QR Codes personnalis\xe9s pour votre \xe9tablissement, assurant une exp\xe9rience utilisateur fluide et sans effort.","Liaison Directe avec Google Business : Chaque QR Code est associ\xe9 \xe0 votre page Google Business, dirigeant vos clients directement vers votre espace de commentaires.","QR Codes sur Supports Durables : Imprim\xe9s sur des plaques de Plexiglas, nos QR Codes sont \xe0 la fois \xe9l\xe9gants et r\xe9sistants, int\xe9grant votre branding pour une touche personnalis\xe9e.","Processus Automatis\xe9 et Int\xe9gratif : Gr\xe2ce \xe0 un formulaire en ligne int\xe9gr\xe9, commandez et g\xe9rez vos QR Codes facilement, avec une gestion automatis\xe9e des demandes."].map((point,index)=>(0,jsx_runtime.jsx)("p",{className:"text-xl mb-2 leading-relaxed",children:point},index))]})]})})},SectionTwo=()=>{let controls=useAnimation(),[ref,inView]=useInView({threshold:.1,triggerOnce:!1});return react.useEffect(()=>{inView?controls.start({x:0,opacity:1,transition:{duration:.5}}):controls.start({x:"100%",opacity:0,transition:{duration:.5}})},[controls,inView]),(0,jsx_runtime.jsx)("section",{ref:ref,className:"".concat(styles.Z.paddings," bg-dark"),id:"world-1",children:(0,jsx_runtime.jsxs)(motion.E.div,{initial:{x:"-100%",opacity:0},animate:controls,className:"flex flex-col items-center justify-center p-6 text-white",children:[(0,jsx_runtime.jsx)("h1",{className:"text-5xl font-bold mb-4 text-center leading-tight",children:"Notre option Bronze"}),(0,jsx_runtime.jsx)("div",{className:"w-full max-w-4xl mb-6",children:(0,jsx_runtime.jsx)("iframe",{src:"https://www.youtube.com/embed/ljFkRR6ldMQ",title:"YouTube video",allowFullScreen:!0,className:"w-full aspect-video shadow-lg rounded-lg"})}),(0,jsx_runtime.jsxs)("div",{className:"max-w-3xl text-center",children:[(0,jsx_runtime.jsx)("h2",{className:"text-4xl font-semibold mb-3 leading-normal",children:" Collecte d'Adresses Email et Engagement Client avec Scan'Avis"}),(0,jsx_runtime.jsx)("p",{className:"text-2xl mb-4",children:"Enrichissez votre marketing et renforcez la fid\xe9lit\xe9 client !"}),["Cr\xe9ation de QR Codes pour Formulaire : Nous d\xe9veloppons un syst\xe8me qui g\xe9n\xe8re des QR Codes redirigeant vers un formulaire en ligne. Vos clients peuvent facilement y entrer leur adresse email apr\xe8s avoir laiss\xe9 un avis sur Google Business.","D\xe9veloppement du Formulaire : Choisissez entre Google Forms pour une solution simple ou un formulaire personnalis\xe9 pour une redirection directe vers votre page Google Business apr\xe8s la soumission de l'email.","Collecte et Gestion des Emails : Les adresses email collect\xe9es sont stock\xe9es dans une base de donn\xe9es s\xe9curis\xe9e, facilitant l'envoi d'invitations \xe0 des \xe9v\xe9nements sp\xe9ciaux, d'offres exclusives ou de newsletters.","Acc\xe8s Facilit\xe9 aux Donn\xe9es : Nous fournissons aux restaurateurs un acc\xe8s facile \xe0 ces donn\xe9es, par extraction vers Excel, offrant une utilisation flexible et conforme aux normes de protection des donn\xe9es.","Messages de Remerciement Personnalis\xe9s : Ajoutez une touche personnelle avec des messages de remerciement personnalis\xe9s, renfor\xe7ant l'engagement et la fid\xe9lit\xe9 de vos clients envers votre restaurant."].map((point,index)=>(0,jsx_runtime.jsx)("p",{className:"text-xl mb-2 leading-relaxed",children:point},index))]})]})})},SectionThree=()=>{let controls=useAnimation(),[ref,inView]=useInView({threshold:.1,triggerOnce:!1});return react.useEffect(()=>{inView?controls.start({x:0,opacity:1,transition:{duration:.5}}):controls.start({x:"100%",opacity:0,transition:{duration:.5}})},[controls,inView]),(0,jsx_runtime.jsx)("section",{ref:ref,className:"".concat(styles.Z.paddings," bg-dark"),id:"world-1",children:(0,jsx_runtime.jsxs)(motion.E.div,{initial:{x:"-100%",opacity:0},animate:controls,className:"flex flex-col items-center justify-center p-6 text-white",children:[(0,jsx_runtime.jsx)("h1",{className:"text-5xl font-bold mb-4 text-center leading-tight",children:"Notre option Silver"}),(0,jsx_runtime.jsx)("div",{className:"w-full max-w-4xl mb-6",children:(0,jsx_runtime.jsx)("iframe",{src:"https://www.youtube.com/embed/ljFkRR6ldMQ",title:"YouTube video",allowFullScreen:!0,className:"w-full aspect-video shadow-lg rounded-lg"})}),(0,jsx_runtime.jsxs)("div",{className:"max-w-3xl text-center",children:[(0,jsx_runtime.jsx)("h2",{className:"text-4xl font-semibold mb-3 leading-normal",children:" Envoi Simplifi\xe9 de Newsletters avec Scan'Avis"}),(0,jsx_runtime.jsx)("p",{className:"text-2xl mb-4",children:"Optimisez votre communication et fid\xe9lisez vos clients avec des newsletters personnalis\xe9es !"}),["Int\xe9gration et S\xe9curisation des Adresses Email : Nous exploitons la base de donn\xe9es des adresses email collect\xe9es via les Options de base et Bronze, en veillant \xe0 la s\xe9curit\xe9 et \xe0 la conformit\xe9 de ces donn\xe9es.","Formulaire Simplifi\xe9 pour les Restaurateurs : Mettez en place des newsletters engageantes gr\xe2ce \xe0 notre formulaire simple. Ajoutez facilement du texte et des images pour annoncer vos \xe9v\xe9nements et promotions.","Validation et Envoi Automatis\xe9 des Emails : Apr\xe8s votre validation, les emails sont envoy\xe9s pour approbation, puis distribu\xe9s automatiquement \xe0 votre liste de clients, renfor\xe7ant ainsi votre pr\xe9sence dans leur esprit.","Gestion des Envois de Masse : Nous fournissons des solutions efficaces pour l'envoi de newsletters, quel que soit le volume, tout en \xe9vitant que vos messages soient marqu\xe9s comme spam.","Option de D\xe9sabonnement Facilit\xe9e : Chaque email inclut une option de d\xe9sabonnement claire, respectant ainsi les pr\xe9f\xe9rences de vos clients et garantissant la conformit\xe9 de votre liste de diffusion."].map((point,index)=>(0,jsx_runtime.jsx)("p",{className:"text-xl mb-2 leading-relaxed",children:point},index))]})]})})},SectionFour=()=>{let controls=useAnimation(),[ref,inView]=useInView({threshold:.1,triggerOnce:!1});return react.useEffect(()=>{inView?controls.start({x:0,opacity:1,transition:{duration:.5}}):controls.start({x:"100%",opacity:0,transition:{duration:.5}})},[controls,inView]),(0,jsx_runtime.jsx)("section",{ref:ref,className:"".concat(styles.Z.paddings," bg-dark"),id:"world-1",children:(0,jsx_runtime.jsxs)(motion.E.div,{initial:{x:"-100%",opacity:0},animate:controls,className:"flex flex-col items-center justify-center p-6 text-white",children:[(0,jsx_runtime.jsx)("h1",{className:"text-5xl font-bold mb-4 text-center leading-tight",children:"Notre option Gold"}),(0,jsx_runtime.jsx)("div",{className:"w-full max-w-4xl mb-6",children:(0,jsx_runtime.jsx)("iframe",{src:"https://www.youtube.com/embed/ljFkRR6ldMQ",title:"YouTube video",allowFullScreen:!0,className:"w-full aspect-video shadow-lg rounded-lg"})}),(0,jsx_runtime.jsxs)("div",{className:"max-w-3xl text-center",children:[(0,jsx_runtime.jsx)("h2",{className:"text-4xl font-semibold mb-3 leading-normal",children:" Ciblage Avanc\xe9 et Envoi de Mails Promotionnels Personnalis\xe9s avec Scan'Avis"}),(0,jsx_runtime.jsx)("p",{className:"text-2xl mb-4",children:"D\xe9veloppez une strat\xe9gie marketing personnalis\xe9e pour une fid\xe9lisation accrue de vos clients !"}),["Base de Donn\xe9es Compl\xe8te et Personnalis\xe9e : Nous constituons une base de donn\xe9es d\xe9taill\xe9e, incluant des informations cl\xe9s sur chaque client, afin de vous fournir un outil puissant pour des offres sur mesure.","Gestion Intuitive des Promotions : Notre interface utilisateur permet aux restaurateurs de cr\xe9er des promotions cibl\xe9es bas\xe9es sur les habitudes de d\xe9pense et la fr\xe9quence des visites des clients, rendant chaque offre unique et attrayante.","Utilisation de QR Codes pour la Fid\xe9lit\xe9 : Chaque promotion envoy\xe9e comprend un QR Code, permettant une interaction facile et une mise \xe0 jour instantan\xe9e des donn\xe9es de fid\xe9lit\xe9 du client \xe0 chaque visite."].map((point,index)=>(0,jsx_runtime.jsx)("p",{className:"text-xl mb-2 leading-relaxed",children:point},index))]})]})})},PageTarifs=()=>(0,jsx_runtime.jsxs)("div",{className:"bg-primary-black overflow-hidden",children:[(0,jsx_runtime.jsx)("div",{className:"gradient-01 absolute inset-0 z-0"}),(0,jsx_runtime.jsx)(components.wp,{}),(0,jsx_runtime.jsx)("div",{className:"gradient-03 z-0"}),(0,jsx_runtime.jsx)("div",{id:"world-1",children:(0,jsx_runtime.jsx)(SectionOne,{})}),(0,jsx_runtime.jsx)("div",{id:"world-2",children:(0,jsx_runtime.jsx)(SectionTwo,{})}),(0,jsx_runtime.jsx)("div",{id:"world-3",children:(0,jsx_runtime.jsx)(SectionThree,{})}),(0,jsx_runtime.jsx)("div",{id:"world-4",children:(0,jsx_runtime.jsx)(SectionFour,{})}),(0,jsx_runtime.jsx)(components.$_,{})]});var tarifs=PageTarifs}},function(__webpack_require__){__webpack_require__.O(0,[169,307,774,888,179],function(){return __webpack_require__(__webpack_require__.s=6753)}),_N_E=__webpack_require__.O()}]);