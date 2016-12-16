const React = require("react");

class Footer extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<footer className="main-footer">
				<div className="pull-right hidden-xs">
					<b>IDDQD</b> Ltd
				</div>
				<strong>&copy; 2016 <a href="https://ideal-postcodes.co.uk">Ideal Postcodes</a></strong>
			</footer>
		);
	}
}

module.exports = Footer;
