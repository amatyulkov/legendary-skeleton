export const setAttributes = (
  el: Element,
  attrs: { [x: string]: string | number }
) => {
  for (const attr in attrs) {
    el.setAttribute(
      attr,
      typeof attrs[attr] === "string"
        ? (attrs[attr] as string)
        : attrs[attr].toString()
    );
  }
};
