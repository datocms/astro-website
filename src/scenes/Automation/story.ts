/*
 * The data of the fragment "Deploy when editors publish." of the
 * Automation chapter (Deploys.astro): the builds that DatoCMS starts and
 * the pipelines that run them. The facts are the ones of the build
 * triggers of the Content Management API (docs: "buildTriggers"): the
 * adapters are vercel, netlify, gitlab and custom (a webhook of your own
 * pipeline); a build starts from the button of the navigation bar, or by
 * itself on a scheduled publication (`autotrigger_on_scheduled_publications`);
 * the pipeline sends its status back to DatoCMS (`webhook_url`).
 */

export interface Build {
  trigger: string;
  /** The time of the trigger, after its label. Phones do not show it. */
  time: string;
  pipeline: string;
  /**
   * The lines of the log of the build, as the pipeline writes them: a
   * short version of a real log of that adapter. Phones show the last
   * three.
   */
  log: string[];
}

export const BUILDS: Build[] = [
  {
    trigger: 'Publish changes',
    time: '09:14',
    pipeline: 'Vercel',
    log: [
      'Cloning github.com/northlight/shop (Branch: main)',
      'Running "npm run build"',
      '✓ Generating static pages (248/248)',
      'Build Completed in /vercel/output [38s]',
      'Deployment completed',
    ],
  },
  {
    trigger: 'Scheduled post',
    time: '10:00',
    pipeline: 'Netlify',
    log: [
      'Starting to prepare the repo for build',
      '$ npm run build',
      'Build script success',
      "Starting to deploy site from 'dist'",
      'Site is live ✨',
    ],
  },
  {
    trigger: 'Publish changes',
    time: '11:32',
    pipeline: 'GitLab',
    log: [
      'Running with gitlab-runner 17.5.2',
      'Fetching changes with git depth set to 20...',
      '$ npm ci && npm run build',
      '$ npx wrangler deploy',
      'Job succeeded',
    ],
  },
  {
    trigger: 'Scheduled post',
    time: '14:30',
    pipeline: 'Your CI',
    log: [
      'POST /hooks/datocms 202 Accepted',
      'Run npm run build',
      'Built 248 pages in 21.4s',
      'Upload to s3://northlight-shop',
      'Status sent to DatoCMS: success',
    ],
  },
];

export const STATUS = { working: 'Deploying', done: 'Deployed' } as const;

export const TRACKS = { out: 'build', back: 'status' } as const;

export const BAR = 'DatoCMS';

export const DESCRIPTION =
  'An editor clicks Publish changes, or a scheduled post goes live: DatoCMS asks Vercel, Netlify, GitLab or your own CI for a build. While the build runs, the navigation bar of DatoCMS shows Deploying; when the pipeline sends its status back, it shows Deployed.';
