// firebase.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable( {
  providedIn: 'root'
} )
export class FirebaseService {

  constructor(
    private afdatabase: AngularFireDatabase
  ) { }

  sendMessage( record ) {
    console.log( record );

    return this.afdatabase.list( '/chats/' ).push( record );
  }

  getMessages() {
    return this.afdatabase.database.ref( '/chats' );
  }
}
