const _ = require("lodash");
const $ = require("jquery");
const React = require("react");
const PropTypes = require("prop-types");
const Incidents = require("./incidents");
const CurrentStatus = require("./current_status");
const HistoricalLatency = require("./historical_latency");
const HistoricalAvailability = require("./historical_availability");
const Header = require("./header");
const Footer = require("./footer");
const Sidebar = require("./sidebar");

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.uptimeRobotUrl = "https://api.uptimerobot.com/v2/getMonitors";
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
		return visible ? visible : this.state.probes;
	}

	componentDidMount() {
		// $.AdminLTE.layout.fix();
		_.toArray(this.state.probes).forEach(probe => {
			const key = probe.uptimeRobotKey;
			const name = probe.name;
			this.retrieveMonitorData(key, (data, error) => {
				const probes = this.state.probes;
				probes[name].uptimeRobotMonitor = data.monitors[0];
				this.setState({ probes: probes });
			});
		});
	}

	setFocus(name) {
		this.setState({ focus: name });
	}

	retrieveMonitorData(key, callback) {
		return $.post(this.uptimeRobotUrl, {
			api_key: key,
			response_times: 1,
			response_times_average: 30,
			custom_uptime_ratios: "1-7-30-180-365"
		}, callback);
	}

	render() {
		const visibleProbes = this.visibleProbes();
		return (
		<div>
			<Header />
			<Sidebar probes={this.state.probes} setFocus={this.setFocus.bind(this)} />
			<div className="content-wrapper">
				<section className="content-header">
					<h1>Service Dashboard</h1>
				</section>
				<section className="content">		
					<div>
						<div className="row">
							<CurrentStatus probes={visibleProbes} />
						</div>
						<div className="row">
							<div className="col-md-5 col-xs-12">
								<Incidents />
							</div>
							<div className="col-md-7 col-xs-12">
								<HistoricalAvailability probes={visibleProbes} />
							</div>
							<div className="col-md-5 col-xs-12"></div>
							<div className="col-md-7 col-xs-12">
								<HistoricalLatency probes={visibleProbes} />
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
