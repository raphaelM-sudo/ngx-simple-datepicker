# ngx-simple-datepicker

Simple and lightweight, yet customizable date picker for Angular

[Demo](https://ngx-simple-datepicker.netlify.com/)

This is a simple datepicker component for Angular, fully supporting template driven forms and form validation.
It uses [@nutrify/ngx-simple-select](https://www.npmjs.com/package/@nutrify/ngx-simple-select/) as the select control.

## Installation

Note: Ngx Simple Datepicker requires Angular 9.

```sh
npm install @nutrify/ngx-simple-datepicker --save
```

For styling import @nutrify/ngx-simple-select/scss/styles.scss or @nutrify/ngx-simple-select/css/styles.css

## Usage

**app.module.ts:**

```typescript
import { SimpleDatepickerModule } from 'projects/simple-datepicker/src/public-api';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SimpleDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**component.ts:**

```typescript
// ...

export class Component {
  date: Date = null;
}
```

**component.html:**

```html
<!-- ... -->

<simple-datepicker min="1910-01-01" max="2020-01-01" [(ngModel)]="date" required></simple-datepicker>

<!-- ... -->
```

Check out the [source code](https://github.com/raphaelM-sudo/ngx-simple-datepicker/tree/master/src/app) for an example.

#### Datepicker

##### Inputs

| Property         | Default | Type                                   | Description                                                                  |
| ---------------- | ------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| min              |         | Date \| string                         | Optional min date value *                                                    |
| max              |         | Date \| string                         | Optional max date value *                                                    |
| dayPlaceholder   |         | string                                 | Optional placeholder for the day select control                              |
| monthPlaceholder |         | string                                 | Optional placeholder for the month select control                            |
| yearPlaceholder  |         | string                                 | Optional placeholder for the year select control                             |
| months           |         | [string, ...string[]] & { length: 12 } | Optional array of month names for multi language support                     |

<sub>*) If no value is entered the date wont be validated by default, but the select dropdown for the year will show a range of (-115) - (-16) from the current year.</sub>

## Styling

You can use SCSS or CSS from @nutrify/ngx-simple-select for styling.

Just import the stylesheet and apply changes to it.

### CSS / SASS

```scss
@import '~@nutrify/ngx-simple-select/scss/styles';
```

### Angular

**angular-cli.json:**

```json
"styles": [
  "styles.css",

  "../node_modules/@nutrify/ngx-simple-select/css/styles.css"
]
```
