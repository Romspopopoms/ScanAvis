(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[459],{6429:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login",function(){return __webpack_require__(4754)}])},4754:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4642),_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(5361);let LoginPage=()=>{let[username,setUsername]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[password,setPassword]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[errorMessage,setErrorMessage]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),{getAuthUrl,handleAuthCode}=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.Vo),handleSubmit=async event=>{if(event.preventDefault(),setErrorMessage(""),!username||!password){setErrorMessage("Le nom d'utilisateur et le mot de passe sont requis");return}try{let response=await fetch("/.netlify/functions/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})}),data=await response.json();response.ok?handleAuthCode(data.access_token):setErrorMessage(data.error||"Erreur lors de la connexion")}catch(error){setErrorMessage("Probl\xe8me de connexion r\xe9seau")}},handleGoogleSignIn=async()=>{try{let authUrl=await getAuthUrl();authUrl?window.location.href=authUrl:setErrorMessage("Erreur lors de la r\xe9cup\xe9ration de l'URL d'authentification")}catch(error){setErrorMessage("Erreur lors de la r\xe9cup\xe9ration de l'URL d'authentification")}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components__WEBPACK_IMPORTED_MODULE_3__.wp,{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex-grow flex items-center justify-center p-4",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"w-full max-w-md",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form",{className:"bg-gray-700 bg-opacity-80 rounded-lg shadow-xl p-8 space-y-6",onSubmit:handleSubmit,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{className:"text-3xl font-bold text-center text-white mb-4",children:"Connexion"}),errorMessage&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{className:"text-red-500 text-center",children:errorMessage}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"username",className:"text-sm font-bold text-white block mb-2",children:"Nom d'utilisateur"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"username",type:"text",value:username,onChange:e=>setUsername(e.target.value),className:"w-full mt-2 p-3 rounded text-gray-900",placeholder:"Entrez votre nom d'utilisateur",autoComplete:"username"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"password",className:"text-sm font-bold text-white block mb-2",children:"Mot de passe"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"password",type:"password",value:password,onChange:e=>setPassword(e.target.value),className:"w-full mt-2 p-3 rounded text-gray-900",placeholder:"Entrez votre mot de passe",autoComplete:"current-password"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"submit",className:"w-full mt-4 bg-blue-500 text-white p-3 rounded hover:bg-blue-600",children:"Se connecter"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"text-center text-white",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/forgot-password",className:"text-sm hover:text-blue-400",children:"Mot de passe oubli\xe9 ?"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr",{className:"my-6 border-gray-500"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",onClick:handleGoogleSignIn,className:"w-full bg-red-500 text-white p-3 rounded hover:bg-red-600",children:"Connexion avec Google"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"mt-6 text-sm text-center text-white",children:["Pas encore de compte ? ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/register",className:"hover:text-blue-400",children:"Inscrivez-vous"})]})]})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components__WEBPACK_IMPORTED_MODULE_3__.$_,{className:"w-full p-4 text-center text-white bg-gray-900"})]})};__webpack_exports__.default=LoginPage}},function(__webpack_require__){__webpack_require__.O(0,[361,774,888,179],function(){return __webpack_require__(__webpack_require__.s=6429)}),_N_E=__webpack_require__.O()}]);