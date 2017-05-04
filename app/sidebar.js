const _ = require("lodash");
const React = require("react");
const PropTypes = require("prop-types");

class Sidebar extends React.Component {
	constructor() {
		super();
	}

	handleClick(e) {
		e.preventDefault();
		const key = e.target.getAttribute("value") || null;
		this.props.setFocus(key);
	}

	render() {
		const services = _.toArray(this.props.monitors)
			.sort((a, b) => a.friendly_name.localeCompare(b.friendly_name))
			.map(m => {
				return (
					<li key={m.friendly_name}>
						<a href="#" onClick={this.handleClick.bind(this)} value={m.key}>{m.friendly_name}</a>
					</li>
				);
			});

		return (
			<aside className="main-sidebar">
				<section className="sidebar">
					<ul className="sidebar-menu">
						<li className="active treeview">
							<a href="#">
								<i className="fa fa-dashboard"></i> <span>Services</span> <i className="fa fa-angle-left pull-right"></i>
							</a>
							<ul className="treeview-menu">
								{services}
								<li>
									<a onClick={this.handleClick.bind(this)} href="#">All Services</a>
								</li>
							</ul>
						</li>
						<li className="active treeview">
							<a href="#">
								<i className="fa fa-life-ring"></i> <span>Support</span> <i className="fa fa-angle-left pull-right"></i>
							</a>
							<ul className="treeview-menu">
								<li><a href="https://chat.ideal-postcodes.co.uk/" target="_blank"><i className="fa fa-commenting-o"></i> Developer Chat</a></li>
								<li><a href="mailto:support@ideal-postcodes.co.uk"><i className="fa fa-envelope-o"></i> Email</a></li>
								<li><a href="tel:+4408458620898"><i className="fa fa-phone"></i> 0845 862 0898</a></li>
								<li><a href="https://twitter.com/idealpostcodes" target="_blank"><i className="fa fa-twitter"></i> Twitter</a></li>
								<li><a href="https://github.com/ideal-postcodes/ideal_postcodes_status_page" target="_blank"><i className="fa fa-github"></i> Github</a></li>
							</ul>
						</li>
					</ul>
				</section>
			</aside>
		);
	}
}

Sidebar.propTypes = {
	monitors: PropTypes.object.isRequired,
	setFocus: PropTypes.func.isRequired
};

module.exports = Sidebar;
