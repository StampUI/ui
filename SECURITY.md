# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Email **support@stampui.com** with a description, reproduction steps, and impact. You will get an acknowledgement within a few days; please allow a reasonable window for a fix before public disclosure.

## Scope

- Components in this repository are static source files with no network access or install-time execution; most issues here are correctness or accessibility rather than security. XSS-style issues (e.g. a component rendering unescaped user content dangerously) are in scope and taken seriously.
- Issues in the `stampui` CLI (file writing, license key handling) should go to the same address; the CLI source lives at [StampUI/cli](https://github.com/StampUI/cli).
- Issues affecting the stampui.com service or the commercial registry can also be reported to the same address.
