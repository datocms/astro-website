import type { Frame, Step } from './typewriter';

/**
 * The text faces of the site, each one with its animation.
 *
 * A face is the cursor of the typewriter at the end of a hero headline
 * (DESIGN.md, "The Text Face Rule"). The copy in `src/data/` gives the name
 * of a face (`face: 'happy'`), never its glyphs: the name gives the final
 * glyphs (`face`) and the frames of the animation (`frames`).
 *
 * Each animation has the same shape, with the rhythm of the home hero:
 * 1. The face comes in one sign at a time, with its eyes closed:
 *    `[`, `[-`, `[--`, `[--]`. A face with a mouth draws the mouth too.
 * 2. It opens its eyes and rests, long enough to read it.
 * 3. It does one thing: a wink, a laugh, a look up, a yawn.
 * 4. It settles on its final face. The last frame must be the final face:
 *    the typewriter then shows the glyphs of the copy and hides the cursor.
 *
 * Each frame stays at least 150ms, a blink 120-170ms, an expression
 * 350-550ms, and the rest after the eyes open approximately 650ms.
 *
 * Glyphs: ABC Oracle has no `ᴗ`, `◡`, `﹏`, `✓`, `ᴥ`. The browser takes them
 * from a system font, and they look different on each system. `/dev/face-
 * gallery` marks the faces that use one. The glyphs of the font that make
 * good eyes are `• ° ○ ^ - ~ * + x > < ¬ @ 0 ; . ˙ $ ♥ ♡ ■ □`, good
 * mouths are `_ ~ o ▽ v 3 ˘`, and good props after the face are
 * `/ | \ ' , ? ! * z …`.
 */
export interface FaceAnimation {
  /** The final glyphs, as they stay in the copy. */
  face: string;
  /** What the face does, and where it fits. */
  description: string;
  frames: Frame[];
}

const f = (text: string, ms: number): Frame => ({ text, ms });

/**
 * The face comes in one sign at a time, with its eyes closed, and holds.
 * `mouth` is drawn between the eyes; `arms` is put around the face. Every
 * animation starts with these frames: `faceReaction` cuts them.
 */
const draw = (mouth = '', arms: [string, string] = ['', '']): Frame[] => {
  const [left, right] = arms;
  return [
    f(`${left}[`, 220),
    f(`${left}[-`, 200),
    f(`${left}[-${mouth || '-'}`, 200),
    f(`${left}[-${mouth}-]${right}`, 500),
  ];
};

