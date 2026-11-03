import type { APIRoute } from 'astro';
import { truncate } from 'lodash-es';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import css from 'style-object-to-css-string';
import { ogCardHeight, ogCardWidth } from '~/lib/datocms/seo';
import type { OgCardData } from '~/lib/ogCardUrl';
import { toArrayBuffer } from '~/lib/toArrayBuffer';
import { handleUnexpectedError, invalidRequestResponse } from '~/pages/api/_utils';
import FullLogo from './_resources/logo.svg?raw';

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

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // satori reads static TTF and OTF files only, thus the card uses the two
    // static instances of ABC Oracle in the font bucket, not the variable font.
    const loadFont = (file: string) =>
      fetch(new URL(`/fonts/${file}`, url)).then((res) => {
        if (!res.ok) {
          throw new Error(`Could not load ${file} for the OG card: HTTP ${res.status}`);
        }
        return res.arrayBuffer();
      });

    const [oracleRegular, oracleMedium] = await Promise.all([
      loadFont('ABCOracle-Regular.otf'),
      loadFont('ABCOracle-Medium.otf'),
    ]);

    const rawData = url.searchParams.get('data');

    if (!rawData) {
      return invalidRequestResponse('Missing data URL param', 404);
    }

    let data;
    try {
      const decoded = Buffer.from(rawData, 'base64').toString('utf-8');
      data = JSON.parse(decoded);
    } catch (e) {
      return invalidRequestResponse('Invalid data URL param', 404);
    }

    const { kicker, title, pills, excerpt, logoPngUrl } = data as OgCardData;

    const markup = html(/* HTML */ `
      <div
        style="${css({
          display: 'flex',
          background: 'linear-gradient(to right, #f4f5ff, white 15%, white 75%, #fefae4)',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          fontFamily: 'ABC Oracle',
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
            gap: '20px',
          })}"
        >
          ${
            kicker
              ? /* HTML */ `<div
                  style="${css({
                    fontSize: '30px',
                    color: '#71788a',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    display: 'flex',
                  })}"
                >
                  ${kicker}
                </div>`
              : ''
          }
          ${
            logoPngUrl
              ? /* HTML */ `
                  <img
                    src="${logoPngUrl}"
                    style="${css({
                      height: '110px',
                      width: '700px',
                      objectFit: 'contain',
                      margin: '30px 0',
                    })}"
                  />
                `
              : ''
          }
          ${
            title
              ? /* HTML */ `
                  <div
                    style="${css({
                      fontSize: `${title.length < 40 ? 90 : 70}px`,
                      letterSpacing: '-0.04em',
                      lineHeight: '1',
                      display: 'flex',
                      fontWeight: 500,
                    })}"
                  >
                    ${title}
                  </div>
                `
              : ''
          }
          ${
            excerpt
              ? `
              <div
                style="${css({
                  fontSize: '28px',
                  color: '#71788a',
                  letterSpacing: '-0.01em',
                })}"
              >
                ${truncate(excerpt, { length: 200 })}
              </div>
            `
              : ''
          }
        </div>
        ${
          pills && pills.length > 0
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
                      letterSpacing: '-0.01em',
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
            : ''
        }
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
      width: ogCardWidth,
      height: ogCardHeight,
      fonts: [
        { name: 'ABC Oracle', data: oracleRegular, style: 'normal', weight: 400 },
        { name: 'ABC Oracle', data: oracleMedium, style: 'normal', weight: 500 },
      ],
    });

    const png = sharp(Buffer.from(svg)).png();
    const response = await png.toBuffer();

    return new Response(toArrayBuffer(response), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
