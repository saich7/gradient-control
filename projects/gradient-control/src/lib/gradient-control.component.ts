import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, SimpleChange } from '@angular/core';
import { GradientControlService } from './gradient-control.service';

@Component({
  selector: 'gradient-control',
  templateUrl: './gradient-control.component.html',
  styleUrls: ['./gradient-control.component.css']
})
export class GradientControlComponent implements OnInit {
  private _posX1: any;
  private _posX2: any;
  private _posY1: any;
  private _posY2: any;
  private _activeItem: any;
  private _oldPosition: any;
  private _oldPositionVertical: any;
  private _dragControl: any = false;
  private _activeDragControl: any;
  private _touchEndRef: any;
  private _touchMoveRef: any;
  private _touchStartFlag: any = false;
  activeColorObject: any;
  clickedPin: any;
  cssBackground: string;
  cssColorArray: any[];
  type: string = (Math.floor(Math.random() * 1000000000)).toString();

  @ViewChild('addArea', { static: false }) addArea: ElementRef
  @ViewChild('removeArea', { static: false }) removeArea: ElementRef

  // @Input() backgroundColor: any = "#374168";
  @Input() minColors: number = 2;
  @Input() maxColors: number = 4;
  @Input() minColorStop: number = 0;
  @Input() maxColorStop: number = 1;
  @Input() removeAreaBackgroundColor: any = "rgba(255, 0, 0, 0.424)";
  @Input() removeAreaTooltip: any = "Drag color pin here for remove color"
  @Input() colorPinTooltip: any = "Double click to open color picker"
  @Input() addColorTooltip: any = "Double click to add new color"
  @Input() containerClass: any = "";
  @Input() colorArray: any = [
    { color: '#0059ff', stop: 0, id: 0 },
    { color: '#1ec3fa', stop: 1, id: 1 }
  ];

  @Output() colorArrayChange: EventEmitter<any> = new EventEmitter();
  @Output() onColorAdd: EventEmitter<any> = new EventEmitter();
  @Output() onColorRemove: EventEmitter<any> = new EventEmitter();
  @Output() onColorControlActivate: EventEmitter<any> = new EventEmitter();
  @Output() onColorSlideStart: EventEmitter<any> = new EventEmitter();
  @Output() onColorSliding: EventEmitter<any> = new EventEmitter();
  @Output() onColorSlideEnd: EventEmitter<any> = new EventEmitter();

  constructor(private gradientControlService: GradientControlService) {
    this.colorArray.forEach((element, index) => {
      element['stopInPercent'] = '0'
      element['id'] = index;
    });
    this.activeColorObject = this.colorArray[0];
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.initializeRamp();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // this is because when we change array of color dynamically, we need to reflect it in this control
    this.initializeRamp();
  }

  initializeRamp() {
    if (this.colorArray.length < 2) {
      this.colorArray = [
        { color: '#0059ff', stop: 0, id: 0 },
        { color: '#1ec3fa', stop: 1, id: 1 }
      ];
    }
    this.gradientControlService._sortColorArray(this.colorArray, 'stop').then(sortedArray => {
      // this.colorArray = [];
      this.colorArray = sortedArray;
      this.colorArray.forEach((element, index) => {
        let stop: number = Number(element.stop)
        if (stop > this.maxColorStop) {
          stop = element.stop = Number(this.maxColorStop);
        }
        else if (stop < this.minColorStop) {
          stop = element.stop = Number(this.minColorStop);
        }
        let percent: number = this.gradientControlService._getPercentFromValue(stop, this.minColorStop, this.maxColorStop);
        element.stopInPercent = percent;
        element.id = index;
      });
      this.gradientControlService.getGradientCss(this.colorArray, this.minColorStop, this.maxColorStop).then((result: string) => {
        this.cssBackground = result;
        this.activeColorObject = this.colorArray[0];
      });
    });
  }

  getValuefromPercent(percent): number {
    return Number(((percent * (this.maxColorStop - this.minColorStop) / 100) + this.minColorStop).toFixed(2))
  }

  /* getPercentFromValue(value): number {
    return ((value - this.minColorStop) / (this.maxColorStop - this.minColorStop)) * 100
  } */

