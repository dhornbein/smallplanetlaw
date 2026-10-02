import { createElement, useEffect } from 'react';

// The Keystatic admin page has no <head> of its own, so it would have no favicon.
// This brand mark is rendered as soon as the admin loads; it also sets the tab icon.
export function BrandMark() {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.append(link);
    }
    link.type = 'image/svg+xml';
    link.href = '/keystatic-favicon.svg';
  }, []);

  return createElement('img', { src: '/keystatic-favicon.svg', alt: '', width: 24, height: 24 });
}
