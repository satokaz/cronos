var fs = require('fs');
import { window } from 'vscode';
import { ClassHTMLMaker } from './classHTMLMaker';

export class ClassVersionFiles{
	private static instance: ClassVersionFiles = null;
	private lang: string = '';
	private fileName: string = '';
	private dataFile: string = '';
	private folders: Array<string> = [];
	private fileVersion: {[key:string]:{}} = {};
	
	static getInstance():ClassVersionFiles{
		if(null === ClassVersionFiles.instance){
			ClassVersionFiles.instance = new ClassVersionFiles();
		} return ClassVersionFiles.instance;	
	}
	
	public setLang(lang: string):void{ this.lang = lang; }
	
	public setFileName(fileName: string):void{ this.fileName = fileName; }
	
	public setDataFile(dataFile: string):void{ 
		this.dataFile = dataFile.replace(/\n+/igm, '<br/>')
								.replace(/\t+/igm,'&emsp;');    
	}
	
	public setFolders(folders: Array<string>):void{ this.folders = folders; }
	
	public save():void{
		if('' !== this.lang && '' !== this.fileName && '' !== this.dataFile && 0 < this.folders.length){
			fs.readFile(this.folders[0], 'utf8', (err, data) => {
				if(err){ window.showErrorMessage('There was an error trying to read the cronos.time.json file');	return;}
				else{
					if('' === data){
						this.fileVersion[this.lang] = this.append('{}');
						this.saveData();
					}else{
						this.fileVersion = JSON.parse(data);
						this.fileVersion[this.lang] = this.append(data);
						this.saveData();
					}
				}
			});
		}
	}
	
	private saveData():void{
		fs.writeFile(this.folders[0], JSON.stringify(this.fileVersion), (err) => {
			if(err){ window.showErrorMessage('There was an error trying to wite into the cronos.time.json file'); return; }
			else{
				window.setStatusBarMessage('The data was saved correctly :)', 1600);
				ClassHTMLMaker.getInstance()
							  .setPathFiles(this.folders)
							  .makeHTML();
			}
		});
	}
	
	private append(arrData: string):Object{
		var obj: {[key: string]: string} = {},
			arrJSON: {[key: string]: string} = {};

		if(undefined !== JSON.parse(arrData)[this.lang]){ arrJSON = JSON.parse(arrData)[this.lang]; }
		if(undefined === arrJSON[this.fileName]){ arrJSON[this.fileName] = ''; }
		
		var version;	
		if(0 >= Object.keys(arrJSON[this.fileName]).length){
			obj[this.fileName+'-'+1] = this.dataFile;
			version = obj;
		}else{
			version = arrJSON[this.fileName];
			var lastKey = Object.keys(version).pop();
				lastKey = (parseInt(lastKey.substr(lastKey.length-1, lastKey.length))+1).toString();
			version[this.fileName+'-'+lastKey] = this.dataFile;
		}		
		arrJSON[this.fileName] = version;
		return arrJSON;
	}
}