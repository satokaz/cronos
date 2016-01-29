var fs = require('fs');
import { window } from 'vscode';
import { ClassVersionFiles } from './classVersionFiles';

export class ClassHTMLMaker{
	private pathFiles: Array<string> = [];
	private fileVersion: Object = {};
	private static instance: ClassHTMLMaker = null;

	static getInstance():ClassHTMLMaker{
		if(null === ClassHTMLMaker.instance){
			ClassHTMLMaker.instance = new ClassHTMLMaker();
		} return ClassHTMLMaker.instance;	
	}
	
	public setPathFiles(pathFiles: Array<string>):ClassHTMLMaker{
		this.pathFiles = pathFiles;
		return this;
	}
	
	public makeHTML():void{
		fs.readFile(this.pathFiles[1], 'utf8', (err, data) => {
			if(err){
				window.showErrorMessage('There was an error trying to read the cronos.time.svn file');
			}else{
				this.fileVersion = JSON.parse(fs.readFileSync(this.pathFiles[0], 'utf8'));
				data = this.openHTML() + this.makeCSS() + this.openBody() +
					   this.leftWidget() + this.topNav() + this.closeBody();
				fs.writeFile(this.pathFiles[1], data, (err) => {
					if(err){
						window.showErrorMessage('There was an error trying to wite into the cronos.time.svn file');
					}
				});
				fs.writeFile(this.pathFiles[2], this.makeJS(), (err) => {
					if(err){
						window.showErrorMessage('There was an error trying to wite into the cronos.time.svn file');
					}
				});
			}
		});
	}
	
	private openHTML():string{ return '<html lang="en"><head><meta charset="utf-8"/></head>'; }
	
	private openBody():string{ return '<body><div id="grid-container"><div class="grid-100">'; }
	
	private closeBody():string{ return '</div></div><script src="./cronos.time.js"></script></body></html>'; }
	
	private leftWidget(): string{
		var d, u, div = '<div class="grid-25"><div id="left-title" class="text-content grid-100">Files</div><div id="content" class="grid-100">';
		for(d in this.fileVersion){
			div += '<div>'+d+'</div><ul>';
			for(u in this.fileVersion[d]){
				div += '<li class="file" data-file="'+u+'" data-name="'+d+'"><div class="ripple"></div>'+u+'</li>';
			} div +='</ul>';
		} div += '</div></div>'; 
		return div;
	}
	
	private topNav():string{
		var d, a, x, div = '<div class="text-content grid-75"><div class="grid-100"><div id="right-title" class="grid-25">Versions</div><div id="select-versions" class="grid-25"><label>Select version</label><div id="versions-content"><ul id="versions" class="hide"></ul></div></div><div id="num" class="grid-50">v1.0</div></div><div class="grid-100"><div id="codes-content"><div id="codes" class="grid-100"></div></div></div></div>';
		return div;
	}	

	private makeJS(): string{
	 	var js = 'function getJSON(e){var t=new XMLHttpRequest;t.overrideMimeType("application/json"),t.open("GET","./cronos.time.json",!0),t.onreadystatechange=function(){4===t.readyState&&200===t.status?e(JSON.parse(t.responseText)):!1},t.send()}var sv=document.getElementById("select-versions"),open=!1,v=document.getElementById("versions"),fi=document.getElementsByClassName("file"),co=document.getElementById("codes"),fc,dF,dN,rr;sv.onclick=function(){if(void 0!==rr){var e=this.children[1];open?(e.className="grid-25 up",v.className="hide",open=!1):(e.className="grid-25 drop",v.className="show",open=!0)}};var cFunc=function(){co.textContent="",co.innerHTML=rr[dN][dF][this.getAttribute("data-text")]},fFunc=function(){sv.style.color="#b4c3ca";var e=this.children[0];e.className="ripple ripple-anim";var t=setTimeout(function(){e.className="ripple",clearTimeout(t)},600);dF=this.getAttribute("data-file"),dN=this.getAttribute("data-name"),getJSON(function(e){rr=e;var t,n,c=document.createDocumentFragment();v.textContent="";for(t in e[dN][dF])c.appendChild(n=document.createElement("li"),n.setAttribute("data-text",t),n.className="code",n.textContent=t,n.onclick=cFunc);v.appendChild(c)})};for(fc in fi)fi[fc].onclick=fFunc;';
		return js;
	}
	
