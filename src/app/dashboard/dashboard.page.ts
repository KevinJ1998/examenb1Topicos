// dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { FirebaseService } from '../services/firebase.service';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import firebase from 'firebase';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';


@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ],
} )
export class DashboardPage implements OnInit {

  userEmail: string;
  uid: any;
  message: any;
  chats: any = [];
  tmpImage: any = undefined;
  imgUrlEnc: any;
  messageEnc: any;
  secretKey: any = environment.messageKeyEncryption;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private firebaseSrv: FirebaseService,
    private actionSheetController: ActionSheetController,
    private camera: Camera
  ) { }

  ngOnInit() {
    this.authService.userDetails().subscribe( res => {
      console.log( 'res', res );
      if ( res !== null ) {
        this.userEmail = res.email;
        this.uid = res.uid;
      } else {
        this.navCtrl.navigateBack( '' );
      }
    }, err => {
      console.log( 'err', err );
    } );
    this.firebaseSrv.getMessages().on( 'value', ( messageSnap ) => {
      this.chats = [];
      let bytes = null;
      messageSnap.forEach( ( messageData ) => {
        console.log( 'messageData', messageData.val() );
        if ( messageData.val().message ) {
          this.messageEnc = messageData.val().message;
          bytes = CryptoJS.AES.decrypt( this.messageEnc, this.secretKey );
          this.chats.push( {
            email: messageData.val().email,
            message: bytes.toString( CryptoJS.enc.Utf8 ),
          } );
        } else {
          this.imgUrlEnc = messageData.val().imageMessage;
          bytes = CryptoJS.AES.decrypt( this.imgUrlEnc, this.secretKey );
          this.chats.push( {
            email: messageData.val().email,
            imageMessage: bytes.toString( CryptoJS.enc.Utf8 )
          } );
        }
      } );
    } );
  }

  async sendMessage() {
    let messageToSend = {};
    if ( this.tmpImage !== undefined ) {
      messageToSend = {
        uid: this.uid,
        imageMessage: CryptoJS.AES.encrypt( this.message, this.secretKey ).toString(),
        email: this.userEmail
      };
    } else {
      messageToSend = {
        uid: this.uid,
        message: CryptoJS.AES.encrypt( this.message, this.secretKey ).toString(),
        email: this.userEmail
      };
    }
    try {
      await this.firebaseSrv.sendMessage( messageToSend );
      this.message = '';
    } catch ( e ) {
      console.log( 'error', e );
    }
  }

  takePhoto( sourceType ) {
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType
      };

      this.camera.getPicture( options )
        .then( async ( imageData ) => {
          console.log( 'IMAGE DATA', imageData );
          this.tmpImage = 'data:image/jpeg;base64,' + imageData;
          const randomNumber = Math.floor( Math.random() ) * 20;
          const putPictures = firebase.storage().ref( 'imagesMessage/' + this.uid + randomNumber + '.jpeg' );
          putPictures.putString( this.tmpImage, 'data_url' ).then( ( snapshot ) => {
            console.log( 'snapshot', snapshot.ref );
          } );
          const getPicture = firebase.storage().ref( 'imagesMessage/' + this.uid + randomNumber + '.jpeg' ).getDownloadURL();
          getPicture.then( ( url ) => {
            this.message = url;
          } );
        } )
        .catch( ( e ) => {
          console.log( e );
          this.tmpImage = undefined;
        } );
    } catch ( e ) {
      console.log( e );
      this.tmpImage = undefined;
    }
  }

  async presentActionSheetCamera() {
    const actionSheet = await this.actionSheetController.create( {
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.takePhoto( this.camera.PictureSourceType.CAMERA );
          }
        }, {
          text: 'Ver imágenes guardadas',
          handler: () => {
            this.takePhoto( this.camera.PictureSourceType.PHOTOLIBRARY );
          }
        }, {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    } );
    await actionSheet.present();
  }

  logout() {
    this.authService.logoutUser()
      .then( res => {
        console.log( res );
        this.navCtrl.navigateBack( '' );
      } )
      .catch( error => {
        console.log( error );
      } );
  }
}
