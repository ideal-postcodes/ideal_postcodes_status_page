const _ = require("lodash");
const React = require("react");
const PropTypes = require("prop-types");

class CurrentStatus extends React.Component {
	constructor(props) {
		super(props);
	}

	isErrored(probe) {
		return !!probe.updownMonitor.error;
	}

	isUninitialized(probe) {
		return probe.updownMonitor === undefined;
	}

	render() {
		const availability = _.toArray(this.props.probes)
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(probe => {
				const monitor = probe.updownMonitor;
				if (this.isUninitialized(probe)) {
					return <MonitorLoading probe={probe} key={probe.name} />;
				} else if (this.isErrored(probe)) {
					return <MonitorError probe={probe} key={probe.name} 
						refresh={this.props.refresh} />;
				} else {
					if (monitor.down) {
						return <MonitorDown probe={probe} key={probe.name}/>;
					} else {
						return <MonitorUp probe={probe} key={probe.name}/>;
					}	
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
	probes: PropTypes.object.isRequired,
	refresh: PropTypes.func.isRequired
};

class MonitorLoading extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const probe = this.props.probe;
		return (
			<div className="col-lg-3 col-xs-6">
				<div className="small-box bg-gray">
					<span className="small-box-footer">{probe.name}</span>
					<div className="inner">
						<h3>&nbsp;</h3>
						<p>Retrieving data...</p>
					</div>
					<div className="icon add-top">
						<i className="ion ion-ios-gear-outline"></i>
					</div>
				</div>
			</div>
		);
	}
}

MonitorLoading.propTypes = {
	probe: PropTypes.object.isRequired
};

class MonitorUp extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const probe = this.props.probe;
		return (
			<div className="col-lg-3 col-xs-6">
				<div className="small-box bg-green">
					<span className="small-box-footer"><i className="fa fa-dot-circle-o"></i> {probe.name}</span>
					<div className="inner">
						<h4>200 OK</h4>
						<p>Service Operational</p>
					</div>
					<div className="icon add-top">
						<i className="ion ion-ios-pulse"></i>
					</div>
				</div>
			</div>
		);
	}
}

MonitorUp.propTypes = {
	probe: PropTypes.object.isRequired
};

class MonitorDown extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const probe = this.props.probe;
		return (
			<div className="col-lg-3 col-xs-6">
				<div className="small-box bg-yellow">
					<span className="small-box-footer"><i className="fa fa-circle-o"></i> {probe.name}</span>
					<div className="inner">
						<h4>Down</h4>
						<p>Service Disruption</p>
					</div>
					<div className="icon add-top">
						<i className="ion ion-ios-pulse-strong"></i>
					</div>
				</div>
			</div>
		);
	}
}

MonitorDown.propTypes = {
	probe: PropTypes.object.isRequired
};

class MonitorError extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const probe = this.props.probe;
		return (
			<div className="col-lg-3 col-xs-6">
				<div className="small-box bg-gray">
					<span className="small-box-footer"><i className="fa fa-circle-o"></i> {probe.name}</span>
					<div className="inner">
						<h4>Loading</h4>
						<p className="text-center">
							Probe taking a while to load? <br />
							<button className="btn btn-xs btn-info" onClick={() => this.props.refresh(probe)}>
								<i className="fa fa-refresh"></i> Try again
							</button>
						</p>
					</div>
					<div className="icon add-top">
						<i className="ion ion-ios-pulse-strong"></i>
					</div>
				</div>
			</div>
		);
	}
}

MonitorError.propTypes = {
	probe: PropTypes.object.isRequired,
	refresh: PropTypes.func.isRequired
};

module.exports = CurrentStatus;
