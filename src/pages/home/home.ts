import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Camera, CameraOptions } from "@ionic-native/camera";

import { PicturePage } from "../picture/picture"

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	public base64Image: string;
	public imageLocationOnDevice: string;

	constructor(public navCtrl: NavController, private camera: Camera) {

	}

	useCamera() {
		const options: CameraOptions = {
			sourceType: this.camera.PictureSourceType.CAMERA,
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			mediaType: this.camera.MediaType.PICTURE
		};

		this.camera.getPicture(options).then(imageData => {
			console.log(imageData);
			this.imageLocationOnDevice = imageData;
			// this.base64Image = imageData;
			// this.base64Image = "data:image/jpeg;base64," + imageData;
			this.navCtrl.push(PicturePage, {
				imageLocationOnDevice: this.imageLocationOnDevice
			});
		}, (err) => {
			console.log(err);
		});
	}

	useGallery() {
		const options: CameraOptions = {
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: this.camera.DestinationType.FILE_URI,
			mediaType: this.camera.MediaType.PICTURE
		};

		this.camera.getPicture(options).then(imageData => {
			console.log(imageData);
			this.imageLocationOnDevice = imageData;
			// this.base64Image = imageData;
			// this.base64Image = "data:image/jpeg;base64," + imageData;
			this.navCtrl.push(PicturePage, {
				imageLocationOnDevice: this.imageLocationOnDevice
			});
		}, (err) => {
			console.log(err);
		});

	}
}
