import type { APIRoute } from 'astro';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import css from 'style-object-to-css-string';
import FullLogo from './_resources/logo.svg?raw';

export const GET: APIRoute = async ({ url }) => {
  const colfaxBold = await fetch(new URL('/fonts/colfax-web-700.woff', url)).then((res) =>
    res.arrayBuffer(),
  );

  const title = url.searchParams.get('title') || 'General Concepts';
  const kicker = url.searchParams.get('kicker')
    ? `DatoCMS Docs: ${url.searchParams.get('kicker')}`
    : 'DatoCMS Docs';

  const markup = html(/* HTML */ `
    <div
      style="${css({
        display: 'flex',
        background: 'linear-gradient(to bottom, #f8eefb, #fff)',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontWeight: 'bolder',
        fontFamily: 'colfax',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '200px',
      })}"
    >
      <div
        style="${css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}"
      >
        ${FullLogo}
      </div>
      <div
        style="${css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
        })}"
      >
        <div
          style="${css({
            fontSize: '30px',
            color: '#9E9E9E',
            fontFamily: 'colfaxBold',
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            display: 'flex',
          })}"
        >
          ${kicker}
        </div>
        <div
          style="${css({
            fontFamily: 'colfaxBold',
            fontSize: '90px',
            letterSpacing: '-0.06em',
            lineHeight: '1',
            textDecorationColor: '#F5BE50',
            textDecorationLine: 'underline',
            textDecorationThickness: '1rem',
            textDecorationStyle: 'solid',
            textDecorationSkipInk: 'auto',
            display: 'flex',
          })}"
        >
          ${title}
        </div>
      </div>
    </div>
  `);

  const svg = await satori(markup as any, {
    width: 1176,
    height: 756,
    fonts: [
      {
        name: 'colfaxBold',
        data: colfaxBold,
        style: 'normal',
        weight: 500,
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
