import forms from './forms';
import inviteEmailToSlackChannel from './inviteEmailToSlackChannel';
import sendFeedbackAboutDocPage from './sendFeedbackAboutDocPage';
import subscribeToNewsletter from './subscribeToNewsletter';

export const server = {
  sendFeedbackAboutDocPage,
  subscribeToNewsletter,
  forms,
  inviteEmailToSlackChannel,
};
