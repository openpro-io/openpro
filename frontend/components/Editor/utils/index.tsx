export const getTrimmedHTML = (html: string) => {
  html = html.replace(/^(<p><\/p>)+/, '');
  html = html.replace(/(<p><\/p>)+$/, '');
  return html;
};
export const isValidHttpUrl = (string: string): boolean => {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const findTableAncestor = (
  node: Node | null
): HTMLTableElement | null => {
  while (node !== null && node.nodeName !== 'TABLE') {
    node = node.parentNode;
  }
  return node as HTMLTableElement;
};
