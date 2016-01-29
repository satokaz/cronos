var fs = require('fs');
var http = require('http');
var path = require('path');

import { window } from 'vscode';

export class ClassLocalServer{
	private static html: string = '';
	private static js: string = '';
	private static json: string = '';
	private static server;
	
	static createServer(html: string, js: string, json: string):void{
		this.html = html, this.js = js, this.json = json;
		this.server = http.createServer((req, res) => {
			var file = req.url, contentType = '';
			if('/' === file){ file = this.html, contentType = 'text/html'; }
			else{
				var ext = path.extname(file);
				switch(ext){
					case '.js' : file = this.js, contentType = 'application/javascript'; break;
					case '.json' : file = this.json, contentType = 'application/json'; break;
				}
			}
			fs.readFile(file, (err, data) => {
				if(err){
					res.writeHead(404), res.end(JSON.stringify(err.message));
					return;
				} res.writeHead(200, {'Content-Type': contentType}), res.end(data);
			});
		}); this.server.listen(3000);
	}
	
	public static closeServer():void{
		this.server.close(() => {
			window.showInformationMessage('Server was shutdown!.');
		});
	}
}