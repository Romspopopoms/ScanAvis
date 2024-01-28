(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[459],{6429:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login",function(){return __webpack_require__(4754)}])},4754:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4642);let LoginPage=()=>{let[username,setUsername]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[password,setPassword]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[errorMessage,setErrorMessage]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),{getAuthUrl,handleAuthCode}=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.Vo),handleSubmit=async event=>{if(event.preventDefault(),setErrorMessage(""),!username||!password){setErrorMessage("Le nom d'utilisateur et le mot de passe sont requis");return}try{let response=await fetch("/.netlify/functions/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})}),data=await response.json();response.ok?handleAuthCode(data.access_token):setErrorMessage(data.error||"Erreur lors de la connexion")}catch(error){setErrorMessage("Probl\xe8me de connexion r\xe9seau")}},handleGoogleSignIn=async()=>{try{let authUrl=await getAuthUrl();authUrl?window.location.href=authUrl:setErrorMessage("Erreur lors de la r\xe9cup\xe9ration de l'URL d'authentification")}catch(error){setErrorMessage("Erreur lors de la r\xe9cup\xe9ration de l'URL d'authentification")}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex-grow flex items-center justify-center px-6 py-8",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"max-w-sm w-full",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form",{className:"bg-white rounded-lg shadow-2xl p-6 space-y-10",onSubmit:handleSubmit,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{className:"text-4xl font-bold text-center text-blue-500 mb-4",children:"Connexion"}),errorMessage&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{className:"text-red-500 text-center",children:errorMessage}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"username",className:"text-sm font-bold text-gray-700 block mb-2",children:"Nom d'utilisateur"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"username",type:"text",className:"w-full p-3 rounded-lg bg-gray-200 text-gray-700 placeholder-gray-500",placeholder:"Entrez votre nom d'utilisateur",autoComplete:"username",value:username,onChange:e=>setUsername(e.target.value)})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"password",className:"text-sm font-bold text-gray-700 block mb-2",children:"Mot de passe"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"password",type:"password",className:"w-full p-3 rounded-lg bg-gray-200 text-gray-700 placeholder-gray-500",placeholder:"Entrez votre mot de passe",autoComplete:"current-password",value:password,onChange:e=>setPassword(e.target.value)})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"submit",className:"w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200",children:"Se connecter"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"text-center text-sm text-gray-700",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/",className:"hover:text-blue-500",children:"Mot de passe oubli\xe9 ?"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr",{className:"my-6 border-gray-300"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",className:"w-full p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200",onClick:handleGoogleSignIn,children:"Connexion avec Google"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"mt-6 text-sm text-center text-gray-700",children:["Pas encore de compte ? ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/",className:"hover:text-blue-500",children:"Inscrivez-vous"})]})]})})})})};__webpack_exports__.default=LoginPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=6429)}),_N_E=__webpack_require__.O()}]);