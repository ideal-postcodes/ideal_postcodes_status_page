const _ = require("lodash");
const $ = require("jquery");
const React = require("react");
const PropTypes = require("prop-types");
const Incidents = require("./incidents");
const CurrentStatus = require("./current_status");
const LatencyBreakdown = require("./latency_breakdown");
const HistoricalLatency = require("./historical_latency");
const HistoricalAvailability = require("./historical_availability");
const Header = require("./header");
const Footer = require("./footer");
const Sidebar = require("./sidebar");

const yesterday = () => new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.uptimeRobotUrl = "https://api.uptimerobot.com/v2/getMonitors";
		this.updownUrl = "https://updown.io/api/checks";
		const probes = props.probes.reduce((acc, probe) => {
			acc[probe.name] = probe;
			return acc;
		}, {});
		this.state = {
			probes: probes,
			focus: null
		};
	}

	visibleProbes() {
		const visible = this.state.probes[this.state.focus];
		if (!visible) return this.state.probes;
		const result = {};
		result[visible.name] = visible;
		return result;
	}

	componentDidMount() {
		// $.AdminLTE.layout.fix();
		_.toArray(this.state.probes).forEach(probe => {
			this.refreshData(probe);
		});
	}

	setFocus(name) {
		this.setState({ focus: name });
	}

	refreshData(probe) {
		const name = probe.name;

		this.retrieveUptimeRobotData(probe, (data, error) => {
			const probes = this.state.probes;
			if (!data) return;
			probes[name].uptimeRobotMonitor = data.monitors[0];
			this.setState({ probes: probes });
		});

		this.retrieveUpdownProbe(probe, (data, error) => {
			const probes = this.state.probes;
			if (!data) return;
			probes[name].updownMonitor = data;
			this.setState({ probes: probes });
		});

		this.retrieveUpdownMetrics(probe, (data, error) => {
			const probes = this.state.probes;
			if (!data) return;
			probes[name].updownMetrics = data;
			this.setState({ probes: probes });
		});
	}

	retrieveUptimeRobotData(probe, callback) {
		const uptimeRobotKey = probe.uptimeRobotKey;
		if (!uptimeRobotKey) return callback(null, null);
		return $.post(this.uptimeRobotUrl, {
			api_key: probe.uptimeRobotKey,
			response_times: 1,
			response_times_average: 30,
			custom_uptime_ratios: "1-7-30-180-365"
		}, callback);
	}

	retrieveUpdownProbe(probe, callback) {
		const updownKey = probe.updownKey;
		const updownToken = probe.updownToken;
		if (!updownKey || !updownToken) return callback(null, null);
		return $.get(`${this.updownUrl}/${updownToken}`, {
			"api-key": updownKey,
			"group": "host"
		}, callback);
	}

	retrieveUpdownMetrics(probe, callback) {
		const updownKey = probe.updownKey;
		const updownToken = probe.updownToken;
		if (!updownKey || !updownToken) return callback(null, null);
		return $.get(`${this.updownUrl}/${updownToken}/metrics`, {
			"api-key": updownKey,
			from: yesterday().toUTCString(), 
			to: (new Date()).toUTCString(),
			"group": "host"
		}, callback);
	}

	render() {
		const visibleProbes = this.visibleProbes();
		return (
		<div>
			<Header />
			<Sidebar probes={this.state.probes} setFocus={this.setFocus.bind(this)} />
			<div className="content-wrapper">
				<section className="content">		
					<div>
						<div className="row">
							<CurrentStatus probes={visibleProbes} />
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-5 col-sm-12 col-xs-12">
								<Incidents />
							</div>
							<div className="col-lg-8 col-md-7 col-sm-12 col-xs-12">
								<div className="row">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<HistoricalAvailability probes={visibleProbes} />
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<LatencyBreakdown probes={visibleProbes} />
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<HistoricalLatency probes={visibleProbes} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			<Footer />
		</div>
		);
	}
};

Dashboard.propTypes = {
	probes: PropTypes.array.isRequired
};

module.exports = Dashboard;
