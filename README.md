ember-short-number
==============================================================================

Short number formatting based on CLDR locale data.  Particularly useful for __statistical data__, showing financial numbers in __charts__, and __abbreviating number of ratings__ across a range of languages.

- `1234` is converted to `1K` in English
- `101234` is converted to `101K` in English and `101.1K` if need 1 significant digit
- `1234` is converted to `1 mil` in Espanol
- `101234` is converted to `101,1 mil` in Espanol if need 1 significant digit
- `1234` is converted to `1234` in Japanese

Utilizes [cldr-numbers-full](https://github.com/unicode-cldr/cldr-numbers-full). Here is the related proposal for [Compact Decimal Format](https://github.com/tc39/ecma402/issues/37) that this addon is based on.  This is why there are no browser API's baked into something like `Intl.NumberFormat`.

Lastly, this work will be built into [ember-intl](https://github.com/ember-intl/ember-intl) in the near future and will use something like `shortNumber` notation style defined in ICU message syntax.

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
    threshold: 0.05 // default
  }
}
```

### threshold

This configuration option decides when to round up the formatted number.  So if you pass 95001, `ember-short-number` will output 100K.  However, if you pass 94999, you will get back 95K.

Usage
------------------------------------------------------------------------------
The following APIs take the language code as the the second argument based on [ISO 639-1](http://www.loc.gov/standards/iso639-2/php/code_list.php).  You can also pass `en_GB` or `en-GB` and we will normalize it to `en` as well.

### Template Helper

```hbs
{{short-number 19634 "en"}}
// 19K
```

```hbs
{{short-number 19634 "en" significantDigits=1}}
// 19.6K
```

```hbs
{{short-number 19634 "es-MX" significantDigits=1}}
// 19,6 mil
```

```hbs
{{short-number 101K "en" significantDigits=1 financialFormat=true}}
// 0.1M
```


### Service API

```js
this.shortNumber.format(19634, 'en');
// 19K
```

```js
this.shortNumber.format(19634, 'en', { significantDigits: 1, minimumFractionDigits: 1, maximumFractionDigits: 2 });
// 19.6K
```

```js
this.shortNumber.format(101, 'en', { significantDigits: 1, financialFormat: true });
// 0.1M
```

```js
this.shortNumber.format(19634, 'ja');
// 2万
```

```js
this.shortNumber.format(19634, 'es', { significantDigits: 1 });
// 19,6 mil
```

* Note when using significantDigits, this addon utilizes [`toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).


### Long Formatting

"Wait, I thought this addon was for compact number formatting?" Well it can be a misnomer depending on the language.  Let's look at some examples.

This doesn't seem shorter!!!! (╯°□°）╯︵ ┻━┻
```js
this.shortNumber.format(101000, 'en', { long: true });
// 101 thousand
```

But this does! ʘ‿ʘ
```js
this.shortNumber.format(101000, 'ja', { long: true });
// 101万
```

So we will just go with `ember-short-number` for now.


Other
------------------------------------------------------------------------------
Currently this only shortens with latin digits 0..9

For your information, known number systems include:

[adlm, ahom, arab, arabext, armn, armnlow, bali, beng, bhks, brah,
 cakm, cham, cyrl, deva, ethi, fullwide, geor, grek, greklow, gujr,
 guru, hanidays, hanidec, hans, hansfin, hant, hantfin, hebr, hmng,
 java, jpan, jpanfin, kali, khmr, knda, lana, lanatham, laoo, latn,
 lepc, limb, mathbold, mathdbl, mathmono, mathsanb, mathsans, mlym,
 modi, mong, mroo, ...]


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
