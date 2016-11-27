# HealthCare Guys Extension

Home page: http://dmitriykozyatinskiy.github.io/Pokedex/

## Installation guide:
1. Install [Node](https://nodejs.org/en/download/)
2. Install webpack: `npm install webpack -g`
3. Install dependencies: `npm install`
4. Run build: `webpack`
5. The built extension is inside the `extension` folder, you should use it

*!!!Important:* when you are going to publish the extension to Google store, generate ZIP using `npm run build-production` command.
It will generate `healthcareguys.zip` file in the project root folder.
Don't create ZIP manually, because the extension won't get minified!

Before making changes to the extension, you can run `node dev-server`.
This command runs a development server which observe any changes you do and update the extension on flight.
Otherwise, you need to run `webpack` command to rebuild the extension every time you make any changes.

Available commands:
- `webpack` - build development version of the extension
- `npm run build-production` - generate production zip archive
- `node dev-server` - run a development server which will observe all your code changes and rebuild automatically
