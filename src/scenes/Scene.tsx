import { Stage, type StageProps, type StageScheme } from '@datocms/product-scenes';
import { renderToStaticMarkup } from 'react-dom/server';
import { THEMES, type Theme } from '~/lib/theme';
import { SCENE_CHROMA, SCENE_HUE } from './theme';

export type SceneAppearance = {
  /**
   * The theme of the section. It gives the hue of the cms (see theme.ts).
   * @default the theme of the chapter of the scene
   */
  theme?: Theme;
  /**
   * The surface of the section. On `inverse` the cms is dark. On the
   * other surfaces it follows the scheme of the page (the attribute
   * data-product-scenes-scheme that the layout sets on <html>).
   * @default 'default'
   */
  surface?: 'default' | 'inverse';
  /**
   * The strength of the hue on the surfaces of the cms. At 1 the dark
   * scheme is almost black, thus an inverse surface gets 2. The tint
   * colours the text too: at 3 the light text is not white.
   * @default 2 on `inverse`, else 1
   */
  tint?: number;
  /**
   * The most chroma of the brand colour of the cms (see theme.ts).
   * @default SCENE_CHROMA
   */
  chroma?: number;
};

export type FragmentSceneProps = {
  width: number;
  /** The height of the screen in px. The content can be taller: the stage cuts it. */
  height: number;
  appearance?: SceneAppearance;
};

export function sceneScheme(appearance: SceneAppearance = {}): StageScheme {
  return appearance.surface === 'inverse' ? 'dark' : 'page';
}

type SceneProps = Omit<StageProps, 'hue' | 'scheme' | 'tint' | 'chroma' | 'inspectable'> & {
  theme: Theme;
  appearance?: SceneAppearance;
};

/**
 * The Stage of the website: it takes the hue, the scheme, the tint and the
 * chroma from the appearance. The screen is inspectable in development only: the
 * browser devtools can then select the elements and the text of a scene.
 * In production the screen stays inert and hidden, and a screen reader
 * hears only the description of the scene.
 */
export function Scene({ theme, appearance = {}, ...stage }: SceneProps) {
  const inverse = appearance.surface === 'inverse';
  return (
    <Stage
      inspectable={import.meta.env.DEV}
      hue={SCENE_HUE[appearance.theme ?? theme]}
      scheme={sceneScheme(appearance)}
      tint={appearance.tint ?? (inverse ? 2 : 1)}
      chroma={appearance.chroma ?? SCENE_CHROMA}
      {...stage}
    />
  );
}

/**
 * The colour properties of the screen of a scene (`--pigment-*`, and
 * `--wash-*` or the two ramps of a scene that follows the page) for each theme, as an inline style. The kit computes them
 * on the server only. Thus a page that changes the theme of a scene in
 * the browser gets them from here (see ThemedScene.astro).
 */
export function scenePalettes(
  appearance: Omit<SceneAppearance, 'theme'> = {},
): Record<Theme, string> {
  return Object.fromEntries(
    THEMES.map((theme) => {
      const html = renderToStaticMarkup(
        <Scene theme={theme} appearance={{ ...appearance, theme }} description="" height={1}>
          <span />
        </Scene>,
      );
      const style = /class="ProductScenesScreen"[^>]*?style="([^"]*)"/.exec(html)?.[1] ?? '';
      const colours = style
        .split(';')
        .filter((rule) => /^--(pigment|wash|product-scenes-wash)-/.test(rule));
      return [theme, colours.join(';')];
    }),
  ) as Record<Theme, string>;
}
