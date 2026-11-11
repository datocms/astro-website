import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import s from './style.module.css';
import { FormBoxReactComponent } from '~/components/FormBox/ReactComponent';
import { formControlClass, FormSelectReactComponent } from '~/components/FormField/ReactComponent';
import {
  FieldReactComponent,
  FieldsetReactComponent,
} from '~/components/docs/form/Field/ReactComponent';
import { SpaceReactComponent } from '~/components/docs/Space/ReactComponent';
import TabsReactComponent, { TabReactComponent } from '~/components/docs/Tabs/ReactComponent';
import { CodeSnippetReact } from '~/components/docs/CodeSnippet/ReactComponent';

type Manifest = {
  name: string;
  description: string;
  previewImage: string;
  livePreviewUrl?: string;
  datocmsProjectId: string;
  deploymentType: string;
  environmentVariables: Record<
    string,
    | {
        type: 'datocmsProjectUrl';
      }
    | {
        type: 'datocmsAccessToken';
        tokenName: string;
      }
    | {
        type: 'string';
        value: string;
      }
  >;
  buildCommand?: string;
  postInstallUrl?: string;
};

type FormValues = {
  repo: string | null;
  name: string | null;
  description: string | null;
  previewImage: string | null;
  livePreviewUrl: string | null;
  datocmsProjectId: string | null;
  deploymentType: string | null;
  environmentVariables: Array<
    | {
        type: 'datocmsProjectUrl';
        environmentVariableName: string | null;
      }
    | {
        type: 'datocmsAccessToken';
        tokenName: string | null;
        environmentVariableName: string | null;
      }
    | {
        type: 'string';
        environmentVariableName: string | null;
        value: string | null;
      }
  >;
  buildCommand: string | null;
  postInstallUrl: string | null;
};

const mandatory = 'THIS FIELD IS MANDATORY. PLEASE PROVIDE A VALUE!';

