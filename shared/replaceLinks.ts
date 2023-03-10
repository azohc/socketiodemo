export function replaceLinks(text: string) {
  const regexp =
    /(ftp|http|https|chrome|:\/\/|\.|@){2,}(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\S*:\w*@)*([a-zA-Z]|(\d{1,3}|\.){7}){1,}(\w|\.{2,}|\.[a-zA-Z]{2,3}|\/|\?|&|:\d|@|=|\/|\(.*\)|#|-|%)*/gu;

  return text.replace(
    regexp,
    (url) => `<a class="link" target="_blank" href="${url}">${url}</a>`
  );
}
