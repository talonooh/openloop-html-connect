# QDOT Sample HTML5 Creative

This is a creative example for HTML5 dynamic campaigns.

It uses the **openloop-html-connect** library and it generates a unique HTML file as the creative with everything self-contained.

# Usage

Run the following.
- `cd examples/creative-example`
- `npm install`
- `npm run build`

The last command will create an index.html on the dist folder: **dist/index.html**.

This html file is completely self contained and it works locally on any browser.

Just open it on a browser like this:

file:///C:/git/openloop-html-connect/examples/sample-creative/dist/index.html?frame_id=123&debug=1

Remember that you can set `frame_id` and `debug` on the query string, as [documented on the library](https://github.com/q-media/openloop-html-connect).

For details please refer to the [source code](src/main.js).
