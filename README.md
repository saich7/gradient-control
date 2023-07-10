# GradientControl

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.2.

## Description

This Package is fully supported with angular's various version and written in angular. This provide simple drag and drop UI for change gradient colors and it's all properties. Package is configurable with multiple directives and support two way binding.

## Preview of control

![Preview of control](https://raw.githubusercontent.com/contact2mayurkukadiya/gradient-control/master/src/assets/p_1.png)

Preview of Delete Area (Red backgrounded) of control : 

![Preview of control](https://raw.githubusercontent.com/contact2mayurkukadiya/gradient-control/master/src/assets/p_2.png)

## [Live Demo Here](https://contact2mayurkukadiya.github.io/gradient-control/)

## How to Use Package

Import `GradientControlModule` into your `app.module.ts` like Below :
```javascript
import { GradientControlModule } from 'gradient-control';
.
.
@NgModule({
    imports: [
        ...
        GradientControlModule
    ]
});
```
>In Your `HTML Template` file of angular, Just Use `gradient-control` selecter like below : 

```html
<gradient-control [(colorArray)]="colors"></gradient-control>
```


## Configuration Options

<table style="margin-bottom: 30px">
    <tr>
        <th> Option </th>
        <th> DataType </th>
        <th> Purpose </th>
    </tr>
    <tr>
        <td> colorArray </td>
        <td> Array[{ color: string, stop: number }] </td>
        <td> input/output value binder. used for two way binding like <b>ngModel</b>. It Takes <b>Array</b> of objects as a input. object's color property should be string and stop should be in between <b>minColorStop</b> and <b>maxColorStop</b> property's value. Default colorArray is : [
            { color: '#0059ff', stop: 0 },
            { color: '#1ec3fa', stop: 1 }
        ]
        </td>
    </tr>
    <tr>
        <td> minColorStop </td>
        <td> Number </td>
        <td>Defines minimum value that color's stop can hold. This value will be treat same as <b>min</b> boundry of <b>input type=range</b>. <b>Default value</b> is <b>0</b>. 
        <br/>Note: 
        <li>If you use this property with custom value in html then you must have to pass this property's value in <b>getGradientCss function as an argument. (see #Service section)</b></li>
        </td>
    </tr>
    <tr>
        <td> maxColorStop </td>
        <td> Number </td>
        <td>defines maximum value that color's stop can hold. This value will be treat same as <b>max</b> boundry of <b>input type=range</b>. <b>Default value</b> is <b>1</b>.
        <br/>Note: 
        <li>If you use this property with custom value in html then you must have to pass this property's value in <b>getGradientCss function as an argument. (see #Service section)</b></li>
        </td>
    </tr>
    <tr>
        <td> minColors </td>
        <td> Number </td>
        <td>Minimum number of colors that can hold by control. Colors can not be remove after colors count reach at minimum. <b>Default value</b> is <b>2</b>.</td>
    </tr>
    <tr>
        <td> maxColors </td>
        <td> Number </td>
        <td>maximum number of colors that can hold by control. Colors can not be added after colors count reach at maximum. <b>Default value</b> is <b>4</b>.</td>
    </tr>
    <tr>
        <td> removeAreaBackgroundColor </td>
        <td> String </td>
        <td>css background color that will display when any color pin is dragged on it above the control. (see preview - red area is remove area of color.) when any Color pin is dragged over that area and release hold. That pin will be deleted with it's color. If you want to change that red color with your theme. then this proeprty will help. <b>Default Value</b> is <b>rgba(255, 0, 0, 0.424)</b></td>
    </tr>
    <tr>
        <td> removeAreaTooltip </td>
        <td> String </td>
        <td>Tooltip string that will be shown when mouse hover over removeArea of color pin. <b>Default value</b> is <b>Drag color pin here for remove color<b/></td>
    </tr>
    <tr>
        <td> colorPinTooltip </td>
        <td> String </td>
        <td>Tooltip string that will be shown when mouse hover over Color pin (diamond shape under the color Ramp). <b>Default value</b> is <b>Double click to open color picker</b></td>
    </tr>
    <tr>
        <td> addColorTooltip </td>
        <td> String </td>
        <td>Tooltip string that will be shown when mouse hover over Color Ramp(gradient part of a control). it will help user to guide how to use that control. <b>Default value</b> is <b>Double click to add new color</b></td>
    </tr>
    <tr>
        <td> containerClass </td>
        <td> String </td>
        <td>Css classname that can style extra according to your site's theme.</td>
    </tr>
</table>

## Events

| Event                  | Return Type                                                                     | Purpose                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colorArrayChange       | colorArray [{ color: string, stop: number, stopInPercent: number, id: number }] | fire when any changes in colorArray using control or assignment (=) in binding variable.                                                                    |
| onColorAdd             | colorArray (same as above)                                                      | This event will Fire when any new color is added via double click on color Ramp.                                                                            |
| onColorRemove          | colorArray (same as above)                                                      | This event will Fire when any any color is removed via pull color pin into remove area above the color Ramp.                                                |
| onColorControlActivate | object { color: string, stop: number, stopInPercent: number, id: number }       | fire when select any color pin via click on color pin.                                                                                                      |
| onColorSlideStart      | colorArray (same as above)                                                      | Dispatch event when user start sliding color pin. It will fire only once in cycle of `dragStart-dragging-dragEnd`                                           |
| onColorSliding         | colorArray (same as above)                                                      | Dispatch event while user sliding color pin. It will fire multiple time when any pin move through mouse. second stage of cycle `dragStart-dragging-dragEnd` |
| onColorSlideEnd        | colorArray (same as above)                                                      | Dispatch event once when user ends sliding color pin. It will fire only once. third stage of cycle `dragStart-dragging-dragEnd`                             |


# Service 
> **You can Use `GradientControlService` for convert color array into gradient css.**

import service in your component's constructor and Use it's function like below : 

```javascript
import { GradientControlService } from 'gradient-control';
.
.
.
constructor(public gradientService: GradientControlService) {
    .
    .
    .
}
```
Convert color Array into css : 

```javascript 
    GradientControlService.getGradientCss = function(colorArray, Options: gradientCSSOptions<optional> )

    // Where
    Options: gradientCSSOptions = { 
        type: 'Linear' | 'Radial',      @Optional (default: 'Linear')
        angle: number,                  @Optional (default: 0)
        min: number<minColorStop>,      @Optional (default: 0)
        max: number<maxColorStop>       @Optional (default: 1)
        }
```


> Note : If you used minColorStop and maxColorStop property with your custom boundry value in html with control. then you must have to pass that values into this getGradientCss function like this: service.getGradientCss(colorArray, {minColorStop: number, maxColorStop: number, gradientType: 'Linear' | 'Radial', angle: number<0-360> }).then(...)

>Note : Don't use function from service that is start with underscore(_). it's for internal use of library. GradientControlService only provice one function that converts color array into css.

```javascript
/* 
    below function is fire when colorArrayChnage event will fire from conmponent. check live demo and interect with control. you can check console.log in inspect > console.
*/
colorArrayChange(colorArray) {
    console.log("ColorArrayChange Event", colorArray); <== []
    this.gradientService.getGradientCss(colorArray).then(result => {
      this.backgroundCss = result;
    })
  }
```
In HTML, `Background` variable used like this : 

```html
    <div [ngStyle]="{'background': backgroundCss}">...</div>
```

## Examples

> Fully Functional Control look like this :
```html
<gradient-control 
    [minColors]="3"
    [maxColors]="5"
    [minColorStop]="minColorStop"
    [maxColorStop]="maxColorStop"
    (onColorAdd)="onColorAdd($event)" 
    (onColorRemove)="onColorRemove($event)" 
    (onColorControlActivate)="selectPin($event)" 
    (onColorSlideStart)="onColorSlideStart($event)" 
    (onColorSliding)="onColorSliding($event)" 
    (onColorSlideEnd)="onColorSlideEnd($event)"
    [(colorArray)]="colorArray" 
    (colorArrayChange)="colorArrayChange($event)"
></gradient-control>
```

> Js for above control looks like below:

```javascript

minColorStop: number = 1
minColorStop: number = 100
colorArray: Array<any> = [
    {color: '#fff', stop: 10 },
    {color: '#f0a', stop: 45 },
    {color: '#00c', stop: 70 }
    {color: '#000', stop: 100 }
]
function onColorAdd(colorArray) {...}
function onColorRemove(colorArray) {...}
function selectPin(singleColorObject) {...}
function onColorSlideStart(colorArray) {...}
function onColorSliding(colorArray) {...}
function onColorSlideEnd(colorArray) {...}
function colorArrayChange(colorArray) {...}
```
> You can checkout repo to see full example code with rotation angle and gradient type changes.

In above merged directive, `colorArray` variable will be automatic update on value changes.


## Help
Each and every things that on a internet is written and develop by someone with lot's of efforts and time. You can empower them to do more and best work for others who can freely use that by Buying them a coffee.

[![Buy me a Coffee][1]][2]

 [1]:  https://raw.githubusercontent.com/contact2mayurkukadiya/gradient-control/master/src/assets/bmc-new-logo.webp
 [2]:  https://www.buymeacoffee.com/mayurKukadiya
 

## Further help

To get more help on the this Control. Contact me on this email [contact2mayurkukadiya@gmail.com](mailto:contact2mayurkukadiya@gmail.com)
