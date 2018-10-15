ember-short-number
==============================================================================

Short number formatting based on cldr locale data

`1234` is converted to `1K` in English
`1234` is converted to `1 mil` in Espanol
`1234` is converted to `1 mil` in Espanol

Based on [cldr-numbers-full](https://github.com/unicode-cldr/cldr-numbers-full)

Currently this only shortens with latin digits 0..9

For your information, Known number systems includes

[:adlm, :ahom, :arab, :arabext, :armn, :armnlow, :bali, :beng, :bhks, :brah,
 :cakm, :cham, :cyrl, :deva, :ethi, :fullwide, :geor, :grek, :greklow, :gujr,
 :guru, :hanidays, :hanidec, :hans, :hansfin, :hant, :hantfin, :hebr, :hmng,
 :java, :jpan, :jpanfin, :kali, :khmr, :knda, :lana, :lanatham, :laoo, :latn,
 :lepc, :limb, :mathbold, :mathdbl, :mathmono, :mathsanb, :mathsans, :mlym,
 :modi, :mong, :mroo, ...]


Installation
------------------------------------------------------------------------------

```
ember install ember-short-number
```


Usage
------------------------------------------------------------------------------

**Template Helper**

```hbs
{{short-number 19634 "en"}}
```

```hbs
{{short-number 19634 "en" significantDigits=1}}
```

**Service API**
```js
this.shortNumber.formatNumber(19634, 'en');
// 19K
```

```js
this.shortNumber.formatNumber(19634, 'en', 1);
// 19.6K
```

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
