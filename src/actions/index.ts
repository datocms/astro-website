import fastlyApiDatacenters from './fastlyApiDatacenters';
import inviteEmailToSlackChannel from './inviteEmailToSlackChannel';
import pipedrive from './pipedrive';
import sendFeedbackAboutDocPage from './sendFeedbackAboutDocPage';
import subscribeToNewsletter from './subscribeToNewsletter';

export const server = {
  sendFeedbackAboutDocPage,
  subscribeToNewsletter,
  fastlyApiDatacenters,
  pipedrive,
  inviteEmailToSlackChannel,
};
