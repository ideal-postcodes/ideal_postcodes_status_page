// Load admin library first as this needs to bind to jQuery
require("./bootstrap");
require("./slimscroll");
require("./admin");

const React = require("react");
const ReactDOM = require("react-dom");
const Dashboard = require("./dashboard");
const probes = require("./config").probes;

document.addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Dashboard probes={probes}/>, document.getElementById("root"));
});
