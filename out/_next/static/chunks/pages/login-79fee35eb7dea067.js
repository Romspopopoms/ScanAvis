(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[459],{6429:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login",function(){return __webpack_require__(4754)}])},4754:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4642);let LoginPage=()=>{let[username,setUsername]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),[password,setPassword]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),{getAuthUrl}=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.Vo),handleSubmit=async event=>{if(event.preventDefault(),!username||!password){console.log("Le nom d'utilisateur et le mot de passe sont requis");return}try{let response=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})}),data=await response.json();response.ok?console.log("Connexion r\xe9ussie:",data):console.error("Erreur lors de la connexion:",data.message)}catch(error){console.error("Erreur de r\xe9seau:",error)}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-night",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form",{className:"w-full max-w-md bg-white p-8 space-y-6 shadow-md rounded-md",onSubmit:handleSubmit,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{className:"text-xl font-bold text-center text-night",children:"Login"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"input-group",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"username",className:"text-violet",children:"Nom de compte"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"username",type:"text",value:username,onChange:e=>setUsername(e.target.value),className:"w-full p-2 border border-lightblue rounded-md"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"input-group",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"password",className:"text-violet",children:"Mot de passe"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"password",type:"password",value:password,onChange:e=>setPassword(e.target.value),className:"w-full p-2 border border-lightblue rounded-md"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"submit",className:"w-full bg-blue text-white p-2 rounded-md hover:bg-lightblue transition duration-200",children:"Se connecter"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"button",className:"w-full bg-violet text-white p-2 rounded-md hover:bg-lightblue transition duration-200",onClick:getAuthUrl,children:"S'identifier avec Google"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"form-footer text-sm",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center justify-between",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex items-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"remember-me",type:"checkbox",className:"form-checkbox"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"remember-me",className:"ml-2 text-night",children:"Se souvenir de moi"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/forgot-password",className:"text-blue hover:text-lightblue",children:"Vous avez perdu votre mot de passe?"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"text-center",children:["Vous n'avez pas de compte? ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"/register",className:"text-blue hover:text-lightblue",children:"Inscrivez-vous"})]})]})]})})};__webpack_exports__.default=LoginPage}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=6429)}),_N_E=__webpack_require__.O()}]);