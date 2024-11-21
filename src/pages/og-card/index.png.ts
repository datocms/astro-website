import type { APIRoute } from 'astro';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import css from 'style-object-to-css-string';
import { graphql } from '~/lib/datocms/graphql';
import type { OgCardData } from '~/lib/ogCardUrl';
import { invalidRequestResponse } from '~/pages/api/_utils';
import FullLogo from './_resources/logo.svg?raw';

const query = graphql(/* GraphQL */ `
  query OgImage($id: ItemId!) {
    page: docPage(filter: { id: { eq: $id } }) {
      title
      parents: _allReferencingDocGroups {
        name
      }
      content {
        value
      }
    }
  }
`);

function filterPills(pills: string[]): string[] {
  const result: string[] = [];
  let totalLength = 0;

  for (const item of pills) {
    if (totalLength + item.length <= 150) {
      result.push(item);
      totalLength += item.length;
    } else {
      break;
    }
  }

  return result;
}

export const GET: APIRoute = async ({ url }) => {
  const [colfaxRegular, colfaxBold] = await Promise.all([
    fetch(new URL('/fonts/colfax-web-bold.woff', url)).then((res) => res.arrayBuffer()),
    fetch(new URL('/fonts/colfax-web-700.woff', url)).then((res) => res.arrayBuffer()),
  ]);

  const rawData = url.searchParams.get('data');

  if (!rawData) {
    return invalidRequestResponse('Not found', 404);
  }

  let data;
  try {
    data = JSON.parse(rawData);
  } catch (e) {
    return invalidRequestResponse('Not found', 404);
  }

  const { kicker, title, pills, excerpt } = data as OgCardData;

  const markup = html(/* HTML */ `
    <div
      style="${css({
        display: 'flex',
        background: 'linear-gradient(to right, #f4f5ff, white 15%, white 75%, #fefae4)',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontFamily: 'colfax',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '50px 100px',
        borderBottom: '20px solid #ff593d',
      })}"
    >
      <div
        style="${css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          gap: '20px',
        })}"
      >
        <div
          style="${css({
            fontSize: '30px',
            color: '#71788a',
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            display: 'flex',
          })}"
        >
          ${kicker}
        </div>
        <div
          style="${css({
            fontSize: `${title.length < 40 ? 90 : 70}px`,
            letterSpacing: '-0.06em',
            lineHeight: '1',
            display: 'flex',
          })}"
        >
          ${title}
        </div>
      </div>
      ${excerpt
        ? `
          <div
            style="${css({
              fontSize: '28px',
              color: '#71788a',
              letterSpacing: '-0.04em',
            })}"
          >
            ${excerpt}
          </div>
        `
        : ''}
      ${pills && pills.length > 1
        ? `
          <div
            style="${css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
            })}"
          >
            ${filterPills(pills)
              .map(
                (text) => `
                  <div
                    style="${css({
                      background: '#f6f4f7',
                      padding: '5px 15px',
                      borderRadius: '100px',
                      fontWeight: 'bold',
                      letterSpacing: '-0.04em',
                      fontSize: '20px',
                      color: '#71788a',
                    })}"
                  >
                    ${text}
                  </div>
                `,
              )
              .join('')}
          </div>`
        : ''}
      <div
        style="${css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '30px',
        })}"
      >
        ${FullLogo}
      </div>
    </div>
  `);

  const svg = await satori(markup as any, {
    width: 1200,
    height: 675,
    fonts: [
      {
        name: 'colfax',
        data: colfaxRegular,
        style: 'normal',
        weight: 500,
      },
      {
        name: 'colfax',
        data: colfaxBold,
        style: 'normal',
        weight: 700,
      },
    ],
  });

  const png = sharp(Buffer.from(svg)).png();
  const response = await png.toBuffer();

  return new Response(response, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
