import { buildClient, type RawApiTypes } from '@datocms/cli/lib/cma-client-node';
import type { APIRoute } from 'astro';
import { DATOCMS_API_TOKEN, SECRET_API_TOKEN } from 'astro:env/server';
import { render } from 'datocms-structured-text-to-plain-text';
import { isLink, type ItemLink, type Node } from 'datocms-structured-text-utils';
import buildBasecampClient from '~/lib/basecamp';
import { handleUnexpectedError, invalidRequestResponse, json, withCORS } from '../_utils';
import { paramsToRecordId } from './_utils/pathnameToRecordId';
import { updateStructuredTextFields } from './_utils/updateStructuredTextFields';

type Payload = {
  entity: RawApiTypes.Item;
  related_entities: [RawApiTypes.ItemType];
};

type InternalLinkError = {
  message: string;
  linkText: string;
  url: string;
  fieldPath: string;
};

export const OPTIONS: APIRoute = () => {
  return new Response('OK', withCORS());
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

    function fieldById(id: string) {
      return allFields.find((field) => field.id === id)!;
    }

    const changesByFieldId: Record<string, { fieldPath: string; node: Node }[]> = {};

    const errors: InternalLinkError[] = [];

    const result = await updateStructuredTextFields(
      fieldsForItemTypeId,
      item,
      async (node, index, parent, fieldPath, field) => {
        async function run() {
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
        }

        const result = await run();
        if (result) {
          changesByFieldId[field.id] = changesByFieldId[field.id] || [];
          changesByFieldId[field.id]!.push({ fieldPath, node });
        }
        return result;
      },
    );

    if (dryMode) {
      return json({ errors }, withCORS());
    }

    if (typeof result === 'string') {
      return json({ result: 'No change needed' }, withCORS());
    }

    const impossibleChangesByFieldId = Object.fromEntries(
      Object.entries(changesByFieldId).filter(([fieldId]) => {
        const field = fieldById(fieldId);

        if (field.attributes.field_type !== 'structured_text') {
          throw new Error();
        }

        const validator = field.attributes.validators.structured_text_links as {
          item_types: string[];
        };

        return validator.item_types.length < 20;
      }),
    );

    if (Object.keys(impossibleChangesByFieldId).length > 0) {
      const ON_CALL_PROJECT = 33592490;
      const TRIAGE_LIST = 6361603214;

      const basecamp = await buildBasecampClient();

      const content = /* HTML */ `
        <p>
          <a
            href="https://cms.datocms.com/editor/item_types/${item.relationships.item_type.data
              .id}/items/${item.id}/edit"
            >This record</a
          >
          contains some links that cannot be normalized/converted into records, as their structured
          text field is not properly configured.
        </p>
        <ul>
          ${Object.entries(impossibleChangesByFieldId)
            .map(([fieldId, changes]) => {
              const field = fieldById(fieldId);
              const itemTypeId = field.relationships.item_type.data.id;

              return /* HTML */ ` <li>
                <a href="https://cms.datocms.com/schema/item_types/${itemTypeId}#f${fieldId}"
                  >Field ${field.attributes.api_key} (item type ${itemTypeId})</a
                >
                <ul>
                  ${changes
                    .map(
                      (change) =>
                        /* HTML */ `<li>${change.fieldPath} ("${render(change.node)}")</li>`,
                    )
                    .join('\n')}
                </ul>
              </li>`;
            })
            .join('\n')}
        </ul>
      `;

      await basecamp.cardTableCards.create({
        params: {
          bucketId: ON_CALL_PROJECT,
          columnId: TRIAGE_LIST,
        },
        body: {
          title: '[Website] Unable to link to records in some structured text fields',
          content,
        },
      });

      return json(
        {
          result: content,
          errors,
        },
        withCORS(),
      );
    }

    await client.items.rawUpdate(item.id, {
      data: { ...result, meta: { current_version: item.meta.current_version } },
    });

    return json({ result: 'Normalized links', errors }, withCORS());
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
