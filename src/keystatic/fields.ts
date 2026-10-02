import { fields } from '@keystatic/core';
import { createElement, useEffect, useState } from 'react';
import { PdfPreview } from './PdfPreview';
import { imageSizes, type ImageSize } from './imageSizes';
import { Icon } from '@keystar/ui/icon';
import { Item, Picker } from '@keystar/ui/picker';
import { Notice } from '@keystar/ui/notice';
import { Text } from '@keystar/ui/typography';
import { iconNames, icons, type IconName } from '../components/ui/icons';

/**
 * Reusable field groups so every page form in Keystatic looks the same.
 * Mirrored by the Zod schemas in `src/content.config.ts`.
 */

/**
 * Image stored under `src/assets/content/pages/<page>/` so Astro can optimise it.
 * `publicPath` is relative to the page's yaml file in `src/content/pages/`.
 */
/**
 * Image upload that warns when the picture is too small (or the wrong orientation) for where
 * it is used. The limits live in `imageSizes.ts`. The warning is advisory; saving still works.
 */
export const sizedImage = (
  size: ImageSize,
  options: { label: string; description?: string; directory: string; publicPath: string }
) => {
  const base = fields.image(options);
  const { name, minWidth, ...rest } = imageSizes[size];
  const orientation = 'orientation' in rest ? rest.orientation : undefined;

  return {
    ...base,
    Input(props: Parameters<typeof base.Input>[0]) {
      const data = props.value?.data;
      const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

      useEffect(() => {
        setDimensions(null);
        if (!data) return;
        let cancelled = false;
        createImageBitmap(new Blob([data as BlobPart]))
          .then((bitmap) => {
            if (!cancelled) setDimensions({ width: bitmap.width, height: bitmap.height });
            bitmap.close();
          })
          .catch(() => {});
        return () => {
          cancelled = true;
        };
      }, [data]);

      const problems: string[] = [];
      if (dimensions) {
        if (dimensions.width < minWidth) problems.push(`it is only ${dimensions.width}px wide; use at least ${minWidth}px so it stays sharp`);
        if (orientation === 'landscape' && dimensions.height > dimensions.width) problems.push('it is taller than it is wide; this slot needs a wide (landscape) image');
        if (orientation === 'portrait' && dimensions.width > dimensions.height) problems.push('it is wider than it is tall; this slot needs a tall (portrait) image');
      }

      return createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        createElement(base.Input, props),
        dimensions && problems.length
          ? createElement(
              Notice,
              { tone: 'caution' },
              `This image (${dimensions.width} × ${dimensions.height}) may not look good as ${name}: ${problems.join(', and ')}.`
            )
          : null
      );
    },
  };
};

/** Image stored under `src/assets/content/pages/<page>/` so Astro can optimise it. */
export const pageImage = (page: string, size: ImageSize, label: string, description?: string) =>
  sizedImage(size, {
    label,
    description,
    directory: `src/assets/content/pages/${page}`,
    publicPath: `../../assets/content/pages/${page}/`,
  });

/**
 * Text field that shows the full browser/search title underneath. The suffix comes
 * from Site settings via /seo-settings.json (see src/pages/seo-settings.json.ts), so it
 * reflects the last saved value of the setting.
 */
const titleField = () => {
  const base = fields.text({
    label: 'Page title',
    description: 'Just the page-specific part, e.g. "Estate Planning Services". The site name is added automatically.',
  });
  return {
    ...base,
    Input(props: Parameters<typeof base.Input>[0]) {
      const [seoSettings, setSeoSettings] = useState<{ suffix: string; separator: string } | null>(null);
      useEffect(() => {
        fetch('/seo-settings.json')
          .then((response) => response.json())
          .then(setSeoSettings)
          .catch(() => setSeoSettings(null));
      }, []);

      const full = props.value
        ? seoSettings
          ? `${props.value}${seoSettings.separator}${seoSettings.suffix}`
          : props.value
        : seoSettings?.suffix ?? '';

      return createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        createElement(base.Input, props),
        createElement(
          Text,
          { size: 'small', color: 'neutral' },
          `Full title: ${full} (${full.length} characters; search results show about 60)`
        )
      );
    },
  };
};

