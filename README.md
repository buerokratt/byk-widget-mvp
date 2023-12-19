# Bürokratt Widget

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm test:coverage`

Launches the test runner and displays code coverage

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

### `npm run webpack`

Bundles the app into a single bundle named `widget_bundle.js` for easy embedding

## Snippet embedding

Snippet can be embedded to any site using the following html:
```
<div id="byk-va"></div>
<script>
  window._env_ = {
    RUUTER_API_URL: 'LOCATION_OF_RUUTER',
    TIM_AUTHENTICATION_URL: 'TIM url with callback parameter',
    OFFICE_HOURS: {
      TIMEZONE: 'Europe/Tallinn',
      BEGIN: 8,
      END: 17,
      DAYS: [1, 2, 4, 5],
    },
    other variables...
  };
</script>
<script id="script-bundle" type="text/javascript" src="LOCATION_OF_WIDGET_BUNDLE" crossorigin=""></script>
```

## Configurable variables

* `RUUTER_API_URL`: Location of back end for fetching data
* `TIM_AUTHENTICATION_URL`: Link to authenticate user
* `OFFICE_HOURS`: If this variable is added, widget will be hidden when not in defined work hours. If this variable is not added, the widget will always be displayed
  * `TIMEZONE`: Used for comparing the following variables against a specific timezone.
  * `BEGIN`: Beginning of office hours. If current time is before this hour (24H), the widget will not be displayed
  * `END`: End of office hours. If current time is after this hour (24H), the widget will not be displayed
  * `DAYS`: List of days in numbers, where 1=monday, 2=tuesday, 3=wednesday... If current day is in the list of days, the widget will be displayed according to 
  BEGIN and END times.


## Rasa Buttons Support

In order for Rasa buttons to be supported this [Pull Request](https://github.com/buerokratt/Buerokratt-Chatbot/pull/359) must be merged and deployed. Other option is to merge and deploy it manually using these steps:

- Add `m.buttons,` to the `SELECT` statement of `DSL.Resql/get-chat-messages-updated-after-time.sql` as in [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.Resql/get-chat-messages-updated-after-time.sql#L4)

- Add `m.buttons,` to the `SELECT` statement of `DSL.Resql/get-chat-messages.sql` as in [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.Resql/get-chat-messages.sql#L4)

- Add `"buttons": "{{buttons}}",` in line number 5 of `DSL.DMapper/format_chat_log.hbs` as in [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.DMapper/format_chat_log.hbs#L5C14-L5C39)

- Add the following line
  ```
  "buttons": "[{{#each buttons}}{\"title\": \"{{{escape_special_chars title}}}\",\"payload\": \"{{{escape_special_chars payload}}}\"}{{#unless @last}},{{/unless}}{{/each}}]",
  ```
  in line number 6 of `DSL.DMapper/bot_responses_to_messages.hbs` as in 
  [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.DMapper/bot_responses_to_messages.hbs#L6)

- Add `buttons,` into the `SELECT` statement of `DSL.Resql/get-message-by-id.sql` as in [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.Resql/get-message-by-id.sql#L5)

- Add `buttons,` into the `SELECT` statement of `DSL.Resql/get-messages-by-ids.sql` as in [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.Resql/get-messages-by-ids.sql#L5)

- Inside file `DSL.Resql/insert-bot-message.sql` do
  - Add `buttons,` into the `INSERT INTO` as in [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.Resql/insert-bot-message.sql#L1C53-L1C62)
  - Add `(SELECT value) ->> 'buttons' AS buttons,` into the `SELECT` statement as in [here](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.Resql/insert-bot-message.sql#L6C8-L6C56)


- Copy [database migration file](https://github.com/baha-a/Buerokratt-Chatbot/blob/44633eb8c36626db4d8358bbecefbf37117c84d5/DSL.Liquibase/changelog/20231116124800_add_buttons_to_messages.xml) into `DSL.Liquibase/changelog/20231116124800_add_buttons_to_messages.xml`
 
- Run database migration by executing this command
  ```
  docker run --rm --network bykstack -v `pwd`/DSL.Liquibase/changelog:/liquibase/changelog -v `pwd`/DSL.Liquibase/master.yml:/liquibase/master.yml -v `pwd`/DSL.Liquibase/data:/liquibase/data liquibase/liquibase --defaultsFile=/liquibase/changelog/liquibase.properties --changelog-file=master.yml --url=jdbc:postgresql://users_db:5432/byk?user=byk --password=01234 update
  ```

## Licence

See licence [here](LICENCE.md).
