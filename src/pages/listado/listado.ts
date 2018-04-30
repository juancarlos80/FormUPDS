import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-home',
  templateUrl: 'listado.html'
})

export class ListadoPage {
  encuestados: number;

  storage: Storage;
  personas: any;


  constructor(public navCtrl: NavController, public alerCtrl: AlertController, public navParams: NavParams) {    
    this.personas = this.navParams.get('personas');
    console.log(this.personas);
  }


  volver() {
    this.navCtrl.push(HomePage);
  }

}
