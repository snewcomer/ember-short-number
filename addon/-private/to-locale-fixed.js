export default function(value, locale) {
  if (value && typeof(value) === 'number') {
    return value.toLocaleString(locale);
  }
}
