import forms from './forms';
import inviteEmailToSlackChannel from './inviteEmailToSlackChannel';
import pipedrive from './pipedrive';
import sendFeedbackAboutDocPage from './sendFeedbackAboutDocPage';
import subscribeToNewsletter from './subscribeToNewsletter';

export const server = {
  sendFeedbackAboutDocPage,
  subscribeToNewsletter,
  forms,
  pipedrive,
  inviteEmailToSlackChannel,
};