export const seo = () =>
  fields.object(
    {
      title: titleField(),
      description: fields.text({ label: 'Meta description', multiline: true, description: 'Short summary for search results and link previews.' }),
    },
    { label: 'SEO' }
  );

/**
 * Rich text for page copy. Limited to what the page designs can render: no headings
 * (each section has its own heading field), images, tables or code.
 * Stored as a Markdown string in the page's yaml and rendered by `<Markdown />`.
 */
export const richText = (label: string, description?: string) =>
  fields.markdoc.inline({
    label,
    description,
    options: {
      bold: true,
      italic: true,
      link: true,
      orderedList: true,
      unorderedList: true,
      heading: false,
      blockquote: false,
      code: false,
      codeBlock: false,
      strikethrough: false,
      table: false,
      divider: false,
      image: false,
    },
  });

export const hero = (page?: string) =>
  fields.object(
    {
      heading: fields.text({ label: 'Heading', description: 'The main H1 heading, important for SEO' }),
      intro: richText('Intro'),
      ...(page
        ? {
            image: pageImage(page, 'heroWide', 'Background image (wide screens)'),
            imageTall: pageImage(page, 'heroTall', 'Background image (phones)', 'Optional. A taller crop for small screens; the wide image is used if empty.'),
          }
        : {}),
    },
    { label: 'Hero' }
  );

export const body = (label = 'Body') => richText(label);

export const section = (label: string) =>
  fields.object({ heading: fields.text({ label: 'Heading' }), body: body() }, { label });

/** Same SVG paths the site's <Icon /> renders, so the picker shows exactly what visitors will see. */
const iconGraphic = (name: IconName) =>
  createElement(Icon, {
    src: createElement(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' },
      createElement('path', { d: icons[name], strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
  });

export const icon = () => {
  const base = fields.select({
    label: 'Icon',
    options: iconNames.map((name) => ({ label: name, value: name })),
    defaultValue: 'check',
  });
  return {
    ...base,
    Input(props: Parameters<typeof base.Input>[0]) {
      return createElement(
        Picker,
        {
          label: 'Icon',
          items: iconNames.map((name) => ({ name })),
          selectedKey: props.value,
          onSelectionChange: (key: unknown) => props.onChange(key as IconName),
          autoFocus: props.autoFocus,
        },
        (item: { name: IconName }) =>
          createElement(Item, { key: item.name, textValue: item.name }, iconGraphic(item.name), createElement(Text, null, item.name))
      );
    },
  };
};

export const cards = (label: string, opts: { icon?: boolean } = {}) =>
  fields.array(
    fields.object({
      ...(opts.icon ? { icon: icon() } : {}),
      title: fields.text({ label: 'Title' }),
      description: richText('Description'),
    }),
    { label, itemLabel: (props) => props.fields.title.value || 'Card' }
  );

export const link = (label: string) =>
  fields.object(
    {
      label: fields.text({ label: 'Link text' }),
      href: fields.text({ label: 'Link URL', description: 'A path on this site (e.g. /faq#planning-process) or a full URL.' }),
    },
    { label }
  );

/**
 * PDF upload with a page-by-page preview. The preview is built from the file's bytes, so it
 * also works for a file that has been chosen but not saved yet.
 */
export const pdfFile = (label: string) => {
  const base = fields.file({
    label,
    directory: 'public/resources',
    publicPath: '/resources/',
    validation: { isRequired: true },
    description: 'The download name comes from the entry\'s file name above, not from the name of the uploaded file.',
  });
  return {
    ...base,
    Input(props: Parameters<typeof base.Input>[0]) {
      return createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        createElement(base.Input, props),
        props.value?.data ? createElement(PdfPreview, { data: props.value.data }) : null
      );
    },
  };
};