export const faces = {
  // The default, and the rest.
  wink: {
    face: '[••]',
    description: 'Opens its eyes, winks, looks at you. The default of the heroes.',
    frames: [...draw(), f('[••]', 650), f('[-•]', 170), f('[••]', 400)],
  },
  smile: {
    face: '[•ᴗ•]',
    description:
      'Opens its eyes, smiles, winks. The wink with a mouth: it reads as a face when it stops. The home hero.',
    frames: [...draw(), f('[••]', 650), f('[•ᴗ•]', 350), f('[-ᴗ•]', 170), f('[•ᴗ•]', 400)],
  },
  calm: {
    face: '[••]',
    description: 'Opens its eyes and blinks once. For a page where a wink is too much.',
    frames: [...draw(), f('[••]', 650), f('[--]', 140), f('[••]', 450)],
  },
  serious: {
    face: '[•_•]',
    description: 'A flat mouth and one slow blink. Enterprise, security, legal.',
    frames: [...draw(), f('[••]', 650), f('[•_•]', 450), f('[-_-]', 140), f('[•_•]', 450)],
  },

  // Warm.
  happy: {
    face: '[•ᴗ•]',
    description:
      'Smiles, blinks, beams for a moment. The warm default: contact, support, partners.',
    frames: [
      ...draw('ᴗ'),
      f('[•ᴗ•]', 650),
      f('[-ᴗ-]', 150),
      f('[•ᴗ•]', 350),
      f('[^ᴗ^]', 450),
      f('[•ᴗ•]', 400),
    ],
  },
  grateful: {
    face: '[>ᴗ<]',
    description: 'Squeezes its eyes with joy, twice. A thank-you page, a form sent.',
    frames: [...draw('ᴗ'), f('[•ᴗ•]', 600), f('[>ᴗ<]', 550), f('[•ᴗ•]', 250), f('[>ᴗ<]', 400)],
  },
  laugh: {
    face: '[^ᴗ^]',
    description: 'Laughs with its mouth open, twice. Wall of love, community.',
    frames: [
      ...draw('ᴗ'),
      f('[•ᴗ•]', 500),
      f('[^ᴗ^]', 250),
      f('[^▽^]', 200),
      f('[^ᴗ^]', 200),
      f('[^▽^]', 200),
      f('[^ᴗ^]', 450),
    ],
  },
  cheer: {
    face: '\\[^ᴗ^]/',
    description: 'Throws its arms up, twice. A launch, a product update, a milestone.',
    frames: [
      ...draw('ᴗ', ['_', '_']),
      f('_[•ᴗ•]_', 600),
      f('\\[^ᴗ^]/', 350),
      f('_[^ᴗ^]_', 250),
      f('\\[^ᴗ^]/', 400),
    ],
  },
  wave: {
    face: '[•ᴗ•]/',
    description: 'Waves its hand. Contact, Slack, "say hi".',
    frames: [
      ...draw('ᴗ'),
      f('[•ᴗ•]', 600),
      f('[•ᴗ•]/', 250),
      f('[•ᴗ•]|', 220),
      f('[•ᴗ•]/', 220),
      f('[•ᴗ•]|', 220),
      f('[•ᴗ•]/', 400),
    ],
  },
  love: {
    face: '[♥ᴗ♥]',
    description: 'Its eyes become hearts, and the hearts beat. Wall of love, case studies.',
    frames: [
      ...draw('ᴗ'),
      f('[•ᴗ•]', 600),
      f('[♡ᴗ♡]', 200),
      f('[♥ᴗ♥]', 450),
      f('[♡ᴗ♡]', 160),
      f('[♥ᴗ♥]', 400),
    ],
  },
  kiss: {
    face: '[•3•]',
    description: 'Winks and blows a kiss. A goodbye, a newsletter.',
    frames: [...draw('ᴗ'), f('[•ᴗ•]', 600), f('[-3•]', 350), f('[•3•]', 450)],
  },

  // Bright.
  starry: {
    face: '[**]',
    description:
      'Its eyes become stars, and the stars twinkle. Editor experience, a demo, a showcase.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[++]', 130),
      f('[**]', 400),
      f('[+*]', 150),
      f('[**]', 300),
      f('[*+]', 150),
      f('[**]', 400),
    ],
  },
  magic: {
    face: '[•ᴗ•]*',
    description: 'Smiles, and a spark twinkles next to it. AI, automation, "it just works".',
    frames: [
      ...draw('ᴗ'),
      f('[•ᴗ•]', 600),
      f('[•ᴗ•]+', 180),
      f('[•ᴗ•]*', 350),
      f('[•ᴗ•]+', 150),
      f('[•ᴗ•]*', 400),
    ],
  },
  aha: {
    face: '[•ᴗ•]!',
    description: 'Looks up, has an idea, smiles. Developers, docs, a tutorial.',
    frames: [...draw(), f('[••]', 650), f('[˙˙]', 500), f('[°°]!', 350), f('[•ᴗ•]!', 450)],
  },
  proud: {
    face: '[¬ᴗ¬]',
    description: 'Smiles, then gets smug and winks. Compare pages, benchmarks, "we know".',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•ᴗ•]', 350),
      f('[¬ᴗ¬]', 500),
      f('[¬ᴗ-]', 170),
      f('[¬ᴗ¬]', 400),
    ],
  },
  cool: {
    face: '[■ᴗ■]',
    description: 'Puts on sunglasses, and they go dark. Performance, the CDN, "handled".',
    frames: [...draw(), f('[••]', 650), f('[□□]', 200), f('[■■]', 500), f('[■ᴗ■]', 450)],
  },
  money: {
    face: '[$ᴗ$]',
    description: 'Its eyes become dollar signs, twice. Pricing, a plan, a saving.',
    frames: [...draw('ᴗ'), f('[•ᴗ•]', 600), f('[$ᴗ$]', 450), f('[•ᴗ•]', 250), f('[$ᴗ$]', 400)],
  },
  robot: {
    face: '[0_0]',
    description: 'Boots, blinks, beeps. AI, MCP, agents.',
    frames: [
      ...draw('_'),
      f('[-_-]', 400),
      f('[0_0]', 350),
      f('[-_-]', 120),
      f('[0_0]', 350),
      f('[0o0]', 250),
      f('[0_0]', 400),
    ],
  },

  // Quiet.
  relaxed: {
    face: '[~ᴗ~]',
    description: 'Smiles, closes its eyes, lets go. Wall of love, a testimonial, "no stress".',
    frames: [...draw('ᴗ'), f('[•ᴗ•]', 600), f('[-ᴗ-]', 500), f('[~ᴗ~]', 450)],
  },
  sleepy: {
    face: '[--]zz',
    description: 'Fights sleep, yawns, falls asleep. Automation, "set it and forget it".',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[-•]', 200),
      f('[••]', 350),
      f('[--]', 300),
      f('[-▽-]', 500),
      f('[--]', 450),
      f('[--]z', 350),
      f('[--]zz', 450),
    ],
  },
  bored: {
    face: '[-_-]',
    description: 'Goes flat and half-closes its eyes. Compare pages: the old way.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 400),
      f('[-_-]', 500),
      f('[•_•]', 200),
      f('[-_-]', 400),
    ],
  },
  waiting: {
    face: '[•_•]…',
    description: 'Waits, and the dots come one at a time. Status, a queue, "still loading".',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 300),
      f('[•_•].', 300),
      f('[•_•]..', 300),
      f('[•_•]…', 450),
    ],
  },

  // Thoughtful.
  thinking: {
    face: '[•~•]',
    description: 'Looks up, thinks, comes back with a doubt. Compare pages, a question.',
    frames: [...draw(), f('[••]', 650), f('[˙˙]', 450), f('[˙~˙]', 450), f('[•~•]', 450)],
  },
  confused: {
    face: '[•_•]?',
    description: 'A question mark, one eye up. A 404, glossary, "what is this?".',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 300),
      f('[•_•]?', 450),
      f('[˙_•]?', 350),
      f('[•_•]?', 400),
    ],
  },
  skeptical: {
    face: '[¬_¬]',
    description: 'Raises one eyebrow, then both. Compare pages, a claim to check.',
    frames: [...draw(), f('[••]', 650), f('[•_•]', 300), f('[¬_•]', 350), f('[¬_¬]', 500)],
  },
  approved: {
    face: '[•✓•]',
    description: 'Nods with a check mark and blinks. Philosophy, a review, "agreed".',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 300),
      f('[•v•]', 250),
      f('[•✓•]', 500),
      f('[-✓-]', 160),
      f('[•✓•]', 400),
    ],
  },

  // Startled.
  surprised: {
    face: '[°o°]',
    description: 'Its eyes widen, and its mouth opens, twice. A feature nobody expects.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[°°]', 300),
      f('[°o°]', 500),
      f('[°°]', 200),
      f('[°o°]', 400),
    ],
  },
  wow: {
    face: '[○o○]',
    description: 'Big eyes, and the jaw drops. A number, a benchmark, a big logo.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[○○]', 300),
      f('[○o○]', 300),
      f('[○▽○]', 550),
      f('[○o○]', 400),
    ],
  },
  dizzy: {
    face: '[@_@]',
    description: 'Its eyes spin. Migrations, "too many tools", a 500.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 250),
      f('[@_•]', 150),
      f('[@_@]', 450),
      f('[@o@]', 250),
      f('[@_@]', 400),
    ],
  },

  // Troubled.
  nervous: {
    face: "[•_•]'",
    description: 'A drop of sweat falls. A deadline, a migration, "before DatoCMS".',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 350),
      f("[•_•]'", 350),
      f('[•_•],', 350),
      f("[•_•]'", 400),
    ],
  },
  worried: {
    face: '[•﹏•]',
    description: 'Frowns and blinks. Features: "a list that keeps on growing".',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 350),
      f('[•﹏•]', 500),
      f('[-﹏-]', 170),
      f('[•﹏•]', 400),
    ],
  },
  sad: {
    face: '[._.]',
    description: 'Looks down and sighs. A 404, an unsubscribe, a goodbye.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 400),
      f('[._.]', 550),
      f('[-_-]', 300),
      f('[._.]', 400),
    ],
  },
  frustrated: {
    face: '[>_<]',
    description: 'Clenches and grunts. Compare pages: the pain of the old CMS.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 300),
      f('[>_<]', 450),
      f('[>o<]', 250),
      f('[>_<]', 400),
    ],
  },
  error: {
    face: '[x_x]',
    description: 'Its eyes go out, one at a time. A form error, a 500.',
    frames: [
      ...draw(),
      f('[••]', 650),
      f('[•_•]', 300),
      f('[x_•]', 150),
      f('[x_x]', 450),
      f('[+_+]', 150),
      f('[x_x]', 400),
    ],
  },
} satisfies Record<string, FaceAnimation>;

export type FaceName = keyof typeof faces;

export const faceNames = Object.keys(faces) as FaceName[];

/** The typewriter step that plays the face `name`. */
export function faceStep(name: FaceName): Step {
  return { type: 'face', frames: faces[name].frames };
}

const DRAWN = draw().length;

/**
 * The frames of the face `name` without the drawing: the face opens its
 * eyes, does one thing and settles. For a face that is on the page
 * already, as the buddy of the features list.
 */
export function faceReaction(name: FaceName): Frame[] {
  return faces[name].frames.slice(DRAWN);
}
