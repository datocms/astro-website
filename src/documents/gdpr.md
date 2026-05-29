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

We hold backups for disaster recovery purposes also in "eu-west-3" region, located in France.

Personal data is stored in the DatoCMS databases managed by AWS.

[AWS GDPR compliance](https://aws.amazon.com/compliance/gdpr-center/)

### Cloudflare

Any assets uploaded while using the service are stored in Cloudflare R2, in its European Union jurisdiction.

[Cloudflare GDPR compliance](https://www.cloudflare.com/trust-hub/gdpr/)

## Data shared with third parties

### AppSignal

We use AppSignal to compute performance metrics on API calls in order to find and optimize bottlenecks. AppSignal collects IP information and performance metrics for each server request.

[AppSignal GDPR compliance](https://docs.appsignal.com/appsignal/gdpr.html)

### Calendly

To book meetings or support sessions we ask our users use Calendly. By using Calendly they need to provide their name, email address and optional additional information. Optionally the user can provide access to their Google Calendar.

[Calendly GDPR Compliance](https://help.calendly.com/hc/en-us/articles/360007032633-GDPR-FAQs)

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

### Fastly

When visiting the public website, it is served by the Fastly CDN.

The information collected by Fastly is:

- IP address,
- user agent
- URL visited

[Fastly GDPR Compliance](https://www.fastly.com/data-processing)

### Front

When you open a support ticket, via email or support form, we supply them the email address.

[Front GDPR Compliance](https://help.frontapp.com/t/m22vyb/is-front-compliant-with-gdpr)

### Google Ads conversion tracking

We use Google Ads and Google Tag Manager to track ads conversions. In order to do that we share
as few information as possible:

- IP address
- User agent
- URL visited
- limited user interaction (e.g. form submission)

[Google GDPR Compliance]()

### Google workspace

Underlying Front, we use Google workspace to send and receive email and to book meetings.

[Google GDPR Compliance](https://cloud.google.com/privacy/gdpr)

### imgix

We use imgix to improve and optimize images uploaded by our users. imgix has access to all the
assets, but not directly with users as it's behind our CDN.

The only data shared with imgix are the actual files uploaded by our users.

[imgix GDPR Compliance](https://www.imgix.com/data-privacy-framework)

### Invoicetronic

To comply with Italian regulation we must send all invoices done to Italian customers directly
to a public service. To do that we use Invoicetronic APIs to simplify the task.

So with Invoicetronic we share all the billing information of our Italian customers.

[Invoicetronic GDPR Compliance](https://invoicetronic.com/gdpr/)

### LinkedIn

We use LinkedIn in our public website to track ads conversions. In order to do that we share
as few information as possible:

- IP address
- User agent
- URL visited
- limited user interaction (e.g. form submission)

[LinkedIn privacy policy](https://www.linkedin.com/legal/privacy/eu)

### MailerLite

If you opt to sign up for our newsletter, we register you on our MailerLite
account, supplying them with:

- email,
- first name,
- last name.

[MailerLite GDPR Compliance](https://www.mailerlite.com/gdpr-compliance)

### Mux

To optimize and stream videos uploaded by our customers we use Mux.

To optimize videos Mux has access to all video assets uploaded with the users.

To stream videos to the end users Mux collects:

- IP address
- User agent
- user interactions with videos

[Mux privacy policy](https://www.mux.com/privacy)

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

### Postmark

We send transactional emails as part of normal product-user communication. To do that we use Postmark.

The information shared with Postmark are:

- email,
- first name,
- last name,
- usage-related information.

[Postmark GDPR Compliance](https://postmarkapp.com/eu-privacy#gdpr)

### Pusher (Messagebird)

To improve user experience of CMS usage we use websocket calls in order to send push messages to the browser
after completion of asynchronous server tasks. To send webhooks we use Pusher, our supplier that can collect:

- IP address,
- usage-related information.

[Messagebird GDPR Compliance](https://www.messagebird.com/en/legal/dpa)

### QuickBooks

Our company needs to send certified digital invoices to our Italian customers and to the government. To do that we use QuickBooks.

The information passed on to QuickBooks are:

- first name,
- last name,
- company,
- VAT number,
- billing address.

[QuickBooks GDPR Compliance](https://quickbooks.intuit.com/eu/gdpr/)

### Rollbar

We use Rollbar to track software errors. In certain situations, to help the tracking of the information, we supply them the email address.

[Rollbar GDPR Compliance](https://rollbar.com/compliance/gdpr/)

### Stripe

When adding a credit card to your billing profile we send the card information to Stripe directly, without reading that information ourselves.

We then forward the result of the card registration to Chargebee that triggers the card charges.

To Stripe we send:

- credit card details, which we cannot read ourselves apart the last 4 digits,
- email

[Stripe GDPR Compliance](https://stripe.com/guides/general-data-protection-regulation)

### Vercel

Some additional websites are hosted on Vercel, e.g. try.datocms.com. To provide this service Vercel can collect limited data:

- IP address,
- User agent,
- URL visited by users.

## Other minor suppliers used in the product

These suppliers are used to improve the product but very little information is collected by these suppliers. Mainly IP address, browser user agent and possibly a URL or very limited content, like a search string:

- Adobe Fonts
- Algolia
- Elastic cloud
- Facebook video embeds
- GeoJS
- Google Maps Widget
- Google reCAPTCHA
- Google Fonts
- Gravatar
- Have I Been Pwned / Pwned Passwords
- Iframely
- RawGitHack
- UI Avatars
- Vimeo
- YouTube Video Widget, privacy-enhanced mode

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
- to send you an invoice, we never save your credit card data, we delegate Stripe and Chargebee the storage and management of your data.
- as an Italian company we need to send electronic copies of invoices to the state. To do that we use QuickBooks and our internal accounting system, which receives data from Chargebee and sends electronic invoices through SDI using Invoicetronic.
- to send you transactional emails about the service, promotional and marketing emails we use MailerLite and Postmark.
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

Latest update: June 3, 2026