 /*  generateCssFromArray(colorstopArray): Promise<string> {
    let tmp = JSON.parse(JSON.stringify(colorstopArray));
    return new Promise((resolve, reject) => {
      if (colorstopArray && colorstopArray.length >= 2) {
        let cssBackground = 'linear-gradient(to right';
        if (typeof this.minColorStop != "undefined" && typeof this.maxColorStop != "undefined") {
          // this.cssColorArray = [];
          this.sortColorArray(tmp, 'stop').then(sortedResult => {
            sortedResult.forEach((element, index) => {
              let stop: number = Number(element.stop);
              let percent: number = this.gradientControlService._getPercentFromValue(stop, this.minColorStop, this.maxColorStop);
              cssBackground += ', ' + element.color + ' ' + percent + '%'
              element.stopInPercent = percent
            });
            cssBackground += ')'
            resolve(cssBackground);
          });
        }
      }
    })
  } */

  async addColor(event, color) {
    if (this.colorArray.length >= this.maxColors) {
      return;
    }
    let newPercent = Number((event.offsetX * 100 / event.target.offsetWidth).toFixed(2));
    let stop = this.getValuefromPercent(newPercent);
    if (newPercent <= this.colorArray[0].stopInPercent) {
      // insert color at first
      this.colorArray.unshift({
        color: color,
        stop: stop,
        stopInPercent: newPercent
      })
      this.gradientControlService.getGradientCss(this.colorArray, this.minColorStop, this.maxColorStop).then(result => {
        this.cssBackground = result;
        this.activeColorObject = this.colorArray[0];
        this.refreshAllId();
        this.colorArrayChange.emit(this.colorArray);
        this.onColorAdd.emit(this.colorArray);
      });
      return;
    }
    else if (newPercent >= this.colorArray[this.colorArray.length - 1].stopInPercent) {
      // insert color at last
      this.colorArray.push({
        color: color,
        stop: stop,
        stopInPercent: newPercent
      })
      this.gradientControlService.getGradientCss(this.colorArray, this.minColorStop, this.maxColorStop).then(result => {
        this.cssBackground = result;
        this.activeColorObject = this.colorArray[this.colorArray.length - 1];
        this.refreshAllId();
        this.colorArrayChange.emit(this.colorArray);
        this.onColorAdd.emit(this.colorArray);
      });
      return;
    }
    else {
      for (let index = 0, arrLength = this.colorArray.length; index < arrLength; index++) {
        const element = this.colorArray[index];
        if (element.stopInPercent <= newPercent) {
        }
        else {
          this.colorArray.splice(index, 0, {
            color: color,
            stop: stop,
            stopInPercent: newPercent
          })
          await this.gradientControlService.getGradientCss(this.colorArray, this.minColorStop, this.maxColorStop).then(result => {
            this.cssBackground = result;
            this.activeColorObject = this.colorArray[index];
            this.refreshAllId();
            this.colorArrayChange.emit(this.colorArray);
            this.onColorAdd.emit(this.colorArray);
            // set index to last element for break loop
            index = arrLength;
          });
        }
      }
    }
  }

  touchStart(e, colorElement, index) {
    this.clickedPin = JSON.parse(JSON.stringify(colorElement));
    this._activeDragControl = index;
    this.activeColorObject = colorElement;
    // this.onColorControlActivate.emit({ index: index, colorObject: colorElement })
    // Toush start
    // width and height of color-control = 10 , so according to pythagoras : 
    // (width * width) + (height * height) = karna * karna (cross line between square box)
    // So We need to add (karna / 2) into left position of color control. so I have calculate karna (200 = (10*10) + (10*10))
    // this step is necessary because color-control is rotated as 45deg.
    let offsetLeft = e.target.offsetLeft - 5 + Math.sqrt(200) / 2;
    let offsetTop = e.target.offsetTop - 5 + Math.sqrt(200) / 2;
    this._activeItem = e.target;
    this._dragControl = true;
    e.preventDefault();
    this._oldPosition = Math.round(offsetLeft);
    this._oldPositionVertical = Math.round(offsetTop);
    if (e.type == 'touchstart') {
      this._posX1 = e.touches[0].clientX;
      this._posY1 = e.touches[0].clientY;
    } else {
      this._posX1 = e.clientX;
      this._posY1 = e.clientY;
    }
    this._touchEndRef = this.dragEnd.bind(this);
    this._touchMoveRef = this.dragAction.bind(this);
    // this.onColorSlideStart.emit(this.colorArray);
    document.onmouseup = this._touchEndRef;
    this._activeItem.onmouseup = this._touchEndRef;
    this.removeArea.nativeElement.onmouseup = this._touchEndRef;
    this.addArea.nativeElement.onmousemove = this._touchMoveRef;

    document.addEventListener('touchend', this._touchEndRef);
    this._activeItem.addEventListener('touchend', this._touchEndRef);
    this.addArea.nativeElement.addEventListener('touchmove', this._touchMoveRef);
  }

