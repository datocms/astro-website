import ApiClient from '~/lib/ApiClient';

export type Organization = {
  id: number;
  name: string;
};

export type Person = {
  id: number;
  email: string;
  name: string;
  organization: Organization | null;
};

export type Lead = {
  id: number;
  title: string;
  organization_id: string | null;
  person_id: string | null;
};

export type Note = {
  id: number;
  content: string;
};

class PipedriveClient extends ApiClient {
  constructor(apiToken: string) {
    super('https://datocms.pipedrive.com/v1', { api_token: apiToken }, {});
  }

  async createOrganization(organization: { name: string } & Record<string, unknown>) {
    const { data } = await this.post<{ data: Organization }>('/organizations', organization);
    return data;
  }

  async findOrganizationByName(name: string) {
    const { data: orgs } = await this.get<{ data: Array<Organization> }>('/organizations/find', {
      term: name,
      exact_match: 'true',
    });

    if (orgs.length > 0 && orgs[0]!.name.toLowerCase() === name.toLowerCase()) {
      return orgs[0];
    }

    return undefined;
  }

  async findPersonByEmail(email: string) {
    const { data: persons } = await this.get<{ data: Array<Person> }>('/persons/search', {
      term: email,
      fields: 'email',
      exact_match: 'true',
    });

    if (persons.length > 0) {
      return persons[0];
    }

    return undefined;
  }

  async setOrganizationToPerson(personId: number, organizationId: number) {
    const { data: person } = await this.put<{ data: Person }>(`/persons/${personId}`, {
      org_id: organizationId.toString(),
    });

    return person;
  }

  async createPerson(person: { name: string } & Record<string, unknown>) {
    const { data } = await this.post<{ data: Person }>('/persons', person);
    return data;
  }

  async createLead(lead: { title: string } & Record<string, unknown>) {
    const { data } = await this.post<{ data: Lead }>('/leads', lead);
    return data;
  }

  async createNote(note: { content: string } & Record<string, unknown>) {
    const { data } = await this.post<{ data: Note }>('/notes', note);
    return data;
  }
}

export default PipedriveClient;
