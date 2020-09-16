var exp=require("express");
var mysql=require("mysql");
var bodyparser=require("body-parser");
var str = require('@supercharge/strings');

con=exp();
con.use(bodyparser.json());
con.use(bodyparser.urlencoded({extended: false}));
con.use(exp.static("public"));

var sql=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Arizona"
})
sql.connect(function(err) {
  if (err) {
  	console.log(err);
  }
  console.log("Connected!");
});
sql.query("CREATE DATABASE IF NOT EXISTS Url");
sql.query("USE Url");
sql.query("CREATE TABLE IF NOT EXISTS Url(Main varchar(100) not null primary key,Short varchar(6) not null)");
con.get("/",function(req,resp){
	var obj=[];
	sql.query("SELECT * FROM Url",function(err,res,fields){
		for(i=0;i<res.length;i++){
			obj.push({
				main:res[i].Main,
				short: res[i].Short
			})
		}
		var send={
			obj:obj
		};
		resp.render("abc.ejs",send);
		resp.end();

	})
	
})
con.post("/url",function(req,res){
	var r=str.random(5);
	var id=req.body.id;
	sql.query("INSERT INTO Url(Main,Short) VALUES (?,?)",[id,r],function(err,results,fields){
		if(err) throw err;
	})
	res.redirect("/");

})
con.get("/:id/s",function(req,resp){
	var n1=req.params.id;
	sql.query("SELECT * FROM Url WHERE Short=?",n1,function(err,res,fields){
		var page=res[0].Main;
		resp.redirect(page);
		resp.end();

	})




})


con.listen(3000)
