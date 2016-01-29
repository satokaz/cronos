var fs = require('fs');

import { ExtensionContext, workspace, TextDocument, window, commands} from 'vscode';
import { ClassVersionFiles } from './classVersionFiles';
import { ClassLocalServer } from './classLocalServer';

export function activate(context: ExtensionContext) {
	var active = !1, folder, versionFiles, lang, fileName,
		dataFile, vFiles;
	
	let command = commands.registerCommand('extension.cronos', () => {
		if(undefined === workspace.rootPath){
			window.showWarningMessage('Please, open a project folder to execute the exetension.');
			return;
		}else{
			active = !0;
			window.showInformationMessage('Cronos has been started at port localhost:3000!');
			folder = workspace.rootPath.replace(/^\/[\w\d]+\/[\w\d]+\//igm,'')+'/cronostime';
			fs.lstat(folder, (err) => {
				if(err){
					fs.mkdir(folder, () => {
						fs.openSync(folder+'/cronos.time.json', 'w');
						fs.openSync(folder+'/cronos.time.html', 'w');
						fs.openSync(folder+'/cronos.time.js', 'w');
					});
					window.showInformationMessage('The next things have been created:',
												  'cronos.time.json',
												  'cronos.time.html',
												  'cronos.time.js');
				}
			}); ClassLocalServer.createServer(folder+'/cronos.time.html',
											  folder+'/cronos.time.js',
											  folder+'/cronos.time.json');
		}
	});
	
	let saveTextContext = workspace.onDidSaveTextDocument((textDocument: TextDocument) => {
		 if(active){
			versionFiles = ClassVersionFiles.getInstance();
			lang = textDocument.languageId;
			fileName = textDocument.fileName;
			if('cronos.time.js' !== fileName &&
			   'cronos.time.json' !== fileName &&
			   'cronos.time.html' !== fileName){
				fileName = fileName.substr(fileName.lastIndexOf('\/')+1, fileName.length);
				dataFile = textDocument.getText();
				
				vFiles = ClassVersionFiles.getInstance();
				vFiles.setLang(lang);
				vFiles.setFileName(fileName);
				vFiles.setDataFile(dataFile);
				vFiles.setFolders([folder+'/cronos.time.json', folder+'/cronos.time.html', folder+'/cronos.time.js']);
				vFiles.save();
			}else{
				window.showWarningMessage('It isn\'t good to modify some cronos files');
			}
		 }
	});
	context.subscriptions.push(command, saveTextContext);
}

export function deactivate() {
	ClassLocalServer.closeServer();
}