import { PIPEDRIVE_TOKEN } from 'astro:env/server';
import PipedriveClient, { type Lead, type Organization, type Person } from './PipedriveClient';

const pipedrive = new PipedriveClient(PIPEDRIVE_TOKEN);

export async function createNote(lead: Lead, content: string) {
  return await pipedrive.createNote({
    content,
    lead_id: lead.id,
    org_id: lead.organization_id,
    person_id: lead.person_id,
  });
}

export async function createLead(
  person: Person,
  organization: Organization,
  useCase: string,
  labels: string[] = [],
) {
  const useCaseCustomField = '01de2dc74c0a37431deeb784603b14d6c718da12';

  return await pipedrive.createLead({
    title: organization.name,
    [useCaseCustomField]: useCase,
    person_id: person.id,
    organization_id: organization.id,
    label_ids: labels,
  });
}

export async function findOrCreatePerson(
  email: string,
  firstName: string,
  lastName: string,
  country: string,
  jobFunction: string,
  referral: string,
  organization: Organization,
) {
  const jobFunctionCustomField = 'c28a0aa1a4c02699ca8617d8241b4451cb6348d7';
  const referralCustomField = '8d682dcba3c78ba24d802f3391d7fbbc10adeb8e';

  const person = await pipedrive.findPersonByEmail(email);

  if (person) {
    if (person.organization !== null) {
      return person;
    }

    return await pipedrive.setOrganizationToPerson(person.id, organization.id);
  }

  return await pipedrive.createPerson({
    name: `${firstName} ${lastName}`,
    email: email,
    postal_address: country,
    [jobFunctionCustomField]: jobFunction,
    [referralCustomField]: referral,
    org_id: organization.id,
    visible_to: 3,
  });
}

export async function findOrCreateOrgByName(name: string, industry: string, link = '') {
  const industryCustomField = 'b42d7891b195b7aa9a6348258c746d0b03dee2c4';
  const linkField = 'b7d80b2d8f0177495004c3dd83efe67ee44ddaca';

  const organization = await pipedrive.findOrganizationByName(name);

  if (organization) {
    return organization;
  }

  return await pipedrive.createOrganization({
    name: name,
    [industryCustomField]: industry,
    [linkField]: link,
    visible_to: 3,
  });
}
