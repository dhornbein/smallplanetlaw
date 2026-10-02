import { fields } from '@keystatic/core';
import { ActionButton } from '@keystar/ui/button';
import { TextLink } from '@keystar/ui/link';
import { Heading, Text } from '@keystar/ui/typography';
import { createElement, useEffect, useState } from 'react';

type FaqEntry = { id: string; question: string; order: number };

const ADMIN = '/keystatic/collection/faq';

/**
 * Not a real field: stores nothing. Shows the FAQ questions in the order they appear on the
 * page, with links to edit each one and to add a new one. FAQs stay their own content type
 * (Content -> FAQ); this is a shortcut from the FAQ page form. Links open in a new tab so
 * unsaved changes on this page aren't lost, and the list refreshes when you come back.
 */
export const faqList = () => {
  const base = fields.empty();
  return {
    ...base,
    Input() {
      const [entries, setEntries] = useState<FaqEntry[] | null>(null);

      useEffect(() => {
        const load = () =>
          fetch('/faq-entries.json')
            .then((response) => response.json())
            .then(setEntries)
            .catch(() => setEntries([]));
        load();
        window.addEventListener('focus', load);
        return () => window.removeEventListener('focus', load);
      }, []);

      const newTab = { target: '_blank', rel: 'noopener' };

      return createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        createElement(Heading, { size: 'small' }, 'Questions on this page'),
        createElement(
          Text,
          { size: 'small', color: 'neutral' },
          'Questions are separate entries under Content → FAQ. They are listed here in page order (lowest "Order" number first). Each link opens in a new tab.'
        ),
        entries === null
          ? createElement(Text, { size: 'small', color: 'neutral' }, 'Loading…')
          : createElement(
              'div',
              { style: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 } },
              ...entries.map((entry, index) =>
                createElement(
                  'div',
                  { key: entry.id, style: { display: 'flex', alignItems: 'center', gap: 12 } },
                  createElement(Text, { color: 'neutral', UNSAFE_style: { width: 20, textAlign: 'right' } }, `${index + 1}.`),
                  createElement(Text, { UNSAFE_style: { flex: 1 } }, entry.question),
                  createElement(TextLink, { href: `${ADMIN}/item/${entry.id}`, ...newTab }, 'Edit')
                )
              )
            ),
        createElement(
          'div',
          { style: { marginTop: 12 } },
          createElement(ActionButton, { href: `${ADMIN}/create`, ...newTab }, 'Add a question')
        )
      );
    },
  };
};
