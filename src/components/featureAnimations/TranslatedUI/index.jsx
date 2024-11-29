import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import s from './style.module.css';

const ApiTokensIcon = '🏷️';
const SettingsIcon = '⚙️';
const WebhooksIcon = '✈️';
const PluginsIcon = '🧩';
const LogIcon = '🧾';
const DeploymentEnvironmentsIcon = '🚀';
const ItemTypesIcon = '🔷';
const RolesIcon = '🛡️';
const UsersIcon = '👥';

const flags = {
  it: '🇮🇹',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  en: '🇺🇸',
};

const name = {
  it: 'Italian',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  en: 'English',
};

const labels = {
  it: {
    'nav.adminArea': 'Amministrazione',
    'nav.cdaExplorer': 'API Explorer',
    'nav.manageItemTypes': 'Contenuti',
    'nav.mediaArea': 'Media',
    'adminArea.splitPane.apiTokens': 'Token API',
    'adminArea.splitPane.deployment': 'Deployment',
    'adminArea.splitPane.deploymentLogs': 'Deployment logs',
    'adminArea.splitPane.deploymentSettings': 'Impostazioni di deploy',
    'adminArea.splitPane.itemTypes': 'Modelli',
    'adminArea.splitPane.manageEditors': 'Collaboratori',
    'adminArea.splitPane.manageRoles': 'Ruoli',
    'adminArea.splitPane.manageWebhooks': 'Webhook',
    'adminArea.splitPane.menuSettings': 'Menù di navigazione',
    'adminArea.splitPane.permissions': 'Permessi',
    'adminArea.splitPane.plugins': 'Plugin',
    'adminArea.splitPane.siteSettings': 'Impostazioni',
    'adminArea.splitPane.ssgIntegration': 'Impostazioni frontend',
    'adminArea.splitPane.sso': 'Single sign-on',
    'adminArea.splitPane.ssoGroups': 'Gruppi',
    'adminArea.splitPane.ssoSettings': 'Impostazioni',
    'adminArea.splitPane.ssoUsers': 'Utenti provisioned',
    'adminArea.splitPane.structure': 'Struttura',
    'adminArea.splitPane.usage': 'Uso e limiti del piano',
    'adminArea.splitPane.webhookCalls': 'Registro attività',
    'adminArea.splitPane.webhooks': 'Webhook',
  },
  es: {
    'nav.adminArea': 'Ajustes',
    'nav.cdaExplorer': 'Explorador de API',
    'nav.manageItemTypes': 'Contenido',
    'nav.mediaArea': 'Multimedia',
    'adminArea.splitPane.apiTokens': 'Tokens API',
    'adminArea.splitPane.deployment': 'Desplegar',
    'adminArea.splitPane.deploymentLogs': 'Log de actividad',
    'adminArea.splitPane.deploymentSettings': 'Ambientes',
    'adminArea.splitPane.itemTypes': 'Modelos',
    'adminArea.splitPane.manageEditors': 'Colaboradores',
    'adminArea.splitPane.manageRoles': 'Roles',
    'adminArea.splitPane.manageWebhooks': 'Webhooks',
    'adminArea.splitPane.menuSettings': 'Barra de navegación',
    'adminArea.splitPane.permissions': 'Permisos',
    'adminArea.splitPane.plugins': 'Plugins',
    'adminArea.splitPane.siteSettings': 'Ajustes',
    'adminArea.splitPane.ssgIntegration': 'Configuración del generador de sitios estaticos',
    'adminArea.splitPane.sso': 'Sigle sign-on',
    'adminArea.splitPane.ssoGroups': 'Grupos',
    'adminArea.splitPane.ssoSettings': 'Configuración',
    'adminArea.splitPane.ssoUsers': 'Usuarios provisionados',
    'adminArea.splitPane.structure': 'Estructura',
    'adminArea.splitPane.usage': 'Uso y límites del plan',
    'adminArea.splitPane.webhookCalls': 'Log de actividad',
    'adminArea.splitPane.webhooks': 'Webhooks',
  },
  fr: {
    'nav.adminArea': 'Paramètres',
    'nav.manageItemTypes': 'Contenu',
    'nav.mediaArea': 'Média',
    'adminArea.siteSettings.title': 'Paramètres du projet',
    'adminArea.splitPane.apiTokens': "Tokens d'API",
    'adminArea.splitPane.deploymentLogs': "Log d'activité",
    'adminArea.splitPane.deploymentSettings': 'Environnements',
    'adminArea.splitPane.itemTypes': 'Modèles',
    'adminArea.splitPane.manageEditors': 'Collaborateurs',
    'adminArea.splitPane.manageRoles': 'Rôles',
    'adminArea.splitPane.manageWebhooks': 'Webhooks',
    'adminArea.splitPane.menuSettings': 'Barre de navigation',
    'adminArea.splitPane.permissions': 'Permissions',
    'adminArea.splitPane.plugins': 'Plugins',
    'adminArea.splitPane.siteSettings': 'Paramètres',
    'adminArea.splitPane.ssgIntegration': 'Paramètres du générateur statique',
    'adminArea.splitPane.sso': 'Authentification unique (SSO)',
    'adminArea.splitPane.ssoGroups': 'Groupes',
    'adminArea.splitPane.ssoSettings': 'Paramètres',
    'adminArea.splitPane.ssoUsers': 'Utilisateurs provisionnés',
    'adminArea.splitPane.usage': "Limites d'utilisations et forfaits",
    'adminArea.splitPane.webhookCalls': "Log d'activité",
  },
  de: {
    'nav.adminArea': 'Einstellungen',
    'nav.cdaExplorer': 'API-Explorer',
    'nav.manageItemTypes': 'Inhalt',
    'nav.mediaArea': 'Medien',
    'adminArea.siteSettings.title': 'Projekteinstellungen',
    'adminArea.splitPane.apiTokens': 'API-Token',
    'adminArea.splitPane.deployment': 'Deployment',
    'adminArea.splitPane.deploymentLogs': 'Aktivitätsprotokoll',
    'adminArea.splitPane.deploymentSettings': 'Umgebungen',
    'adminArea.splitPane.itemTypes': 'Models',
    'adminArea.splitPane.manageEditors': 'Kollaborateure',
    'adminArea.splitPane.manageRoles': 'Rollen',
    'adminArea.splitPane.manageWebhooks': 'Webhooks',
    'adminArea.splitPane.menuSettings': 'Navigationsleiste',
    'adminArea.splitPane.permissions': 'Berechtigungen',
    'adminArea.splitPane.plugins': 'Plugins',
    'adminArea.splitPane.siteSettings': 'Einstellungen',
    'adminArea.splitPane.ssgIntegration': 'Statische Generatoreinstellungen',
    'adminArea.splitPane.sso': 'Single Sign-on',
    'adminArea.splitPane.ssoGroups': 'Gruppen',
    'adminArea.splitPane.ssoSettings': 'Einstellungen',
    'adminArea.splitPane.ssoUsers': 'Eingerichtete Benutzer',
    'adminArea.splitPane.structure': 'Struktur',
    'adminArea.splitPane.usage': 'Nutzungs- und Planungsgrenzen',
    'adminArea.splitPane.webhookCalls': 'Aktivitätsprotokoll',
    'adminArea.splitPane.webhooks': 'Webhooks',
  },
  en: {
    'nav.adminArea': 'Settings',
    'nav.manageItemTypes': 'Content',
    'nav.mediaArea': 'Media',
    'nav.cdaExplorer': 'API Explorer',
    'nav.languageSettings': 'Language settings',
    'adminArea.siteSettings.title': 'Project settings',
    'adminArea.splitPane.apiTokens': 'API tokens',
    'adminArea.splitPane.deployment': 'Deployment',
    'adminArea.splitPane.deploymentLogs': 'Activity log',
    'adminArea.splitPane.deploymentSettings': 'Environments',
    'adminArea.splitPane.itemTypes': 'Models',
    'adminArea.splitPane.manageEditors': 'Collaborators',
    'adminArea.splitPane.manageRoles': 'Roles',
    'adminArea.splitPane.manageWebhooks': 'Webhooks',
    'adminArea.splitPane.menuSettings': 'Navigation bar',
    'adminArea.splitPane.permissions': 'Permissions',
    'adminArea.splitPane.plugins': 'Plugins',
    'adminArea.splitPane.siteSettings': 'Settings',
    'adminArea.splitPane.ssgIntegration': 'Static generator settings',
    'adminArea.splitPane.sso': 'Single sign-on',
    'adminArea.splitPane.ssoGroups': 'Groups',
    'adminArea.splitPane.ssoSettings': 'Settings',
    'adminArea.splitPane.ssoUsers': 'Provisioned users',
    'adminArea.splitPane.structure': 'Structure',
    'adminArea.splitPane.usage': 'Usage and plan limits',
    'adminArea.splitPane.webhooks': 'Webhooks',
    'adminArea.splitPane.webhookCalls': 'Activity log',
  },
};

