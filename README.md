# Eurofurence Hotelbooking App

This is a statically hostable app for creating a hotel room reservation email. It allows the user to enter personal details required to book a hotel room and generate an email text based on a template.

## Setup

Since this is a static webpage, you can just copy and paste the contents of this directory to any webserver. You might want to configure certain files to your needs. Here is how to do the most common tasks:

- [Adjust Mail template](#adjust-mail-template)
- [Adjust room categories and pricing](#adjust-room-categories-and-pricing)
- [Adjust dates](#adjust-dates)
- [Configure Secret code](#configure-secret-code)

### Adjust Mail template

This app is available in German and Englisch. Therefore, there is one version of the content files (html, config and mailtemplate) for both languages. The path of the mail template can be configured in the config.json of the respective language directory.

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

The Eurofurence hotel booking email has to contain a secret code that is revealed at a specific date. This date is specified in the config.json as a special keyword `secret`. This is an object that contains a `location` and `time` field.
Keep in mind that you have to update this for both the english and german version so that they stay in sync.

`time` should be an ISO 8601 date string containing the timezone.

`location` is the path to the secret resource. In the example this is a simple text file. However, this can be any url that answers to a GET request.

Since this is the most delicate part of the application, here are some tips for the setup:

#### Protect the secret using server side validation

In a production setting you should probably use server side validation (e.g. using a PHP script), that ensures that the secret is not leaked early instead of just pasting a plain .txt file to the server.

#### Do not return a 2xx response if the secret is not revealed yet

Make sure that your server returns an error code (e.g. 404) if any user tries to access the secret before the reveal time. Otherwise the app might interpret your response for the secret and construct a wrong email-text

#### Use some buffer to ensure the secret is ready at the specified time

The app is configured in a way that it automatically fires a GET request at the time specified in the config.json. However, since not all computers are perfectly in sync, it could be that when it's exactly the reveal time on the users machine, the server might be a couple milliseconds behind.

To avoid a frustrating error message for the user, it is recommended to have a small buffer on the server side validation. E.g. if you reveal the code at 07:00:00, it might make sense to configure the server to respond to requests coming in at 06:59:59 with the secret too.

This buffer should not be more than a few seconds at maximum to give everyone the same chances.
