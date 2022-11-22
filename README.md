# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

| Key              | Required | Description                            |
|------------------|----------|----------------------------------------|
| html-file        | Yes      | Path to file containing the HTML email |
| mailgun-api-key  | Yes      | Mailgun Api Key                        |
| mailgun-domain   | Yes      | Mailgun domain is used for templates   |
| mailgun-template | Yes      | Mailgun template name                  |

## Example usage

```yaml
- name: "Create password reset template"
  uses: gyto/hello-world-javascript-action@v1
  with:
    html-file: './build/register.html'
    mailgun-api-key: ${{ secrets.MAILGUN_KEY }}
    mailgun-domain: "mydomain.fansy.com",
    mailgun-template: "register-template"
```
