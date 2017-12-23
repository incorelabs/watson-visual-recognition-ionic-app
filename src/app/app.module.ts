import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PicturePage } from "../pages/picture/picture";

import { Camera } from "@ionic-native/camera";
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		PicturePage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		PicturePage
	],
	providers: [
		StatusBar,
		SplashScreen,
		Camera,
		FileTransfer,
		File,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {}
