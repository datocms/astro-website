DatoCMS takes great care when handling users' personally identifiable data.

Details of this are given in this document for GDPR-specific documentation, then
in our [Terms of Service](/legal/terms)
and our [Privacy Policy](/legal/privacy-policy).

## Personal data we collect

The system stores personal information for the signed up users:

- email
- first name
- last name
- company

For paying customers we collect also the company billing information.

We collect also IP addresses of end users visiting the projects created with DatoCMS.

We collect all the data that users input during the usage of the software, such as text and images loaded during CMS usage.

## Data storage

### AWS

DatoCMS runs on AWS, in its "eu-west-1" region, located in Ireland.

Personal data is stored in the DatoCMS databases managed by AWS.

[AWS GDPR compliance](https://aws.amazon.com/compliance/gdpr-center/)

### Cloudflare

Any assets uploaded while using the service are stored in Cloudflare R2, in its European Union jurisdiction.

[Cloudflare GDPR compliance](https://www.cloudflare.com/trust-hub/gdpr/)

## Data shared with third parties

### Chargebee

When you sign up for a paid plan, we ask for the information that is legally
required for invoicing and supply it directly to Chargebee. We do not store
this information in our systems.

The information is:

- email,
- first name,
- last name,
- company,
- VAT number,
- billing address.

[Chargebee GDPR Compliance](https://www.chargebee.com/security/gdpr/)

### Stripe

When adding a credit card to your billing profile we send the card information to Stripe directly, without reading that information ourselves.

We then forward the result of the card registration to Chargebee that triggers the card charges.

To Stripe we send:

- credit card details, which we cannot read ourselves apart the last 4 digits,
- email

[Stripe GDPR Compliance](https://stripe.com/guides/general-data-protection-regulation)

### Pipedrive

When you submit a contact form or when you become a paying customer we create a record on our CRM platform, Pipedrive.

We only collect the information that you provide or that is publicly available online.

The information is:

- email,
- first name,
- last name,
- company,
- any additional information that you provide on the contact form.

[Pipedrive GDPR Compliance](https://www.pipedrive.com/en/privacy)

### QuickBooks

Our company needs to manage accounting records and send certified digital invoices to our Italian customers and to the government. To do that we use QuickBooks.

The information passed on to QuickBooks is:

- first name,
- last name,
- company,
- VAT number,
- billing address.

[QuickBooks GDPR Compliance](https://quickbooks.intuit.com/eu/gdpr/)

### Invoicetronic

For Italian electronic invoicing, we use Invoicetronic to send and receive invoices through SDI.

The information passed on to Invoicetronic is:

- invoice data,
- first name,
- last name,
- company,
- VAT number,
- billing address.

[Invoicetronic GDPR Compliance](https://invoicetronic.com/en/gdpr/)

### Front

When you open a support ticket, via email or support form, we supply them the email address.

[Front GDPR Compliance](https://help.frontapp.com/t/m22vyb/is-front-compliant-with-gdpr)

### Calendly

To book meetings or support sessions we ask our users use Calendly. By using Calendly they need to provide their name, email address and optional additional information. Optionally the user can provide access to their Google Calendar.

[Calendly GDPR Compliance](https://help.calendly.com/hc/en-us/articles/360007032633-GDPR-FAQs)

### Google workspace

Underlying Front, we use Google workspace to send and receive email and to book meetings.

[Google GDPR Compliance](https://cloud.google.com/privacy/gdpr)

### MailerLite

If you opt to sign up for our newsletter or marketing communications, we register you on our MailerLite account, supplying them with:

- email,
- first name,
- last name.

[MailerLite GDPR Compliance](https://www.mailerlite.com/gdpr-compliance)

### Postmark

We use Postmark to send transactional and service emails, such as account and service notifications.

The information sent to Postmark is:

- email,
- first name,
- last name.

[Postmark GDPR Compliance](https://postmarkapp.com/support/article/1168-postmarks-gdpr-compliance)

### Rollbar

We use Rollbar to track software errors. In certain situations, to help the tracking of the information, we supply them the email address.

[Rollbar GDPR Compliance](https://rollbar.com/compliance/gdpr/)

### AppSignal

We use AppSignal to compute performance metrics on API calls in order to find and optimize bottlenecks. AppSignal collects IP information and performance metrics for each server request.

[AppSignal GDPR compliance](https://docs.appsignal.com/appsignal/gdpr.html)

### PostHog

To better understand the product usage, we send to PostHog certain user actions performed in the CMS and website.

The information that we send are:

- email,
- first name,
- last name,
- company,
- action performed,
- device information,
- IP address.

[PostHog GDPR Compliance](https://posthog.com/handbook/company/security#gdpr)

### Imgix

We use Imgix to optimize and deliver uploaded images.

Imgix may process:

- uploaded image data,
- Usage Data,
- IP address,
- device information,
- browser information.

[Imgix Privacy Policy](https://imgix.com/privacy)

### Mux

We use Mux to encode, process, and stream uploaded videos.

Mux may process:

- uploaded video data,
- Usage Data,
- IP address,
- device information,
- browser information.

[Mux Privacy Policy](https://www.mux.com/privacy)

### Pusher

We use Pusher to deliver realtime notifications and updates in the CMS and related API flows.

Pusher may process:

- Usage Data,
- IP address,
- device information,
- browser information.

[Pusher Privacy Policy](https://bird.com/legal/privacy)

### Elastic

We use Elastic as backend search and indexing infrastructure.

Elastic may process:

- Usage Data,
- data needed to search and index service content.

[Elastic Privacy Statement](https://www.elastic.co/legal/privacy-statement)

## Legal basis

We collect and store your data for the following reasons:

- To fulfill contractual obligations with a data subject.
- To perform tasks at the request of a data subject who is in the process of
  entering into a contract with a data controller.
- To comply with legal obligations, including accounting and invoicing obligations.
- Based on your consent, for example for newsletter and marketing communications.

(For more information about these reasons, see [the explanation on Wikipedia][wikipedia-gdpr-lawful-basis])

[wikipedia-gdpr-lawful-basis]: https://en.wikipedia.org/wiki/General_Data_Protection_Regulation#Lawful_basis_for_processing

## Use and flow of the data

We use your data to do the following:

- to allow you to log in to the site. In this case your data stays in our main servers only.
- to process payments and send invoices, we use Stripe and Chargebee. Billing and invoicing data may also be stored in DatoCMS systems where needed to manage subscriptions and legal accounting obligations.
- as an Italian company we need to send electronic copies of invoices to the state. To do that we use QuickBooks and our internal accounting system, which receives data from Chargebee and sends electronic invoices through SDI using Invoicetronic.
- to send you transactional emails about the service, we use Postmark.
- to send promotional and marketing emails, we use MailerLite.
- on support request we ask your email address to contact you back and we share that information with Front, the service we use for customer care.
- when you fill the online forms and when you sign up we send the provided data to Pipedrive to improve the sale process.
- when an error occurs on the platform we automatically send some telemetry data to Rollbar to be notified about the errors and help us to resolve them. If the error happens on the CMS interface we also send the email address of the user to be able to easily get in touch to gain additional information.

## Duration of data retention

We store your data for the duration of your use of the system, unless a longer retention period is required by law.

When you cancel your account, personal data associated with the account is deleted or anonymized unless we need to retain it for legal compliance.

Accounting data is held for 10 years for legal compliance.

## Your rights over your personal data

We respect your right to do the following:

- request a copy of your data
- update your data
- request deletion of your data

Please contact us (at the address below) if you want to do any of the above.

## How to contact us

If you have any doubts, or wish to exercise your rights (as listed above),
please send us an email here: [support@datocms.com](mailto:support@datocms.com)

Latest update: May 28, 2026
