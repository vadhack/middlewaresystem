
var http = require("http");

var middlewares=[];//declaramos el array que contendrán todos los middlewares

var Engine= function() {
	var error = function(err,mw){
  		console.log('Error',err);
        console.log(mw);
  	},
    handle = error;
    console.log('Corriendo Middlewares:');
  	Array.prototype.slice.call(middlewares).reverse().forEach(function (mw) {
    	var child = handle;
        console.log(mw);
    	handle = function (req, res) {
    	    try {
    	        mw(req, res, function (err) {
    	           if (err) { return error(err, mw); }
    	           child(req, res);
    	        });
    	    }catch (err) {
    	       error(err, mw);
    	    }
    	};
  	});
  	return handle;
}


// Este código es un ejemplo, de hecho faltan implementar más cosas,
// depende del ingenio de cada uno.

//definamos la variable server
var server={} //definimos server como objeto
var url= require("url");

server.use= function(mw){
	if(typeof mw == "function") middlewares.push(mw);
}
var routes= {//definimos rutas
	GET: {}
}
server.get= function(route,mw){
	routes['GET'][route]={};
	routes['GET'][route].middleware=mw;//guardamos ruta y su middleware
}
function Routes(req, res, next) {
    var pathname = url.parse(req.url).pathname; //obtenemos el pathname
    var isRoute= function(req,res,pathname){
        if(typeof routes[req.method][pathname]=='object'){
            var mw=routes[req.method][pathname].middleware;
            mw(req,res,next);
            return true;
        }
        return false;
    }
    if(isRoute(req,res,pathname)) return; //si es ruta finaliza
    next();  //si no es ruta pasa al siguiente middlware
};


server.run= function(){
	server.use(Routes); //instalamos el middleware "Routes"
	http.createServer(Engine()).listen(80); //aqui es donde deben correr el servidor.
}

console.log("Corriendo servidor en localhost/");

module.exports = server;