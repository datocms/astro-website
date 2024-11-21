const RAW_DEPLOYMENT_TYPES: Record<RawDeploymentType, DeploymentType[] | undefined> = {
  static: ['netlify', 'vercel'],
  server: ['heroku'],
  serverless: ['vercel'],
  copyRepo: ['github'],
  zeit: ['vercel'],
  vercel: ['vercel'],
  netlify: ['netlify'],
  heroku: ['heroku'],
};

type RawDeploymentType =
  | 'static'
  | 'server'
  | 'serverless'
  | 'copyRepo'
  | 'zeit'
  | 'vercel'
  | 'netlify'
  | 'heroku';

export type DeploymentType = 'netlify' | 'vercel' | 'heroku' | 'github';

type EnvValue =
  | {
      type: 'datocmsAccessToken';
      tokenName: string;
    }
  | {
      type: 'datocmsProjectUrl';
    }
  | {
      type: 'string';
      value: string;
    };

export type RawManifest = {
  name?: string;
  deploymentType?: RawDeploymentType;
  previewImage?: string;
  description?: string;
  livePreviewUrl?: string;
  datocmsProjectId?: string;
  templateId?: string;
  preDeploy?: PreDeployExtraStep;
  postInstallUrl?: string;
  postDeploy?: PostDeployExtraStep;
  buildCommand?: string;
  netlifyBuildCommand?: string;
  buildDirectory?: string;
  netlifyBuildDirectory?: string;
  vercelIntegrationIds?: string[];
  environmentVariables?: Record<string, EnvValue>;
  datocmsApiTokenEnvName?: string;
  projectUrlEnvName?: string;
};

export type PreDeployExtraStep =
  | { type: 'apiCall'; url: string; description: string }
  | {
      type: 'modalWithPostMessage';
      intro: {
        title: string;
        description: string;
        button: string;
      };
      modal: {
        url: string;
        width?: number;
        height?: number;
      };
      postMessageOrigin?: string;
    };

export type PostDeployExtraStep =
  | { type: 'apiCall'; url: string; description: string }
  | {
      type: 'modalWithPostMessage';
      intro: {
        title: string;
        description: string;
        button: string;
      };
      modal: {
        url: string;
        width?: number;
        height?: number;
      };
      postMessageOrigin?: string;
    };

export type NormalizedManifest = {
  id: string;
  name: string;
  datocmsSiteId: string;
  githubRepo: string;
  githubBranch: string;
  deploymentTypes: DeploymentType[];
  screenshot?: string;
  description?: string;
  livePreviewUrl?: string;
  postDeployExtraStep?: PostDeployExtraStep;
  preDeployExtraStep?: PreDeployExtraStep;
  environmentVariableMappings: Record<string, EnvValue>;
  datocmsApiTokenEnvName?: string;
  projectUrlEnvName?: string;
  buildCommand?: string;
  buildDirectory?: string;
};

export function normalizeManifest(
  manifest: RawManifest,
  repo: string,
  branch: string,
): NormalizedManifest {
  if (!manifest.name) {
    throw new Error('Missing `name` property');
  }

  const datocmsSiteId = manifest.datocmsProjectId || manifest.templateId;

  if (!datocmsSiteId) {
    throw new Error('Missing `datocmsProjectId` property');
  }

  if (!(manifest.deploymentType && RAW_DEPLOYMENT_TYPES[manifest.deploymentType])) {
    throw new Error(`Invalid \`deploymentType\`: ${manifest.deploymentType}`);
  }

  return {
    id: `${repo}:${branch}`,
    name: manifest.name,
    screenshot: manifest.previewImage,
    githubRepo: repo,
    githubBranch: branch,
    description: manifest.description,
    livePreviewUrl: manifest.livePreviewUrl,
    datocmsSiteId,
    environmentVariableMappings: manifest.environmentVariables || {
      ...(manifest.datocmsApiTokenEnvName
        ? {
            [manifest.datocmsApiTokenEnvName]: {
              type: 'datocmsAccessToken',
              tokenName: 'Read-only API token',
            },
          }
        : {
            DATO_API_TOKEN: {
              type: 'datocmsAccessToken',
              tokenName: 'Read-only API token',
            },
          }),
      ...(manifest.projectUrlEnvName
        ? {
            [manifest.projectUrlEnvName]: { type: 'datocmsProjectUrl' },
          }
        : {}),
    },
    deploymentTypes: RAW_DEPLOYMENT_TYPES[manifest.deploymentType]!,
    postDeployExtraStep:
      manifest.postDeploy ||
      (typeof manifest.postInstallUrl === 'string'
        ? {
            type: 'apiCall',
            url: manifest.postInstallUrl,
            description: 'Performing post-deploy hook...',
          }
        : undefined),
    preDeployExtraStep: manifest.preDeploy,
    buildCommand: manifest.buildCommand || manifest.netlifyBuildCommand,
    buildDirectory: manifest.buildDirectory || manifest.netlifyBuildDirectory,
  };
}