	private makeCSS(): string{
		var css = '<style>body{font-family:Open Sans;width:100%;height:100%;margin:0;padding:0;left:0;right:0;top:0;bottom:0;overflow:hidden;font-size:100%}ul{list-style:none;color:#b0bec5}.hide{display:none;opacity:0;filter:alpha(opacity=0)}.drop{-webkit-animation:dropdown 1s ease-in forwards;-o-animation:dropdown 1s ease-in forwards;-moz-animation:dropdown 1s ease-in forwards;animation:dropdown 1s ease-in forwards;overflow:scroll}.up{-webkit-animation:upside .5s ease-in forwards;-o-animation:upside .5s ease-in forwards;-moz-animation:upside .5s ease-in forwards;animation:upside .5s ease-in forwards}.show{display:inline;opacity:1;filter:alpha(opacity=1);padding-left:0}#versions-content{width:98%;cursor:pointer}#grid-container{width:1280px;height:auto;margin:auto;position:relative}.grid-25,.grid-100,.grid-75,.grid-50{float:left;padding:0 .4em;height:100%}.grid-50{width:50%}.grid-100{width:100%}.grid-25{width:23%}.grid-75{width:75%}.text-content{height:3em;line-height:3em;background:#2196f3;color:#fff;text-align:center;margin-bottom:.8em}#codes{background:linear-gradient(#fafafa 50%,#f1f1f1 30%);background-size:100% 3em;line-height:1.5em;text-align:left;padding:1.5em;font-family:monospace;border-left:2px solid #f5f5f5;height:auto}#codes-content{color:#000;width:100%;float:left;margin:.4em 0;height:36em;overflow-y:scroll;background:-webkit-linear-gradient(#fff 30%,transparent),radial-gradient(at 50% 0,rgba(170,170,170,.2),transparent 70%);background:-o-linear-gradient(#fff 30%,transparent),radial-gradient(at 50% 0,rgba(170,170,170,.2),transparent 70%);background:linear-gradient(#fff 30%,transparent),radial-gradient(at 50% 0,rgba(170,170,170,.2),transparent 70%);background-repeat:no-repeat;background-size:100% 50px,100% 8px;background-attachment:local,scroll}#select-versions{height:auto;color:#e1e7ea;background:#fff;margin-top:.45em;margin-left:25%;position:absolute;z-index:2;border:solid 1px #f5f5f5}#select-versions>label{line-height:2em;cursor:pointer}#select-versions>ul{padding:0;text-align:center;font-size:.9em}#select-versions>ul>li{height:2.3em;line-height:2.3em}#num{float:right;text-align:right;padding-right:.8em;font-size:.8em}#left-title{font-size:1.2em}#right-title{position:relative}#content{overflow-y:scroll;height:86%;background:-webkit-linear-gradient(#fff 30%,transparent),radial-gradient(at 50% 0,rgba(170,170,170,.2),transparent 70%);background:-o-linear-gradient(#fff 30%,transparent),radial-gradient(at 50% 0,rgba(170,170,170,.2),transparent 70%);background:linear-gradient(#fff 30%,transparent),radial-gradient(at 50% 0,rgba(170,170,170,.2),transparent 70%);background-repeat:no-repeat;background-size:100% 50px,100% 8px;background-attachment:local,scroll}#content>ul{padding-left:15%;font-size:.9em}#content>ul>li{cursor:pointer;margin:.4em 0;line-height:1.8em}.ripple{position:absolute;background:#B2DFDB;z-index:2;height:1.8em;left:3%;width:0;border-radius:50%;opacity:0;z-index:-2}#content>ul>li:hover{color:#cfd8dc}#content>div{cursor:default;margin-left:6%;font-size:1.15em;color:#42a5f5;font-weight:400;width:94%}.ripple-anim{-webkit-animation:ripple .6s ease-in-out forwards;-moz-animation:ripple .6s ease-in-out forwards;-o-animation:ripple .6s ease-in-out forwards;animation:ripple .6s ease-in-out forwards}@-webkit-keyframes ripple{0%{opacity:.6}100%{width:22%;opacity:0;border-radius:0}}@-o-keyframes ripple{0%{opacity:.6}100%{width:22%;opacity:0;border-radius:0}}@-moz-keyframes ripple{0%{opacity:.6}100%{width:22%;opacity:0;border-radius:0}}@keyframes ripple{0%{opacity:.6}100%{width:22%;opacity:0;border-radius:0}}@-webkit-keyframes dropdown{0%{height:0}100%{height:10em}}@-moz-keyframes dropdown{0%{height:0}100%{height:10em}}@-o-keyframes dropdown{0%{height:0}100%{height:10em}}@keyframes dropdown{0%{height:0}100%{height:10em}}@-o-keyframes upside{0%{height:10em}100%{height:0}}@-webkit-keyframes upside{0%{height:10em}100%{height:0}}@-moz-keyframes upside{0%{height:10em}100%{height:0}}@keyframes upside{0%{height:10em}100%{height:0}}</style>';
		return css;
	}
}