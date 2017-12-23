import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File, FileEntry, IFile } from '@ionic-native/file';

/**
 * Generated class for the PicturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-picture',
	templateUrl: 'picture.html',
})
export class PicturePage {
	public base64Image: string;
	public imageLocationOnDevice: string;
	public safeImageURL: SafeUrl;
	public regularString: any;
	public zipCode: string;

	constructor(public navCtrl: NavController, public navParams: NavParams, private _DomSanitizationService: DomSanitizer, private transfer: FileTransfer, private file: File) {
		// this.base64Image = _DomSanitizationService.bypassSecurityTrustUrl(navParams.get('base64Image'));
		this.imageLocationOnDevice = navParams.get("imageLocationOnDevice");
		this.safeImageURL = _DomSanitizationService.bypassSecurityTrustUrl(navParams.get("imageLocationOnDevice"));
	}

	uploadImage() {
		const fileTransfer: FileTransferObject = this.transfer.create();

		const filePath = this.imageLocationOnDevice;
		const fileInfo = {
			name: null,
			type: null,
			size: null
		};

		let getMIMEtype =  this.file.resolveLocalFilesystemUrl(filePath)
			.then((entry: FileEntry) => {
				return new Promise((resolve, reject) => {
					entry.file(meta => resolve(meta), error => reject(error));
				});
			})
			.then((meta: IFile) => {
				fileInfo.name = meta.name;
				fileInfo.type = meta.type; // This is a value compatible with the 'Content-Type' HTTP header
				fileInfo.size = meta.size;
				return new Promise((resolve, reject) => {
					if(fileInfo.type) {
						resolve(1);
					} else {
						reject(0);
					}
				});
			});

		getMIMEtype
			.then(() => {
				// let localEndpoint = "http://192.168.1.167:3000/simple-cors";
				let productionEndpoint = "https://rushil-watson-app.herokuapp.com/simple-cors";
				let apiEndpoint = productionEndpoint;

				let options: FileUploadOptions = {
					fileKey: "images_file",
					mimeType: fileInfo.type,
					params : {
						"zipcode": this.zipCode
					}
				};

				fileTransfer.upload(this.imageLocationOnDevice, apiEndpoint, options, true)
					.then((data) => {
						// success
						console.log("Success");
						console.log(JSON.parse(data.response));
						let responseClassifierData = JSON.parse(data.response).images["0"].classifiers;
						this.createHtmlFromJSON(responseClassifierData);
					}, (err) => {
						// error
						console.log("Error");
						console.log(err);
					});

			})
			.catch(err => console.log("Error:: " + err));
	}

	createHtmlFromJSON(classifierData) {
		let randomString = "";
		for(let classifier of classifierData) {
			randomString += "<div><b>Classifier ID:: </b>"+ classifier.classifier_id +"</div><br/>";
			for(let classifierClass of classifier.classes) {
				let jsonStr = JSON.stringify(classifierClass);

				let f = {
					brace: 0
				}; // for tracking matches, in particular the curly braces

				let regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m:string, p1): any {
					let rtnFn:any = function() {
						return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
					};
					let rtnStr = 0;

					if (p1.lastIndexOf('{') === (p1.length - 1)) {
						rtnStr = rtnFn();
						f['brace'] += 1;
					} else if (p1.indexOf('}') === 0) {
						f['brace'] -= 1;
						rtnStr = rtnFn();
					} else {
						rtnStr = rtnFn();
					}
					return rtnStr;
				});

				randomString += regeStr;
			}
			randomString += "<br/><br/>";
		}
		this.regularString = this._DomSanitizationService.bypassSecurityTrustHtml(randomString);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PicturePage');
	}
}
