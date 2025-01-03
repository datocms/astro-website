import { buildClient, SchemaTypes } from '@datocms/cli/lib/cma-client-node';
import type { APIRoute } from 'astro';
import { DATOCMS_API_TOKEN, SECRET_API_TOKEN } from 'astro:env/server';
import { render } from 'datocms-structured-text-to-plain-text';
import { isLink, type ItemLink } from 'datocms-structured-text-utils';
import { handleUnexpectedError, invalidRequestResponse, json } from '../_utils';
import { paramsToRecordId } from './_utils/pathnameToRecordId';
import { updateStructuredTextFields } from './_utils/updateStructuredTextFields';

type Payload = {
  entity: SchemaTypes.Item;
  related_entities: [SchemaTypes.ItemType];
};

type InternalLinkError = {
  message: string;
  linkText: string;
  url: string;
  fieldPath: string;
};

export const POST: APIRoute = async ({ url, request }) => {
  try {
    // Parse query string parameters
    const token = url.searchParams.get('token');
    const dryMode = url.searchParams.get('dry');

    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    const {
      entity: item,
      related_entities: [itemType],
    } = (await request.json()) as Payload;

    const client = buildClient({ apiToken: DATOCMS_API_TOKEN });

    const { data: allFields } = await client.fields.rawRelated(itemType.id);

    function fieldsForItemTypeId(itemTypeId: string) {
      return allFields.filter((field) => field.relationships.item_type.data.id === itemTypeId);
    }

    const touchedStructuredTextFields = new Set<SchemaTypes.Field>();

    const errors: InternalLinkError[] = [];

    const result = await updateStructuredTextFields(
      fieldsForItemTypeId,
      touchedStructuredTextFields,
      item,
      async (node, index, parent, fieldPath) => {
        if (!isLink(node)) {
          return;
        }

        // Remove empty links
        if (!node.url) {
          parent.children = [
            ...parent.children.slice(0, index),
            ...node.children,
            ...parent.children.slice(index + 1),
          ] as any;

          return true;
        }

        // Skip anchor links
        if (node.url.startsWith('#')) {
          return;
        }

        let url: URL;

        try {
          url = new URL(node.url, 'https://www.datocms.com/');
        } catch {
          errors.push({
            message: 'Invalid URL!',
            linkText: render(node)!,
            url: node.url,
            fieldPath,
          });
          return;
        }

        // Fix URLs with duplicate https://
        if (url.pathname.indexOf('https://') >= 0) {
          url.pathname = url.pathname.slice(0, url.pathname.indexOf('https://'));
        }

        // Process external links
        if (url.hostname !== 'www.datocms.com') {
          const normalizedUrl = url.toString();

          if (node.url !== normalizedUrl) {
            node.url = normalizedUrl;
            return true;
          }

          return;
        }

        // Remove trailing slashes
        if (url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
        }

        try {
          const result = await paramsToRecordId(url.pathname, request);
          const normalizedUrl = url.pathname + url.hash + url.search;

          let somethingChanged = false;

          // Convert URL links to internal DatoCMS item links where possible
          if (result.result === 'recordFound') {
            const itemId = result.recordId;
            const itemLinkNode = node as any as ItemLink;
            itemLinkNode.type = 'itemLink';
            itemLinkNode.item = itemId;

            const meta = itemLinkNode.meta || [];
            if (url.hash) {
              meta.push({ id: 'hash', value: url.hash });
            }
            if (url.search) {
              meta.push({ id: 'search', value: url.search });
            }
            if (meta.length > 0) {
              itemLinkNode.meta = meta;
            }
            delete (itemLinkNode as any).url;

            somethingChanged = true;
          } else if (node.url !== normalizedUrl) {
            node.url = normalizedUrl;
            somethingChanged = true;
          }

          if (result.result === 'invalidPathname' || result.result === 'invalidParams') {
            errors.push({
              message: 'URL does not exist',
              linkText: render(node)!,
              url: node.url,
              fieldPath,
            });
          }

          return somethingChanged;
        } catch (e) {
          errors.push({
            message: 'Invalid route? Something might be wrong on the website code',
            linkText: render(node)!,
            url: node.url,
            fieldPath,
          });
        }
      },
    );

    if (dryMode) {
      return json({ errors });
    }

    if (typeof result === 'string') {
      return json({ result: 'No change needed' });
    }

    for (const touchedField of touchedStructuredTextFields) {
      const validator = touchedField.attributes.validators.structured_text_links as {
        item_types: string[];
      };

      if (validator.item_types.length < 20) {
        return json({
          result: `Cannot procede with update as structured text field ${touchedField.id} cannot handle item link nodes!`,
        });
      }
    }

    await client.items.rawUpdate(item.id, {
      data: { ...result, meta: { current_version: item.meta.current_version } },
    });

    return json({ result: 'Normalized links' });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
