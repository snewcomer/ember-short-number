ember-short-number
==============================================================================

Short number formatting based on cldr locale data

- `1234` is converted to `1K` in English
- `101234` is converted to `101K` in English and `101.1K` if need 1 significant digit
- `1234` is converted to `1 mil` in Espanol
- `101234` is converted to `101,1K` in Espanol if need 1 significant digit

Based on [cldr-numbers-full](https://github.com/unicode-cldr/cldr-numbers-full)

Currently this only shortens with latin digits 0..9

For your information, known number systems include:

[adlm, ahom, arab, arabext, armn, armnlow, bali, beng, bhks, brah,
 cakm, cham, cyrl, deva, ethi, fullwide, geor, grek, greklow, gujr,
 guru, hanidays, hanidec, hans, hansfin, hant, hantfin, hebr, hmng,
 java, jpan, jpanfin, kali, khmr, knda, lana, lanatham, laoo, latn,
 lepc, limb, mathbold, mathdbl, mathmono, mathsanb, mathsans, mlym,
 modi, mong, mroo, ...]


Installation
------------------------------------------------------------------------------

```
ember install ember-short-number
```

Configuration
------------------------------------------------------------------------------
Provide list of language codes applicable to your app in your `environment.js` file.  See [ISO 639-1](http://www.loc.gov/standards/iso639-2/php/code_list.php) for more information.

If not provided, we will include the data for all CLDR number formatting options in your app.  IMPORTANT - this adds ~28KB gzipped to your app so be sure to include all the languages you care about.

```js
let ENV = {
  'ember-short-number': {
    locales: ['en', 'es'],
    threshold: 0.5 // default
  }
}
```

Usage
------------------------------------------------------------------------------
Note - the following APIs take the language code as the the second argument based on [ISO 639-1](http://www.loc.gov/standards/iso639-2/php/code_list.php)

**Template Helper**

```hbs
{{short-number 19634 "en"}}
```

```hbs
{{short-number 19634 "en" significantDigits=1}}
```

```hbs
{{short-number 101K "en" significantDigits=1 useShorterFormat=true}}
```

Alternatively use the **Service API**

```js
this.shortNumber.formatNumber(19634, 'en');
// 19K
```

```js
this.shortNumber.formatNumber(19634, 'ja');
// 2万
```

```js
this.shortNumber.formatNumber(19634, 'en', { significantDigits: 1, minimumFractionDigits: 1, maximumFractionDigits: 2 });
// 19.6K
```

```js
this.shortNumber.formatNumber(19634, 'es', { significantDigits: 1 });
// 19,6K
```

```js
this.shortNumber.formatNumber(101, 'en', { significantDigits: 1, useShorterFormat: true });
// 0.1M
```

* Note when using significantDigits, this addon utilizes [`toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone git@github.com:snewcomer/ember-short-number.git`
* `cd ember-short-number`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
