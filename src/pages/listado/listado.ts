import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';

import { LoadingController } from 'ionic-angular'

import { HomePage } from '../home/home';



@Component({
  selector: 'page-home',
  templateUrl: 'listado.html'
})

export class ListadoPage {
  encuestados: number;
  personas: any;
  //http: HTTP;

  constructor(public navCtrl: NavController,
              public alerCtrl: AlertController,
              public navParams: NavParams,
              public http: HTTP,
              public storage: Storage,
              public loadingCtrl: LoadingController) {

    this.personas = this.navParams.get('personas');
  }


  volver() {
    this.navCtrl.push(HomePage);
  }

  mandar(){

    if( this.personas.length == 0 ){
      this.mostrarError("No hay información para enviar");
      return;
    }

    let loader = this.mostrar_loader();

    //this.http.post('http://localhost/upds_form/send_data.php',
    this.http.post('http://www.quarksocialcloud.com/apps_server/UPDS/Apps/FormularioMovil/send_data.php',
      { users : JSON.stringify(this.personas) }, {}
    ).then(data => {
      let response;
      try {
        response = JSON.parse(data.data);
      } catch( er_json ){
        this.ocultar_loader(loader);
        this.mostrarError( "Existe un problema con el envio del correo, intentelo nuevamente si el problema persiste contactese con su proovedor" );
        return;
      }

      this.ocultar_loader(loader);
      if( response.success == true ){
        this.mostrarExito();
      } else {
        this.mostrarError( response.reason );
      }
    }).catch(error => {
      this.ocultar_loader(loader);
      this.mostrarError("No se pudo enviar los datos, compruebe su conexión e intentelo nuevamente");
    });
  }

  borrar(){
    let alert = this.alerCtrl.create({
    title: 'Eliminar Datos',
    message: 'Confirmas borrar permamentemente la informacion del equipo?',
    buttons: [
      {
        text: 'No Borrar',
        role: 'cancel'
      },
      {
        text: 'Si Borrar',
        handler: () => {
          console.log('Ahora si borrar');
          this.storage.set('encuestados', 0);
          this.personas = [];
        }
      }
    ]});
    alert.present();
  }

  mostrarExito(){
    let alert = this.alerCtrl.create({
      title: 'Los datos se enviaron exitosamente!',
      buttons: ['Ok']
    });
    alert.present()
  }

  mostrarError(mensaje: string){
    let alert = this.alerCtrl.create({
      title: mensaje,
      buttons: ['Ok']
    });
    alert.present()
  }

  mostrar_loader() {
    let loading = this.loadingCtrl.create({
      content: 'Enviando...'
    });

    loading.present();
    return loading;
  }

  ocultar_loader(loader){
    loader.dismiss();
  }

}
