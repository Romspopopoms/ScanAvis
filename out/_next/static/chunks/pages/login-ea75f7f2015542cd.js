(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[459],{6429:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login",function(){return __webpack_require__(4754)}])},4754:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4642);let LoginPage=()=>{let[username,setUsername]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[password,setPassword]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[errorMessage,setErrorMessage]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),{getAuthUrl,handleAuthCode}=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.Vo),handleSubmit=async event=>{if(event.preventDefault(),setErrorMessage(""),!username||!password){setErrorMessage("Le nom d'utilisateur et le mot de passe sont requis");return}try{let response=await fetch("/.netlify/functions/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})}),data=await response.json();response.ok?handleAuthCode(data.access_token):setErrorMessage(data.error||"Erreur lors de la connexion")}catch(error){setErrorMessage("Probl\xe8me de connexion r\xe9seau")}},handleGoogleSignIn=async()=>{try{let authUrl=await getAuthUrl();authUrl?window.location.href=authUrl:setErrorMessage("Erreur lors de la r\xe9cup\xe9ration de l'URL d'authentification")}catch(error){setErrorMessage("Erreur lors de la r\xe9cup\xe9ration de l'URL d'authentification")}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex min-h-screen flex-col bg-gradient-to-br from-blue-500 to-blue-700",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex flex-grow items-center justify-center px-6 py-8",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"w-full max-w-md",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form",{className:"mb-4 space-y-6 rounded-lg bg-white px-8 pt-6 pb-8 shadow-md",onSubmit:handleSubmit,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{className:"text-center text-3xl font-extrabold text-gray-900",children:"Connexion"}),"errorMessage && ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{className:"text-center text-sm text-red-600",children:errorMessage}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"username",className:"mb-2 block text-sm font-medium text-gray-700",children:"Nom d'utilisateur"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"username",type:"text",className:"mb-4 w-full rounded border py-2 px-3 text-gray-700 shadow-sm",placeholder:"Entrez votre nom d'utilisateur",autoComplete:"username",value:username,onChange:e=>setUsername(e.target.value)})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"password",className:"mb-2 block text-sm font-medium text-gray-700",children:"Mot de passe"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"password",type:"password",className:"mb-4 w-full rounded border py-2 px-3 text-gray-700 shadow-sm",placeholder:"Entrez votre mot de passe",autoComplete:"current-password",value:password,onChange:e=>setPassword(e.target.value)})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"submit",className:"w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50",children:"Se connecter"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"text-center text-sm text-gray-700",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/",className:"hover:text-blue-600",children:"Mot de passe oubli\xe9 ?"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr",{className:"my-6 border-gray-300"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",className:"w-full rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50",onClick:handleGoogleSignIn,children:"Connexion avec Google"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"mt-6 text-center text-sm text-gray-700",children:["Pas encore de compte ? ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/",className:"hover:text-blue-600",children:"Inscrivez-vous"})]})]})})})})};__webpack_exports__.default=LoginPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=6429)}),_N_E=__webpack_require__.O()}]);