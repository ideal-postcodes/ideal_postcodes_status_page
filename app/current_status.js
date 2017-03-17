const _ = require("lodash");
const React = require("react");

class CurrentStatus extends React.Component {
	constructor() {
		super();
	}

	render() {
		const availability = _.toArray(this.props.monitors)
			.sort((a, b) => a.friendly_name.localeCompare(b.friendly_name))
			.map(monitor => {
				if (monitor.status === 2) {
					return <MonitorUp monitor={monitor} key={monitor.id}/>;
				} else if (monitor.status === 8 || monitor.status === 9) {
					return <MonitorDown monitor={monitor} key={monitor.id}/>;
				} else {
					return;
				}
			});
		return (
			<div>
				{availability}
			</div>
		);
	}
}

CurrentStatus.propTypes = {
	monitors: React.PropTypes.object.isRequired
};

class MonitorUp extends React.Component {
	constructor() {
		super();
	}

	render() {
		const monitor = this.props.monitor;
		return (
			<div className="col-lg-3 col-xs-6">
				<div className="small-box bg-green">
					<span className="small-box-footer">{monitor.friendly_name} <i className="fa fa-check"></i></span>
					<div className="inner">
						<h3>Up</h3>
						<p>Service Operational</p>
					</div>
					<div className="icon add-top">
						<i className="ion ion-ios-pulse"></i>
					</div>
				</div>
			</div>
		)
	}
}

MonitorUp.propTypes = {
	monitor: React.PropTypes.object.isRequired
};

class MonitorDown extends React.Component {
	constructor() {
		super();
	}

	render() {
		const monitor = this.props.monitor;
		return (
			<div className="col-lg-3 col-xs-6">
				<div className="small-box bg-yellow">
					<span className="small-box-footer">{monitor.friendly_name} <i className="fa fa-exclamation-circle"></i></span>
					<div className="inner">
						<h3>Down</h3>
						<p>Service Disruption</p>
					</div>
					<div className="icon add-top">
						<i className="ion ion-ios-pulse-strong"></i>
					</div>
				</div>
			</div>
		)
	}
};

MonitorDown.propTypes = {
	monitor: React.PropTypes.object.isRequired
};

module.exports = CurrentStatus;