export default function CloneButtonGeneratorForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      deploymentType: 'copyRepo',
      environmentVariables: [
        {
          environmentVariableName: 'DATOCMS_BACKEND_URL',
          type: 'datocmsProjectUrl',
        },
        {
          environmentVariableName: 'DATOCMS_READ_ONLY_API_TOKEN',
          type: 'datocmsAccessToken',
          tokenName: 'Read-only API token',
        },
      ],
    },
  });

  const { handleSubmit: submitFn, register, control, watch } = methods;

  const {
    fields: environmentVariableFields,
    append: addEnvironmentVariable,
    remove: removeEnvironmentVariable,
  } = useFieldArray({ control, name: 'environmentVariables' });

  const formValues = watch();
  const deploymentType = formValues.deploymentType;

  const datocmsJson: Manifest = {
    name: formValues.name || mandatory,
    description: formValues.description || mandatory,
    previewImage: formValues.previewImage || mandatory,
    livePreviewUrl: formValues.livePreviewUrl || undefined,
    datocmsProjectId: formValues.datocmsProjectId || mandatory,
    deploymentType: formValues.deploymentType || mandatory,
    environmentVariables:
      deploymentType !== 'copyRepo'
        ? formValues.environmentVariables.reduce(
            (acc, { environmentVariableName, ...entry }) => {
              if (!environmentVariableName) {
                return acc;
              }

              acc[environmentVariableName] =
                entry.type === 'datocmsAccessToken'
                  ? {
                      type: 'datocmsAccessToken',
                      tokenName: entry.tokenName || mandatory,
                    }
                  : entry.type === 'datocmsProjectUrl'
                    ? { type: 'datocmsProjectUrl' }
                    : {
                        type: 'string',
                        value: entry.value || mandatory,
                      };

              return acc;
            },
            {} as Manifest['environmentVariables'],
          )
        : {},
    buildCommand: deploymentType !== 'copyRepo' ? formValues.buildCommand || mandatory : undefined,
    postInstallUrl:
      deploymentType !== 'copyRepo' ? formValues.postInstallUrl || undefined : undefined,
  };

  const deployUrl = `https://dashboard.datocms.com/deploy?${new URLSearchParams({
    repo: formValues.repo || 'YOUR-GITHUB-REPO',
  }).toString()}`;

  return (
    <FormProvider {...methods}>
      <SpaceReactComponent top={1} bottom={1}>
        <form onSubmit={submitFn(() => null)} className={s.form}>
          <FormBoxReactComponent>
            <FieldReactComponent name="name" label="Project starter name" placeholder="Name" />

            <FieldReactComponent
              name="description"
              label="Description"
              placeholder="Insert a short description for the project starter"
            />

            <FieldReactComponent
              name="previewImage"
              label="Frontend preview screenshot"
              placeholder="https://acme.com/preview.png"
            />

            <FieldReactComponent
              name="livePreviewUrl"
              label="URL of an example of a successful deployment"
              placeholder="https://my-project-starter.netlify.app/"
            />

            <FieldReactComponent
              name="repo"
              label="Github repository that will be copied"
              placeholder="orgName/repoName:branchName"
            />

            <FieldReactComponent
              name="datocmsProjectId"
              label="DatoCMS Project ID that will be duplicated"
              placeholder="54321"
            />

            <FieldReactComponent
              name="deploymentType"
              label="How the project can be built and deployed?"
              options={[
                { value: 'copyRepo', label: 'Simply make a copy of the template repository' },
                {
                  value: 'static',
                  label: 'It can be deployed to any static hosting (Vercel, Netlify)',
                },
                { value: 'vercel', label: 'It can be deployed only to Vercel' },
                { value: 'netlify', label: 'It can be deployed only to Netlify' },
                { value: 'heroku', label: 'It can be deployed only to Heroku' },
              ]}
            />

            {deploymentType !== 'copyRepo' && (
              <>
                <FieldsetReactComponent label="Environment variables to be added on hosting">
                  <div className={s.fieldArray}>
                    {environmentVariableFields.map((field, index) => {
                      const type = formValues.environmentVariables[index]!.type;

                      return (
                        <div key={field.id} className={s.fieldArrayItem}>
                          <div className={s.fieldArrayItemField} style={{ width: '35%' }}>
                            <input
                              required
                              type="text"
                              {...register(`environmentVariables.${index}.environmentVariableName`)}
                              placeholder="ENV_NAME"
                              className={formControlClass}
                            />
                          </div>
                          <div className={s.fieldArrayItemField} style={{ flex: 1 }}>
                            <FormSelectReactComponent
                              {...register(`environmentVariables.${index}.type`)}
                              required
                            >
                              <option value="string">String</option>
                              <option value="datocmsProjectUrl">
                                DatoCMS Backend URL (https://PROJECT.admin.datocms.com/)
                              </option>
                              <option value="datocmsAccessToken">DatoCMS API token</option>
                            </FormSelectReactComponent>
                          </div>
                          {type === 'datocmsAccessToken' && (
                            <div className={s.fieldArrayItemField} style={{ width: '25%' }}>
                              <input
                                required
                                type="text"
                                {...register(`environmentVariables.${index}.tokenName`)}
                                placeholder="Read-only API token"
                                className={formControlClass}
                              />
                            </div>
                          )}
                          {type === 'string' && (
                            <div className={s.fieldArrayItemField} style={{ width: '25%' }}>
                              <input
                                required
                                type="text"
                                {...register(`environmentVariables.${index}.value`)}
                                placeholder="Foo bar"
                                className={formControlClass}
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            className={s.fieldArrayButton}
                            onClick={(e) => {
                              e.preventDefault();
                              removeEnvironmentVariable(index);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      className={s.fieldArrayButton}
                      onClick={(e) => {
                        e.preventDefault();
                        addEnvironmentVariable({
                          value: '',
                          environmentVariableName: '',
                          type: 'string',
                        });
                      }}
                    >
                      Add environment variable
                    </button>
                  </div>
                </FieldsetReactComponent>

                <FieldReactComponent
                  name="buildCommand"
                  label="Build Command"
                  placeholder="npm run build"
                />

                <FieldReactComponent
                  name="postInstallUrl"
                  label="Post-deploy install URL"
                  placeholder="/api/post-deploy"
                />
              </>
            )}
          </FormBoxReactComponent>
        </form>
      </SpaceReactComponent>

      <div>
        <SpaceReactComponent top={1} bottom={1}>
          <h5>Result</h5>
          <p>
            Copy the following code and add it to your Git repository in a file called{' '}
            <code>datocms.json</code>:
          </p>
          <CodeSnippetReact code={JSON.stringify(datocmsJson, null, 2)} lang="json" />
        </SpaceReactComponent>

        <SpaceReactComponent top={1} bottom={1}>
          <p>Use the following code to share the button on your README file or documentation:</p>

          <TabsReactComponent>
            <TabReactComponent title="Markdown" noPadding>
              <CodeSnippetReact
                code={`[![Deploy with DatoCMS](https://dashboard.datocms.com/deploy/button.svg)](${deployUrl})`}
                lang="markdown"
                wrap
              />
            </TabReactComponent>

            <TabReactComponent title="HTML" noPadding>
              <CodeSnippetReact
                code={`<a
  href="${deployUrl}"
  target="_blank"
  rel="noopener"
>
  <img
    src="https://dashboard.datocms.com/deploy/button.svg"
    alt="Deploy with DatoCMS"
  />
</a>`}
                lang="html"
              />
            </TabReactComponent>

            <TabReactComponent title="URL" noPadding>
              <CodeSnippetReact code={deployUrl} lang="text" wrap />
            </TabReactComponent>

            <TabReactComponent title="Preview">
              <a href={deployUrl} target="_blank" rel="noopener noreferrer" className={s.button}>
                <img
                  src="https://dashboard.datocms.com/deploy/button.svg"
                  alt="Deploy with DatoCMS"
                />
              </a>
            </TabReactComponent>
          </TabsReactComponent>
        </SpaceReactComponent>
      </div>
    </FormProvider>
  );
}
