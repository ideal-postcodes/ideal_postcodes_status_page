// See http://brunch.io for documentation.
module.exports = {
	files: {
	  javascripts: { joinTo: "app.js" },
	  stylesheets: { joinTo: "app.css" },
	  templates: { joinTo: "app.js" }
	},

	npm: {
    enabled: true,
    whitelist: [
      "react",
      "prop-types",
      "jquery",
      "lodash",
      "chart.js",
      "react-dom"
    ],
    styles: {
      "font-awesome": ["css/font-awesome.min.css"],
      "ionicons": ["css/ionicons.min.css"]
    },
    globals: { }
  },
  plugins: {
    babel: {
      presets: ["es2015", "react"]
    },
    copycat: {
      "fonts" : ["node_modules/font-awesome/fonts/", "node_modules/ionicons/fonts/"]
    }
  }
};
