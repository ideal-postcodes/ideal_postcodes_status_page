// Load admin library first as this needs to bind to jQuery
require("/bootstrap");
require("/slimscroll");
require("/admin");

const React = require("react");
const ReactDOM = require("react-dom");
const Dashboard = require("/dashboard");
const keys = require("/config").keys;

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<Dashboard keys={keys}/>, document.getElementById("root"));
});
