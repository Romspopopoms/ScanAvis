(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[838],{4742:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/generated/kaoiur",function(){return __webpack_require__(7133)}])},7133:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294);let Page=()=>{let[email,setEmail]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),handleSubmit=async e=>{e.preventDefault();try{let response=await fetch("https://hook.eu2.make.com/y4k7i4onsckj63x4c7j1l51dqus6yu3q?",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,pageId:"63d645b3-58fa-4f5e-ba64-436a3c07f683",name:"Romain Santiago",entreprise:"Moiiiz",subscriptionItems:"Gold"})});response.ok?alert("Merci pour votre soumission!"):alert("Une erreur est survenue lors de la soumission.")}catch(error){console.error("Erreur lors de la soumission:",error),alert("Erreur lors de la communication avec le serveur.")}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"relative bg-cover bg-center h-screen flex items-center justify-center",style:{backgroundImage:'url("https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/Bg.jpg?raw=true")',backgroundSize:"cover",backgroundPosition:"center center",backgroundRepeat:"no-repeat",height:"100vh",width:"100vw"},children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex flex-col items-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img",{src:"https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/logosimple.png?raw=true",alt:"Logo",className:"mb-6 h-12 w-12"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1",{className:"text-4xl text-white mb-4",children:"Kaoiur"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form",{onSubmit:handleSubmit,className:"bg-white bg-opacity-75 rounded-lg p-4 shadow-lg mb-6",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{type:"email",value:email,onChange:e=>setEmail(e.target.value),placeholder:"Entrez votre email",className:"appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"submit",className:"bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition ease-in-out duration-300",children:"Envoyer"})]})]})})};__webpack_exports__.default=Page}},function(__webpack_require__){__webpack_require__.O(0,[774,888,179],function(){return __webpack_require__(__webpack_require__.s=4742)}),_N_E=__webpack_require__.O()}]);