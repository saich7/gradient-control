import { Component } from '@angular/core';
import { GradientControlService } from 'gradient-control';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  background = "";
  colorArray = [
    { color: '#0059FF', stop: 0 },
    { color: '#1EC3FA', stop: 1 },
  ];
  angle: number = 45;
  angleOption = { radius: 30, borderColor: '#0A7AFE', borderWidth: 2 }
  type: any = 'Linear'

  constructor(public gradientService: GradientControlService) {
    this.changeGradient();
    this.gradientService.getGradientCss(this.colorArray, { angle: this.angle }).then(result => {
      console.log('result: ', result);
      this.background = result;
    });
  }

  selectPin($event) {
    console.log("select Pin", $event);
  }

  onColorSlideStart($event) {
    console.log("onColorSlideStart", $event);
  }

  onColorSliding($event) {
    console.log("onColorSliding", $event);
  }

  onColorSlideEnd($event) {
    console.log("onColorSlideEnd", $event);
  }

  onColorAdd($event) {
    console.log("onColorAdd", $event);
  }

  onColorRemove($event) {
    console.log("onColorRemove", $event);
  }

  changeGradient() {
    this.gradientService.getGradientCss(this.colorArray, { angle: this.angle, type: this.type }).then(result => {
      this.background = result;
    })
  }
}
