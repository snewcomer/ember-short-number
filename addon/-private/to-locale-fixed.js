export default function(value, locale, digitsConfig) {
  if (value && typeof(value) === 'number') {
    return value.toLocaleString(locale, digitsConfig);
  }
}
