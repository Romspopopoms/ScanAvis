(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[866],{6690:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/mon-profil",function(){return __webpack_require__(7502)}])},7502:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return pages_mon_profil}});var jsx_runtime=__webpack_require__(5893),react=__webpack_require__(7294),motion=__webpack_require__(7599),use_isomorphic_effect=__webpack_require__(8868);function useIsMounted(){let isMounted=(0,react.useRef)(!1);return(0,use_isomorphic_effect.L)(()=>(isMounted.current=!0,()=>{isMounted.current=!1}),[]),isMounted}var frameloop_frame=__webpack_require__(2074),PresenceContext=__webpack_require__(240),use_constant=__webpack_require__(6681);class PopChildMeasure extends react.Component{getSnapshotBeforeUpdate(prevProps){let element=this.props.childRef.current;if(element&&prevProps.isPresent&&!this.props.isPresent){let size=this.props.sizeRef.current;size.height=element.offsetHeight||0,size.width=element.offsetWidth||0,size.top=element.offsetTop,size.left=element.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function PopChild({children,isPresent}){let id=(0,react.useId)(),ref=(0,react.useRef)(null),size=(0,react.useRef)({width:0,height:0,top:0,left:0});return(0,react.useInsertionEffect)(()=>{let{width,height,top,left}=size.current;if(isPresent||!ref.current||!width||!height)return;ref.current.dataset.motionPopId=id;let style=document.createElement("style");return document.head.appendChild(style),style.sheet&&style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            top: ${top}px !important;
            left: ${left}px !important;
          }
        `),()=>{document.head.removeChild(style)}},[isPresent]),react.createElement(PopChildMeasure,{isPresent:isPresent,childRef:ref,sizeRef:size},react.cloneElement(children,{ref}))}let PresenceChild=({children,initial,isPresent,onExitComplete,custom,presenceAffectsLayout,mode})=>{let presenceChildren=(0,use_constant.h)(newChildrenMap),id=(0,react.useId)(),context=(0,react.useMemo)(()=>({id,initial,isPresent,custom,onExitComplete(childId){for(let isComplete of(presenceChildren.set(childId,!0),presenceChildren.values()))if(!isComplete)return;onExitComplete&&onExitComplete()},register:childId=>(presenceChildren.set(childId,!1),()=>presenceChildren.delete(childId))}),presenceAffectsLayout?void 0:[isPresent]);return(0,react.useMemo)(()=>{presenceChildren.forEach((_,key)=>presenceChildren.set(key,!1))},[isPresent]),react.useEffect(()=>{isPresent||presenceChildren.size||!onExitComplete||onExitComplete()},[isPresent]),"popLayout"===mode&&(children=react.createElement(PopChild,{isPresent:isPresent},children)),react.createElement(PresenceContext.O.Provider,{value:context},children)};function newChildrenMap(){return new Map}var LayoutGroupContext=__webpack_require__(5364),errors=__webpack_require__(5487);let getChildKey=child=>child.key||"",AnimatePresence=({children,custom,initial=!0,onExitComplete,exitBeforeEnter,presenceAffectsLayout=!0,mode="sync"})=>{var callback;(0,errors.k)(!exitBeforeEnter,"Replace exitBeforeEnter with mode='wait'");let forceRender=(0,react.useContext)(LayoutGroupContext.p).forceRender||function(){let isMounted=useIsMounted(),[forcedRenderCount,setForcedRenderCount]=(0,react.useState)(0),forceRender=(0,react.useCallback)(()=>{isMounted.current&&setForcedRenderCount(forcedRenderCount+1)},[forcedRenderCount]),deferredForceRender=(0,react.useCallback)(()=>frameloop_frame.Wi.postRender(forceRender),[forceRender]);return[deferredForceRender,forcedRenderCount]}()[0],isMounted=useIsMounted(),filteredChildren=function(children){let filtered=[];return react.Children.forEach(children,child=>{(0,react.isValidElement)(child)&&filtered.push(child)}),filtered}(children),childrenToRender=filteredChildren,exitingChildren=(0,react.useRef)(new Map).current,presentChildren=(0,react.useRef)(childrenToRender),allChildren=(0,react.useRef)(new Map).current,isInitialRender=(0,react.useRef)(!0);if((0,use_isomorphic_effect.L)(()=>{isInitialRender.current=!1,function(children,allChildren){children.forEach(child=>{let key=getChildKey(child);allChildren.set(key,child)})}(filteredChildren,allChildren),presentChildren.current=childrenToRender}),callback=()=>{isInitialRender.current=!0,allChildren.clear(),exitingChildren.clear()},(0,react.useEffect)(()=>()=>callback(),[]),isInitialRender.current)return react.createElement(react.Fragment,null,childrenToRender.map(child=>react.createElement(PresenceChild,{key:getChildKey(child),isPresent:!0,initial:!!initial&&void 0,presenceAffectsLayout:presenceAffectsLayout,mode:mode},child)));childrenToRender=[...childrenToRender];let presentKeys=presentChildren.current.map(getChildKey),targetKeys=filteredChildren.map(getChildKey),numPresent=presentKeys.length;for(let i=0;i<numPresent;i++){let key=presentKeys[i];-1!==targetKeys.indexOf(key)||exitingChildren.has(key)||exitingChildren.set(key,void 0)}return"wait"===mode&&exitingChildren.size&&(childrenToRender=[]),exitingChildren.forEach((component,key)=>{if(-1!==targetKeys.indexOf(key))return;let child=allChildren.get(key);if(!child)return;let insertionIndex=presentKeys.indexOf(key),exitingComponent=component;if(!exitingComponent){let onExit=()=>{exitingChildren.delete(key);let leftOverKeys=Array.from(allChildren.keys()).filter(childKey=>!targetKeys.includes(childKey));if(leftOverKeys.forEach(leftOverKey=>allChildren.delete(leftOverKey)),presentChildren.current=filteredChildren.filter(presentChild=>{let presentChildKey=getChildKey(presentChild);return presentChildKey===key||leftOverKeys.includes(presentChildKey)}),!exitingChildren.size){if(!1===isMounted.current)return;forceRender(),onExitComplete&&onExitComplete()}};exitingComponent=react.createElement(PresenceChild,{key:getChildKey(child),isPresent:!1,onExitComplete:onExit,custom:custom,presenceAffectsLayout:presenceAffectsLayout,mode:mode},child),exitingChildren.set(key,exitingComponent)}childrenToRender.splice(insertionIndex,0,exitingComponent)}),childrenToRender=childrenToRender.map(child=>{let key=child.key;return exitingChildren.has(key)?child:react.createElement(PresenceChild,{key:getChildKey(child),isPresent:!0,presenceAffectsLayout:presenceAffectsLayout,mode:mode},child)}),react.createElement(react.Fragment,null,exitingChildren.size?childrenToRender:childrenToRender.map(child=>(0,react.cloneElement)(child)))};var AuthContext=__webpack_require__(4642);let MonProfil=()=>{let{user,setUser,userSubscriptions,handleResubscribe,handleCancelSubscription,errorMessage,setErrorMessage,fetchUserDetails,updateUserDetails}=(0,react.useContext)(AuthContext.Vo),formatAmount=amount=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(amount),[isEditing,setIsEditing]=(0,react.useState)(!1),[localEmail,setLocalEmail]=(0,react.useState)((null==user?void 0:user.email)||""),[localEntreprise,setLocalEntreprise]=(0,react.useState)(""),[localGoogleBusiness,setLocalGoogleBusiness]=(0,react.useState)("");(0,react.useEffect)(()=>{setLocalEmail((null==user?void 0:user.email)||""),setLocalEntreprise((null==user?void 0:user.entreprise)||""),setLocalGoogleBusiness((null==user?void 0:user.googleBusiness)||"")},[user]);let handleSubmit=async e=>{e.preventDefault();try{await updateUserDetails(user.uuid,localEmail,localEntreprise,localGoogleBusiness),setUser(prevUser=>({...prevUser,email:localEmail,entreprise:localEntreprise,googleBusiness:localGoogleBusiness})),setIsEditing(!1),setErrorMessage("")}catch(error){console.error("Erreur lors de la mise \xe0 jour des d\xe9tails de l’utilisateur :",error),setErrorMessage("Erreur lors de la mise \xe0 jour des informations.")}};return(0,react.useEffect)(()=>{(null==user?void 0:user.uuid)&&fetchUserDetails(user.uuid)},[null==user?void 0:user.uuid]),(0,jsx_runtime.jsxs)(motion.E.div,{className:"flex flex-col items-center justify-center min-h-screen",children:[(0,jsx_runtime.jsxs)(motion.E.div,{className:"w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mb-6",children:[(0,jsx_runtime.jsx)("h1",{className:"text-3xl font-bold text-center text-purple-800 mb-8",children:"Mon Profil"}),(0,jsx_runtime.jsxs)("form",{onSubmit:handleSubmit,className:"space-y-4",children:[(0,jsx_runtime.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{htmlFor:"email",className:"block",children:"Email:"}),(0,jsx_runtime.jsx)("input",{id:"email",type:"email",value:localEmail,onChange:e=>setLocalEmail(e.target.value),disabled:!isEditing,className:"mt-1 p-2 w-full border rounded"})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{htmlFor:"entreprise",className:"block",children:"Entreprise:"}),(0,jsx_runtime.jsx)("input",{id:"entreprise",type:"text",value:localEntreprise,onChange:e=>setLocalEntreprise(e.target.value),disabled:!isEditing,className:"mt-1 p-2 w-full border rounded"})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("label",{htmlFor:"googleBusiness",className:"block",children:"Google Business:"}),(0,jsx_runtime.jsx)("input",{id:"googleBusiness",type:"text",value:localGoogleBusiness,onChange:e=>setLocalGoogleBusiness(e.target.value),disabled:!isEditing,className:"mt-1 p-2 w-full border rounded"})]})]}),(0,jsx_runtime.jsx)("div",{className:"flex justify-between",children:isEditing?(0,jsx_runtime.jsx)("button",{type:"submit",className:"bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded",children:"Enregistrer les modifications"}):(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>setIsEditing(!0),className:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",children:"Modifier"})})]}),errorMessage&&(0,jsx_runtime.jsx)("p",{className:"text-red-500 text-center mt-4",children:errorMessage})]}),(0,jsx_runtime.jsxs)(motion.E.div,{className:"w-full max-w-4xl bg-white shadow-xl rounded-lg p-6",children:[(0,jsx_runtime.jsx)("h2",{className:"text-2xl font-bold text-center text-purple-800 mb-6",children:"Abonnements"}),userSubscriptions.length>0?userSubscriptions.map((subscription,index)=>(0,jsx_runtime.jsxs)("div",{className:"bg-purple-100 shadow-md rounded-lg p-4",children:[(0,jsx_runtime.jsxs)("p",{className:"text-lg font-semibold",children:["Produit : ",(0,jsx_runtime.jsx)("span",{className:"font-normal",children:subscription.items})]}),(0,jsx_runtime.jsxs)("p",{className:"text-lg font-semibold",children:["Statut : ",(0,jsx_runtime.jsx)("span",{className:"font-normal",children:subscription.status})]}),(0,jsx_runtime.jsxs)("p",{className:"text-lg font-semibold",children:["Montant Prochain Paiement : ",(0,jsx_runtime.jsx)("span",{className:"font-normal",children:formatAmount(subscription.nextPaymentAmount)})]}),(0,jsx_runtime.jsxs)("p",{className:"text-lg font-semibold",children:["Date du Prochain Paiement : ",(0,jsx_runtime.jsx)("span",{className:"font-normal",children:new Date(subscription.nextPaymentDate).toLocaleDateString("fr-FR")})]}),(0,jsx_runtime.jsx)("div",{className:"mt-4 text-center",children:"active"===subscription.status?(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>handleCancelSubscription(subscription.subscriptionId),className:"bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",children:"Se d\xe9sabonner"}):(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>handleResubscribe(subscription.subscriptionId),className:"bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded",children:"Se r\xe9abonner"})})]},index)):(0,jsx_runtime.jsx)("p",{className:"text-center",children:"Vous n'avez actuellement aucun abonnement actif."})]})]})};var HtmlContext=__webpack_require__(5128);let PageForm=()=>{let{titre,setTitre,setImageDeFond,setLogo,loading,message,pageReady,userPageUrl,handleSubmit}=(0,HtmlContext.$N)(),handleImageChange=(e,setImage)=>{let file=e.target.files[0];file&&setImage(file)};return(0,jsx_runtime.jsx)(motion.E.div,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},transition:{duration:.5},className:"max-w-lg mx-auto my-12 bg-white p-8 rounded-xl shadow-xl border border-gray-200",children:pageReady&&userPageUrl?(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("h2",{className:"text-3xl font-bold text-center mb-8",children:"Votre page est pr\xeate !"}),(0,jsx_runtime.jsx)("p",{className:"text-center",children:"Voici le lien vers votre nouvelle page :"}),(0,jsx_runtime.jsx)("a",{href:userPageUrl,className:"block text-center mt-4 text-purple-600 hover:text-purple-800",target:"_blank",rel:"noopener noreferrer",children:"Acc\xe9der \xe0 la page"})]}):(0,jsx_runtime.jsxs)("form",{onSubmit:handleSubmit,className:"space-y-6",children:[message&&(0,jsx_runtime.jsx)("div",{className:"my-3 p-3 text-center text-white bg-purple-600 rounded-md",children:message}),(0,jsx_runtime.jsx)("h2",{className:"text-2xl font-bold text-center text-purple-800",children:"Cr\xe9er votre page"}),(0,jsx_runtime.jsxs)("div",{className:"space-y-2",children:[(0,jsx_runtime.jsx)("label",{htmlFor:"titre",className:"block text-lg font-semibold text-gray-700",children:"Nom de la soci\xe9t\xe9"}),(0,jsx_runtime.jsx)("input",{type:"text",id:"titre",name:"titre",value:titre,onChange:e=>setTitre(e.target.value),required:!0,className:"mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500",placeholder:"Entrez le nom de votre soci\xe9t\xe9"})]}),(0,jsx_runtime.jsxs)("div",{className:"space-y-2",children:[(0,jsx_runtime.jsx)("label",{htmlFor:"imageDeFond",className:"block text-lg font-semibold text-gray-700",children:"Image de fond (JPG, PNG)"}),(0,jsx_runtime.jsx)("input",{type:"file",id:"imageDeFond",name:"imageDeFond",accept:".jpg, .jpeg, .png",onChange:e=>handleImageChange(e,setImageDeFond),className:"mt-1 block w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"})]}),(0,jsx_runtime.jsxs)("div",{className:"space-y-2",children:[(0,jsx_runtime.jsx)("label",{htmlFor:"logo",className:"block text-lg font-semibold text-gray-700",children:"Logo (JPG, PNG)"}),(0,jsx_runtime.jsx)("input",{type:"file",id:"logo",name:"logo",accept:".jpg, .jpeg, .png",onChange:e=>handleImageChange(e,setLogo),className:"mt-1 block w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"})]}),(0,jsx_runtime.jsx)(motion.E.button,{whileHover:{scale:1.05},whileTap:{scale:.95},type:"submit",className:"w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",disabled:loading,children:loading?"Envoi en cours...":"Cr\xe9er la page"})]})})};var NavbarContext=__webpack_require__(2712);let menuItems=[{name:"Profil",key:"profil"},{name:"Cr\xe9ation de votre page",key:"creation"}],variants={open:{opacity:1,height:"auto"},collapsed:{opacity:0,height:0}},MonProfilPage=()=>{let[activeSection,setActiveSection]=(0,react.useState)("profil"),{navbarHeight}=(0,NavbarContext.M)(),{fetchUserSubscriptions,user}=(0,react.useContext)(AuthContext.Vo);(0,react.useEffect)(()=>{user&&user.uuid&&fetchUserSubscriptions(user.uuid)},[user]);let renderSection=key=>{switch(key){case"profil":return(0,jsx_runtime.jsx)(MonProfil,{});case"creation":return(0,jsx_runtime.jsx)(PageForm,{});default:return(0,jsx_runtime.jsx)("div",{children:"Section non trouv\xe9e"})}};return(0,jsx_runtime.jsxs)("div",{className:"bg-gradient-to-b from-purple-800 to-purple-500 min-h-screen",children:[(0,jsx_runtime.jsx)("div",{style:{paddingTop:navbarHeight>64?"".concat(navbarHeight-30,"px"):"44px"},children:(0,jsx_runtime.jsx)("div",{className:"flex justify-center space-x-4 p-4",children:menuItems.map(item=>(0,jsx_runtime.jsx)(motion.E.div,{whileHover:{scale:1.1},whileTap:{scale:.95},className:"cursor-pointer px-4 py-2 rounded-lg text-white ".concat(activeSection===item.key?"bg-purple-600":"bg-purple-700 hover:bg-purple-600"),onClick:()=>setActiveSection(item.key),children:item.name},item.key))})}),(0,jsx_runtime.jsx)(AnimatePresence,{children:menuItems.map(item=>activeSection===item.key&&(0,jsx_runtime.jsx)(motion.E.div,{initial:"collapsed",animate:"open",exit:"collapsed",variants:variants,transition:{duration:.8},className:"overflow-hidden",children:renderSection(item.key)},item.key))})]})};var pages_mon_profil=MonProfilPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=6690)}),_N_E=__webpack_require__.O()}]);