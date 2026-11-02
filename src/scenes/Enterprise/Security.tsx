import { AuditLog, type AuditLogColumn, SignIn, SsoSettings } from '@datocms/product-scenes';
import { type FragmentSceneProps, Scene, type SceneAppearance } from '../Scene';
import logoUrl from './northwind-logo.svg?url';
import { AUDIT_LOG, GROUP_NAME, SIGN_IN_EMAIL, SSO } from './story';

// The scenes of the chapter "Security" of the enterprise page. Read the
// scene rules in the README of @datocms/product-scenes. All the values are
// fixed, thus the markup is the same on each render.

const THEME = 'blue';

/** The columns of the audit log in the frame, and their relative widths */
const COLUMNS = [
  { name: 'time', width: 2 },
  { name: 'actor', width: 2.2 },
  { name: 'action', width: 2.4 },
  { name: 'path', width: 2.6 },
  { name: 'environment', width: 1.7 },
  { name: 'role', width: 1.7 },
] as const satisfies { name: AuditLogColumn; width: number }[];

/**
 * The single sign-on settings of the group, larger: the picture of the
 * fragment "Your login, your rules". The box cuts the form.
 */
export function SsoScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The single sign-on settings of the DatoCMS project of ${GROUP_NAME}: SAML with the metadata URL of an Okta app, SCIM provisioning with the API token that DatoCMS just made, and ${SSO.defaultRole} as the default role of the users.`}
      width={width}
      height={height}
    >
      <SsoSettings {...SSO} serviceProvider={{ ...SSO.serviceProvider }} />
    </Scene>
  );
}

/**
 * The audit log of the group: the frame of the chapter. All the columns
 * show, thus the table fills the width of the frame. The screen takes the
 * width of the frame.
 */
export function AuditLogScene({
  appearance,
  height,
}: {
  appearance?: SceneAppearance;
  height: number;
}) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The audit log of the DatoCMS project of ${GROUP_NAME}: ten events of one morning, newest first, each with its time, its author, the action, the path of the request, the environment and the role of the author. ${AUDIT_LOG.map((event) => `${event.actor.name} (${event.role}): ${event.action}`).join('; ')}.`}
      height={height}
    >
      <AuditLog
        events={AUDIT_LOG.map((event) => ({ ...event, actor: { ...event.actor } }))}
        columns={COLUMNS}
      />
    </Scene>
  );
}

/**
 * The sign-in page of the cms of the group, white-labelled as in the
 * chapter Governance: the logo of Northwind, the email of a person of the
 * group, and the button "Log in with single sign-on". The picture of the
 * fragment "Your login, your rules".
 */
export function SignInScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The sign-in page of the DatoCMS project of ${GROUP_NAME}, with the logo of Northwind: the field Email with ${SIGN_IN_EMAIL}, the field Password, the button "Log in", then "or" and the button "Log in with single sign-on".`}
      width={width}
      height={height}
    >
      <SignIn project={{ name: GROUP_NAME, logoUrl }} email={SIGN_IN_EMAIL} whiteLabel />
    </Scene>
  );
}
