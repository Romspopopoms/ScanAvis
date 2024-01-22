(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[459],{6429:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login",function(){return __webpack_require__(4754)}])},4754:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4642),_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(5361);let LoginPage=()=>{let[username,setUsername]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[password,setPassword]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[errorMessage,setErrorMessage]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),{getAuthUrl}=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.Vo),handleSubmit=async event=>{if(event.preventDefault(),setErrorMessage(""),!username||!password){setErrorMessage("Le nom d'utilisateur et le mot de passe sont requis");return}try{let response=await fetch("/.netlify/functions/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})}),data=await response.json();response.ok?console.log("Connexion r\xe9ussie:",data):(console.error("Erreur lors de la connexion:",data.message),setErrorMessage(data.message||"Erreur lors de la connexion"))}catch(error){console.error("Erreur de r\xe9seau:",error),setErrorMessage("Probl\xe8me de connexion r\xe9seau")}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex flex-col min-h-screen bg-night text-gray-300",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components__WEBPACK_IMPORTED_MODULE_3__.wp,{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex-grow flex items-center justify-center px-4 py-6",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form",{className:"w-full max-w-lg bg-linear-gradient(135deg, #0f0c29, #302b63, #24243e p-8 space-y-6 shadow-xl rounded-lg",onSubmit:handleSubmit,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{className:"text-3xl font-bold text-center text-violet mb-8",children:"Login"}),errorMessage&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"text-red-500 mb-2",children:errorMessage})," ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"space-y-4",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"username",className:"block text-lg font-semibold text-night",children:"Nom de compte"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"username",type:"text",value:username,onChange:e=>setUsername(e.target.value),className:"w-full px-4 py-3 border rounded-md bg-night bg-opacity-10 border-violet focus:border-lightblue focus:bg-opacity-100 text-white"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"space-y-4",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"password",className:"block text-lg font-semibold text-night",children:"Mot de passe"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"password",type:"password",value:password,onChange:e=>setPassword(e.target.value),className:"w-full px-4 py-3 border rounded-md bg-night bg-opacity-10 border-violet focus:border-lightblue focus:bg-opacity-100 text-white"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"submit",className:"w-full bg-blue-600 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out text-white",children:"Se connecter"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",className:"w-full bg-purple-600 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out text-white",onClick:getAuthUrl,children:"S'identifier avec Google"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center justify-between mt-4",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label",{htmlFor:"remember-me",className:"flex items-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"remember-me",type:"checkbox",className:"rounded text-blue-500 focus:ring-blue-500"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"ml-2 text-sm text-night",children:"Se souvenir de moi"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/forgot-password",className:"text-sm hover:text-blue-500",children:"Vous avez perdu votre mot de passe?"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{className:"mt-6 text-center text-sm",children:["Vous n'avez pas de compte? ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/register",className:"hover:text-blue-500",children:"Inscrivez-vous"})]})]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components__WEBPACK_IMPORTED_MODULE_3__.$_,{className:"w-full mt-auto bg-night p-4 text-center text-white"})]})};__webpack_exports__.default=LoginPage}},function(__webpack_require__){__webpack_require__.O(0,[361,774,888,179],function(){return __webpack_require__(__webpack_require__.s=6429)}),_N_E=__webpack_require__.O()}]);