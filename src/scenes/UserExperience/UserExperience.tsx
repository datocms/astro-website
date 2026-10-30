import { RecordForm } from '@datocms/product-scenes';
import type { UserExperienceData } from '~/data/home';
import { Scene } from '../Scene';

// The scene of the UserExperience section: the record form of the case
// study alone, in the editor window of the mock-up. The site window and
// the code window show the same record. Read the scene rules in the
// README of @datocms/product-scenes. All the values are fixed, thus the
// markup is the same on each render.

/**
 * The strength of the hue on the surfaces of the cms. At 1 the dark
 * scheme is almost black. At 4 it is a warm dark brown, a bit darker
 * than the --surface-inverse of the other two windows. 3 is too grey
 * next to them.
 */
const TINT = 4;

const TITLE = 'Infrastructure with human skills';

// The <pixel-video> element is not a React element. The PixelVideo
// component of the site window defines it on the page.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'pixel-video': {
        src: string;
        settings?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

type UserExperienceSceneProps = {
  /** The width of the screen in px. The window must be at least this wide. */
  width: number;
  /** The height of the screen in px */
  height: number;
  /** The hero video of the site window. The Hero video field plays it too. */
  video: UserExperienceData['video'];
};

export function UserExperienceScene({ width, height, video }: UserExperienceSceneProps) {
  return (
    <Scene
      theme="orange"
      appearance={{ surface: 'inverse', tint: TINT }}
      description="The record editor of DatoCMS with the case study: the title, the subtitle, the hero video and the slug."
      width={width}
      height={height}
    >
      <RecordForm title={TITLE} icon="📝">
        <RecordForm.Field label="Title" required localized>
          <RecordForm.StringInput value={TITLE} large />
        </RecordForm.Field>
        <RecordForm.Field label="Subtitle">
          <RecordForm.StringInput value="Brand and Website for Human Interface" />
        </RecordForm.Field>
        {/* The upload plays the same pixel video as the hero of the site window. The width and the height give the ratio of the file: 160 × 80 cells. */}
        <RecordForm.Field label="Hero video">
          <RecordForm.FileInput
            media={{
              node: (
                <pixel-video
                  src={video.src}
                  settings={video.settings ? JSON.stringify(video.settings) : undefined}
                  style={{ width: '100%', height: '100%' }}
                />
              ),
              width: 160,
              height: 80,
            }}
            caption="fist-bump.pxv"
          />
        </RecordForm.Field>
        <RecordForm.Field label="Slug" required>
          <RecordForm.SlugInput
            prefix="https://humaninterface.studio/work/"
            value="infrastructure"
          />
        </RecordForm.Field>
      </RecordForm>
    </Scene>
  );
}
