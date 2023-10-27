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


## Licence

See licence [here](LICENCE.md).
