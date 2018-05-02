import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ListadoPage } from '../listado/listado';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  nombres: string;
  apellidos: string;
  nacimiento: string;
  email: string;
  ciudad: string;
  celular: string;
  colegio: string;

  fempresariales: string;
  fingenieria: string;
  fjuridicas: string;

  encuestados: number;

  storage: Storage;
  personas: any;

  constructor(public navCtrl: NavController, public alerCtrl: AlertController, public storage_1: Storage) {
    this.storage = storage_1;

    this.nombres= "";
    this.apellidos = "";
    this.nacimiento = null;
    this.email = "";
    this.ciudad = "";
    this.celular = "";
    this.colegio = "";

    this.fempresariales = "";
    this.fingenieria = "";
    this.fjuridicas = "";

    this.personas = [];

    this.storage.get('encuestados').then((total) => {
      console.log("total encuestados: "+total)
      if( total == undefined || total == null ){
        console.log("defino por primera vez, encuestados : 0");
        this.encuestados = 0;
        this.storage.set('encuestados', this.encuestados);
      } else {
        this.encuestados = total;


        this.storage.get('encuestados').then((total) => {
          console.log("total encuestados: "+total)
          if( total == undefined || total == null || total == 0 ){
            console.log("defino por primera vez, encuestados : 0");
            this.encuestados = 0;
            this.storage.set('encuestados', this.encuestados);
          } else {
            this.encuestados = total;
            for( let i=total-1; i>=0; i--){
              this.storage.get("persona_"+i).then( (per) => {
                this.personas.push( per );
                console.log(per);
              });
            }
          }
        });

      }
    });
  }

  irListado() {
     this.navCtrl.push(ListadoPage, {personas: this.personas});
  }

  verificarForm() {

    if( this.nombres.trim() === ""){
      this.mostrarError("Debes definir el nombre");
      return;
    }

    let persona = {
      nombres: this.nombres.trim(),
      apellidos: "",
      nacimiento: "",
      email: "",
      ciudad: "",
      celular: "",
      colegio: "",
      carreras: ""
    };

    if( this.apellidos.trim() === ""){
      this.mostrarError("Debes definir el apellido");
      return;
    }

    persona.apellidos = this.apellidos.trim();

    if( this.nacimiento == null){
      this.mostrarError("Por favor ingresa la fecha de nacimiento");
      return;
    }

    persona.nacimiento = this.nacimiento;

    if( !this.validarEmail( this.email) ){
      this.mostrarError("La dirección de correo no es válida");
      return;
    }

    persona.email = this.email;

    if( this.ciudad.trim() === ""){
      this.mostrarError("Debes ingresar el nombre de la ciudad de residencia");
      return;
    }

    persona.ciudad = this.ciudad;

    if( this.celular.trim() === ""){
      this.mostrarError("Debes definir el apellido");
      return;
    }

    persona.celular = this.celular;

    if( this.colegio.trim() === ""){
      this.mostrarError("Debes definir el apellido");
      return;
    }

    persona.colegio = this.colegio;

    if( this.fempresariales != ""){
      persona.carreras = this.fempresariales;
    }

    if( this.fingenieria != ""){
      if( persona.carreras.length > 0  ){
        persona.carreras += ",";
      }
      persona.carreras += this.fingenieria;
    }

    if( this.fjuridicas != ""){
      if( persona.carreras.length > 0  ){
        persona.carreras += ",";
      }
      persona.carreras += this.fjuridicas;
    }

    //Si llego hasta aqui podemos guardar
    this.storage.set('persona_'+this.encuestados, persona).then( (valor) => {
      console.log( valor );

      this.encuestados++;
      this.storage.set('encuestados', this.encuestados);

      //this.personas.push(valor);

      this.personas.splice( 0, 0, valor );

      this.mostrarExito();
      this.nombres = "";
      this.apellidos = "";
      this.nacimiento = "";
      this.ciudad = "";
      this.celular = "";
      this.email = "";
      this.colegio = "";

      this.fempresariales = "";
      this.fingenieria = "";
      this.fjuridicas = "";
    });

  }

  mostrarExito(){
    let alert = this.alerCtrl.create({
      title: 'Datos Guardados!',
      buttons: ['Ok']
    });
    alert.present()
  }

  mostrarError( mensaje: string){
    let alert = this.alerCtrl.create({
      title: 'Faltan Datos',
      message: mensaje,
      buttons: ['Ok']
    });
    alert.present()
  }

  validarEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
