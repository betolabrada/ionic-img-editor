import { Component, ViewChild } from '@angular/core';
import { 
  ImageCroppedEvent, 
  ImageCropperComponent, 
  ImageTransform, 
  base64ToFile } from 'ngx-image-cropper';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { File } from '@ionic-native/file/ngx';
import { ToastController, Platform } from '@ionic/angular';

import { PhotoLibrary } from '@ionic-native/photo-library/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  myImage = null;
  croppedImage = null;
  @ViewChild(ImageCropperComponent, { static: false })
  angularCropper: ImageCropperComponent;
  editing = false;
  filepath = '';

  canvasRotation = 0;
  transform: ImageTransform = {};

  constructor(
    private camera: Camera, 
    private file: File, 
    public toastController: ToastController,
    private platform: Platform,
    private photoLibrary: PhotoLibrary
  ) {}

  // Presentar toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
    });
    toast.present();
  }

  // Cuando la imagen se recorte
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  // Guardar la imagen cuando se presione aceptar
  async saveImage() {
    // let downloadsLocation = '';
    // if (this.platform.is('android')) {
    //   downloadsLocation = 'file:///storage/emulated/0/Download';
    // } else if (this.platform.is('ios')) {
    //   downloadsLocation = this.file.dataDirectory;
    // }
    // const folderpath = downloadsLocation;
    // const blob = base64ToFile(this.croppedImage);
    // const filename = this.getFilename();
    try {
      await this.photoLibrary.requestAuthorization();
      const res = await this.photoLibrary.saveImage(this.croppedImage, 'PicEditor');
      console.log(res);
      this.presentToast('Imagen guardada con éxito');
    } catch (err) {
      console.log(err);
    }
  }

  // Toma imagen de la biblioteca
  async captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    const imageData = await this.camera.getPicture(options);
    this.myImage = 'data:image/jpeg;base64,' + imageData;    
  }

  getFilename() {
    return `img_${new Date().getTime()}.png`;
  }

  setEditing(editing) {
    // Resetear canvas y transform
    if (editing) {
      this.canvasRotation = 0;
      this.transform = {};
    }
    this.editing = editing;
  }

  cancel() {
    this.croppedImage = null;
    this.setEditing(false);
  }

  save() {
    console.log('saving...');
    this.angularCropper.crop();
    this.myImage = this.croppedImage;
    this.saveImage();
    this.setEditing(false);
  }

  rotateLeft() {
    this.canvasRotation = (this.canvasRotation - 45) % 180;
    console.log(this.canvasRotation);
  }

  rotateRight() {
    this.canvasRotation = (this.canvasRotation + 45) % 180;
    console.log(this.canvasRotation);
  }

  flipX() {
    if (this.transform.flipH === true) {
      this.transform = {
        ...this.transform,
        flipH: false
      }
    } else {
      this.transform = {
        ...this.transform,
        flipH: true
      }
    }
  }

  flipY() {
    if (this.transform.flipV === true) {
      this.transform = {
        ...this.transform,
        flipV: false
      }
    } else {
      this.transform = {
        ...this.transform,
        flipV: true
      }
    }
  }


}
