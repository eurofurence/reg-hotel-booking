# Eurofurence Hotelbooking App

This is a statically hostable app for creating a hotel room reservation email. It allows the user to enter personal details required to book a hotel room and generate an email text based on a template.

## Setup

Since this is a static webpage, you can just copy and paste the contents of this directory to any webserver. You might want to configure certain files to your needs. Here is how to do the most common tasks:

- [Adjust Mail template](#adjust-mail-template)
- [Adjust room categories and pricing](#adjust-room-categories-and-pricing)
- [Adjust dates](#adjust-dates)
- [Configure Secret code](#configure-secret-code)

### Adjust Mail template

This app is available in German and English. Therefore, there is one version of the content files (html, config and mailtemplate) for both languages. The path of the mail template can be configured in the config.json of the respective language directory.

The path that is specified under the `mail.template` property of the config.json is relative to the location of the `reservation-show.html` page., e.g. if you specify "mail.txt" as path, the mail template should be in the same directory as the html file.

The template file itself should contain the plain text of the email body. You can specify the subject and the recipient in the config.json. The template is parsed using [mustache.js](https://github.com/janl/mustache.js), which allows you to access the details the user entered on the previous page. You can access every form element by their id.

In addition, you can configure keywords in the config.json, which are also available in the template. Keep in mind that the keyword "secret" has a special semantic (see Configure Secret code)

### Adjust room categories and pricing

Available room categories and their prices are maintained in the config.json of the respective language. Every entry of the roomtypes array has to contain a name, an infolink as well as the three price properties. "price1" represents the price of one room of this category for one person per night, "price2" for two persons, "price3" for three persons.

You can have as many room types as you want, however, no more than three persons per room.

Keep in mind that you have to update this for both the english and german version so that they stay in sync.

### Adjust dates

The date range of accepted arrival and departure dates are maintained in the `config.js` of the corresponding language. You can set different date formats for different languages. In this default installation, the format for german is dd.mm.yyyy (e.g. 12.08.2019) while the format for english is mm/dd/yyyy (e.g. 08/12/2019). For both the arrival and departure dates, you can set the earliest, latest, and default values.

Please note that the default values are only applied if the user has not interacted with the form yet. If the user selected their own dates previously, they take precedence over the default values when the page is loaded.

Keep in mind that you have to update this for both the english and german version so that they stay in sync.

### Configure Secret code

The Eurofurence hotel booking email has to contain a secret code that is revealed at a specific date. The date and the secret is retrieved from a server. You have to specify the URL of the endpoint where the time and secret can be retrieved in the `timeServer` field in the config.json. Keep in mind that you have to update this for both the english and german version so that they stay in sync.

The endpoint has to answer to a GET request with the following payload:

```json
{
  "targetTime": "2019-12-24T18:00:00+01:00",
  "countdown": 7018580
}
```

If the target time is reached, the JSON has to contain an additonal `secret` field that contains the secret as a string.