  dragAction(e) {
    if (this._dragControl) {
      if (this._touchStartFlag == false) {
        this.colorArrayChange.emit(this.colorArray);
        this.onColorSlideStart.emit(this.colorArray);
      }
      if (e.type == 'touchmove') {
        this._posX2 = this._posX1 - e.touches[0].clientX;
        this._posX1 = e.touches[0].clientX;
        this._posY2 = this._posX1 - e.touches[0].clientY;
        this._posY1 = e.touches[0].clientY;
      } else {
        this._posX2 = this._posX1 - e.clientX;
        this._posX1 = e.clientX;
        this._posY2 = this._posY1 - e.clientY;
        this._posY1 = e.clientY;
      }
      let pixel = (this._oldPosition - this._posX2)
      this._oldPosition = pixel;

      let pixelVertrical = (this._oldPositionVertical - this._posY2)
      this._oldPositionVertical = pixelVertrical;
      if (this._oldPositionVertical <= 12 && this._oldPositionVertical >= -3) {
        this.removeArea.nativeElement.style.backgroundColor = this.removeAreaBackgroundColor;
      }
      else {
        this.removeArea.nativeElement.style.backgroundColor = 'transparent';
      }

      if (this._oldPosition >= 0 && this._oldPosition <= this.addArea.nativeElement.offsetWidth) {
        let newPercent = Number((this._oldPosition * 100 / this.addArea.nativeElement.offsetWidth).toFixed(2));
        let stop = this.getValuefromPercent(newPercent);
        this._activeItem.style.left = newPercent + "%";
        this.colorArray[this._activeDragControl].stop = stop;
        this.colorArray[this._activeDragControl].stopInPercent = newPercent;
        this.gradientControlService.getGradientCss(this.colorArray, this.minColorStop, this.maxColorStop).then(result => {
          this.cssBackground = result;
          if (this._touchStartFlag == true) {
            this.onColorSliding.emit(this.colorArray);
            this.colorArrayChange.emit(this.colorArray);
          }
        });
      }
      this._touchStartFlag = true;
    }
  }

  dragEnd() {
    this.removeArea.nativeElement.style.backgroundColor = 'transparent';
    document.onmouseup = null;
    this.addArea.nativeElement.onmousemove = null;
    this.removeArea.nativeElement.onmouseenter = null;
    this.removeArea.nativeElement.onmouseout = null;
    document.removeEventListener('touchend', this._touchEndRef);
    this._activeItem.addEventListener('touchend', this._touchEndRef);
    this.addArea.nativeElement.addEventListener('touchmove', this._touchMoveRef);

    this._touchStartFlag = false;
    this._dragControl = false;
    if (this._oldPositionVertical <= 10) {
      if (this.colorArray.length > this.minColors) {
        let index = this.colorArray.findIndex(color => color.id == this.activeColorObject.id)
        this.colorArray.splice(index, 1);
        this.gradientControlService.getGradientCss(this.colorArray, this.minColorStop, this.maxColorStop).then(result => {
          this.cssBackground = result;
          this.refreshAllId();
          this.colorArrayChange.emit(this.colorArray);
          this.onColorRemove.emit(this.colorArray);
        })
      }
    }
    else {
      this.gradientControlService._sortColorArray(this.colorArray, 'stop').then(result => {
        this.colorArray = result;
        // this.colorArrayChange.emit(this.colorArray);
        let object = this.colorArray.find(color => color.stop == this.clickedPin.stop)
        if (!object) {
          this.onColorSlideEnd.emit(this.colorArray);
          this.colorArrayChange.emit(this.colorArray);
        }
        // this.onColorControlActivate.emit({ index: index, colorObject: this.activeColorObject })
      })
    }
  }

  colorControlActivate(_e, color, i) {
    this.onColorControlActivate.emit({ index: i, colorObject: color })
  }

  openColorPicker(id) {
    document.getElementById(id).click();
  }

  changeColor(color, i) {
    this.gradientControlService.getGradientCss(this.colorArray, this.minColorStop, this.maxColorStop).then(result => {
      this.cssBackground = result;
      this.colorArrayChange.emit(this.colorArray);
    })
  }

  refreshAllId() {
    this.colorArray.forEach((element, index) => {
      element['id'] = index;
    });
  }

}
