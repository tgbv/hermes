## Hermes project
Sending SMS over TOR has never been easier..

Official domain: [oje2m3xm6hdixwlv3kpmn7fhqdu7owvgr3j3ksv375dvbibuayetvyqd.onion](http://oje2m3xm6hdixwlv3kpmn7fhqdu7owvgr3j3ksv375dvbibuayetvyqd.onion)

### Description
With Hermes you can send SMSs anonymously via TOR. Clients can register an account and use the onion API to programmatically send messages worldwide. This is convenient if you want to send an SMS from your own hidden service and maintain the same level of anonymity. Or have no credit and wish to send a quick message via hidden services.

As carrier Hermes uses [Telnyx](https://refer.telnyx.com/jwnf7), so note your message from/to/text are passing their infrastructure before reaaching the desired numbers. It would be costly for me to buy SIM cards and fill them up with enough credit to send messages worldwide, therefore I'm sticking with this carrier for now.

### Project Structure

Application has 3 base modules which communicate locally via HTTP.

- **Server** is written in Node with Expressjs and uses Ejs to process frontend data. It handles the frontend, API and site logic.

- **SMS-sender** is written in Go with [telnyx-golang](https://github.com/tgbv/telnyx-golang) wrapper for Telnyx API. It handles the actual process of sending/receiving messages. Outbound communications are in direct with Telnyx API via **clearnet**. As Hermes client though, this does not affect your anonymity.

- **Blacklist** is written in Go. It fetches the list with blacklisted phrases every ~2 minutes and stores them in RAM. It checks the outgoing messages "from/text" fields against the phrases. Blacklisted phrases are regular expressions, can be browsed [here](https://github.com/tgbv/hermes/blob/master/blacklist/list.txt).

### Contributing

Contributions are welcomed! Please do not commit your changes directly onto master. Create a separate branch with whatever name you want and commit there. Also stick a comprehensive description. If changes are reliable I'll merge them with the master.
