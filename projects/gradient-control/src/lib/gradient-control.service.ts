import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GradientControlService {

  constructor() { }

  getGradientCss(colorstopArray, min: number = 0, max: number = 1): Promise<string> {
    let tmp = JSON.parse(JSON.stringify(colorstopArray));
    return new Promise((resolve, reject) => {
      if (colorstopArray && colorstopArray.length >= 2) {
        let cssBackground = 'linear-gradient(to right';
        this._sortColorArray(tmp, 'stop').then(sortedResult => {
          sortedResult.forEach((element, index) => {
            let stop: number = Number(element.stop);
            let percent: number = this._getPercentFromValue(stop, min, max);
            cssBackground += ', ' + element.color + ' ' + percent + '%'
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
