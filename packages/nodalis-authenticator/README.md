# @nodalis/authenticator ("nAuthr" || "A⋂r")

> Authenticate your application at scale!

The **nAuthr** package is the authentication engine for a Nodalis project, built on top of Firebase Auth. Firebase Auth under the hood allows you to authorize your entire application with a single api key piped into the contextual core. From there, you can authenticate every request inside of **nServr**, or even specify which users have elevated access so that they can use your application's Admin Dashboard. The implementation is in your hands, the security in ours. Happy coding.

Adds options:

```yml
nAuthr:
  - service-account-file: string
  - firebaseServiceAccount: string
```
