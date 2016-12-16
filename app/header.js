const React = require("react");

class Header extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<header className="main-header color-line-bg">
				<a href="https://ideal-postcodes.co.uk" className="logo">
					<span className="logo-mini"><img src="/logo.png" className="logo-image" alt="Status"></img></span>
					<span className="logo-lg">Ideal Postcodes</span>
				</a>
				<nav className="navbar navbar-static-top color-line" role="navigation">
					<a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
						<span className="sr-only">Toggle navigation</span>
					</a>
				</nav>
			</header>
		);
	}
}

module.exports = Header;