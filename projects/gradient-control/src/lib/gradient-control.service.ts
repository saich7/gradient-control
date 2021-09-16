import { Injectable } from '@angular/core';

interface gradientCSSOptions {
  type?: 'Linear' | 'Radial'
  min?: number
  max?: number,
  angle?: number
}
@Injectable({
  providedIn: 'root'
})
export class GradientControlService {

  constructor() { }

  getGradientCss(colorstopArray, options?: gradientCSSOptions): Promise<string> {
    let tmp = JSON.parse(JSON.stringify(colorstopArray));
    return new Promise((resolve, reject) => {
      if (colorstopArray && colorstopArray.length >= 2) {
        let type = options?.type || 'Linear';
        let angle = options?.angle || 0;
        let cssBackground = 'linear-gradient(';
        if (type == 'Radial') {
          cssBackground = 'radial-gradient('
        } else if (type == 'Linear') {
          if (angle) {
            cssBackground += options?.angle + 'deg'
          }
          else {
            cssBackground += 'to right'
          }
        }
        else {

        }
        this._sortColorArray(tmp, 'stop').then(sortedResult => {
          sortedResult.forEach((element, index) => {
            let stop: number = Number(element.stop);
            let percent: number = this._getPercentFromValue(stop, options?.min || 0, options?.max || 1);
            if(index == 0 && type == 'Radial') {
              cssBackground += element.color + ' ' + percent + '%'  
            } else {
              cssBackground += ', ' + element.color + ' ' + percent + '%'  
            }
            element.stopInPercent = percent
          });
          cssBackground += ')'
          resolve(cssBackground);
        });
      }
    })
  }

  _sortColorArray(arr, prop): Promise<any> {
    return new Promise(resolve => {
      arr.sort(this.GetSortOrder(prop));
      resolve(arr);
    })
  }

  private GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  _getPercentFromValue(value, min: number = 0, max: number = 1) {
    return ((value - min) / (max - min)) * 100
  }
}
