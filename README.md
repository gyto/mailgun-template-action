# Mailgun Template Action

Mailgun Template creation and version management

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
  uses: gyto/mailgun-template-action@v2
  with:
    html-file: './build/register.html'
    mailgun-api-key: ${{ secrets.MAILGUN_KEY }}
    mailgun-domain: "mydomain.fansy.com",
    mailgun-template: "register-template"
```