const Label = ({ label, locale }) => {
  return (
    <TransitionGroup className={s.labelContainer}>
      <CSSTransition
        key={`${label}${locale}`}
        classNames={{
          enter: s.labelEnter,
          enterActive: s.labelEnterActive,
          exit: s.labelLeave,
          exitActive: s.labelLeaveActive,
        }}
        timeout={{ enter: 1200, exit: 1200 }}
      >
        <span className={s.label}>{label}</span>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default function TranslatedUI() {
  const [locale, setLocale] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocale((locale) => (locale + 1) % Object.keys(labels).length);
    }, 1500);

    return () => clearInterval(interval);
  });

  const localeString = Object.keys(labels)[locale];
  const t = { ...labels.en, ...labels[localeString] };

  return (
    <>
      <div className={s.navbar}>
        <div className={s.title}>Acme</div>
        <div className={s.navbutton}>
          <Label locale={locale} label={t['nav.manageItemTypes']} />
        </div>
        <div className={s.navbutton}>
          <Label locale={locale} label={t['nav.mediaArea']} />
        </div>
        <div className={s.navbutton}>
          <Label locale={locale} label={t['nav.adminArea']} />
        </div>
      </div>
      <div className={s.panes}>
        <div className={s.sidebar}>
          <div className={s.sidebarGroup}>
            <div className={s.sidebarGroupTitle}>Project</div>
            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{SettingsIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.siteSettings']} />
            </div>
          </div>

          <div className={s.sidebarGroup}>
            <div className={s.sidebarGroupTitle}>
              <Label locale={locale} label={t['adminArea.splitPane.structure']} />
            </div>

            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{ItemTypesIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.itemTypes']} />
            </div>
            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{PluginsIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.plugins']} />
            </div>
          </div>

          <div className={s.sidebarGroup}>
            <div className={s.sidebarGroupTitle}>
              <Label locale={locale} label={t['adminArea.splitPane.permissions']} />
            </div>

            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{RolesIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.manageRoles']} />
            </div>

            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{UsersIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.manageEditors']} />
            </div>

            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{ApiTokensIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.apiTokens']} />
            </div>
          </div>

          <div className={s.sidebarGroup}>
            <div className={s.sidebarGroupTitle}>
              <Label locale={locale} label={t['adminArea.splitPane.webhooks']} />
            </div>
            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{WebhooksIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.manageWebhooks']} />
            </div>
            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{LogIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.webhookCalls']} />
            </div>
          </div>

          <div className={s.sidebarGroup}>
            <div className={s.sidebarGroupTitle}>
              <Label locale={locale} label={t['adminArea.splitPane.deployment']} />
            </div>

            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{DeploymentEnvironmentsIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.deploymentSettings']} />
            </div>

            <div className={s.sidebarItem}>
              <div className={s.sidebarItemIcon}>{LogIcon}</div>
              <Label locale={locale} label={t['adminArea.splitPane.deploymentLogs']} />
            </div>
          </div>
        </div>
        <div className={s.main}>
          <TransitionGroup className={s.flagContainer}>
            <CSSTransition
              key={localeString}
              classNames={{
                enter: s.flagEnter,
                enterActive: s.flagEnterActive,
                exit: s.flagLeave,
                exitActive: s.flagLeaveActive,
              }}
              timeout={{ enter: 1200, exit: 1200 }}
            >
              <span className={s.flag}>{flags[localeString]}</span>
            </CSSTransition>
          </TransitionGroup>
          <div className={s.hey}>We speak {name[localeString]}!</div>
        </div>
      </div>
    </>
  );
}
