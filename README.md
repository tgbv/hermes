## Hermes project
Sending SMS over TOR has never been easier..

Official url: http://oje2m3xm6hdixwlv3kpmn7fhqdu7owvgr3j3ksv375dvbibuayetvyqd.onion/

### Description
With Hermes you can send SMSs anonymously via TOR using a simple API. 
This is convenient if your site needs protection against bots with SMS verification code, or have no credit and wish to send a quick message via internet means.

As messaging engine Hermes uses [Telnyx](https://telnyx.com), so note your message from/to/text are passing their infrastructure before reaaching the desired numbers. It would be costly for me to buy SIM cards and fill them up with enough credit to send messages worldwide, therefore I'm sticking with telnyx for now.

### Features

- [x] Publicly send demo message with recaptcha
- [x] Create account
- [x] Login to account
- [x] API key regeneration
- [x] Change password in dashboard
- [x] API documentation
- [x] Implement recaptcha on account creation/authentication
- [ ] Validate created accounts via E-mail/SMS 
- [x] Send messages via API using tokens from created accounts
- [x] Implement throttles for API
- [ ] Add filter list for wording to prevent abuse
- [ ] Add throttling information in dashboard

### Contributing/Engineering

Currently application has 2 base modules: the **server** and the **sms-sender** which communicate locally via HTTP.

- Server is written in Node with Expressjs and uses Ejs to process frontend data. It handles the frontend, API and site logic.

- Sms-sender is written in Go with [telnyx-golang](https://github.com/tgbv/telnyx-golang) wrapper for Telnyx API. It handles the actual process of sending/receiving messages. Outbound communications are in direct with Telnyx API, via **clearnet**, so your sent message does reach the clearnet at some point.

Ideas and contributions are welcomed!

### Questions/support

Should you have questions, do lookup the "issues" tab and post them if they're not answered already.
