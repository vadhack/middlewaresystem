
var app = require("./server");

app.use(function MetodosPersonalizados(req,res,next){ //agregamos middleware definiendo nuestros métodos
	req.minify= function(t){
		//magia para minificar código
		return t+ ' (ejemplo minify)';
	}
	req.render= function(t){
		//magia para renderizar html
		return t+ ' (ejemplo renderizar)';
	}
	res.send= function(contenido){
		res.writeHead(200, {"Content-Type": "text/plain",'X-Powered-By':'vadHack'});
    	res.write(contenido);
    	res.end();
	}
	next();
});
app.get("/", function(req,res){
	var contenido= req.minify("VADHACK: codigo de ejemplo para enviar al cliente");
	res.send(req.render(contenido) );
});

app.run();//corremos servidor