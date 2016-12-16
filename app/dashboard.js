const _ = require("lodash");
const $ = require("jquery");
const React = require("react");
const Incidents = require("./incidents");
const CurrentStatus = require("./current_status");
const HistoricalLatency = require("./historical_latency");
const HistoricalAvailability = require("./historical_availability");
const Header = require("./header");
const Footer = require("./footer");
const Sidebar = require("./sidebar");

class Dashboard extends React.Component {
	constructor() {
		super();
		this.state = {
			monitors: {},
			focus: null
		};
	}

	visibleMonitors() {
		const result = {};
		const visible = _.toArray(this.state.monitors)
			.filter(m => m.key === this.state.focus);

		if (visible.length === 0) return this.state.monitors;

		visible.forEach(e => {
			result[e.key] = e;
		});

		return result;
	}

	componentDidMount() {
		// $.AdminLTE.layout.fix();
		this.props.keys.forEach(mon => {
			let key = mon.key
			this.retrieveMonitorData(key, (data, error) => {
				const monitors = this.state.monitors;
				monitors[key] = data.monitors.monitor[0];
				monitors[key].key = key;
				this.setState({ monitors: monitors });
			});
		});
	}

	setFocus(key) {
		this.setState({ focus: key });
	}

	monitorUrl() {
		return "https://api.uptimerobot.com/getMonitors";
	}

	retrieveMonitorData(key, callback) {
		return $.getJSON(this.monitorUrl(), {
			apiKey: key,
			format: "json",
			noJsonCallback: 1,
			responseTimes: 1,
			responseTimesAverage: 30,
			"customUptimeRatio": "1-7-30-180-365"
		}, callback);
	}

	render() {
		return (
		<div>
			<Header />
			<Sidebar monitors={this.state.monitors} setFocus={this.setFocus.bind(this)} />
			<div className="content-wrapper">
				<section className="content-header">
					<h1>Service Dashboard</h1>
				</section>
				<section className="content">		
					<div>
						<div className="row">
							<CurrentStatus monitors={this.visibleMonitors()} />
						</div>
						<div className="row">
							<div className="col-md-5 col-xs-12">
								<Incidents />
							</div>
							<div className="col-md-7 col-xs-12">
								<HistoricalAvailability monitors={this.visibleMonitors()} />
							</div>
							<div className="col-md-5 col-xs-12"></div>
							<div className="col-md-7 col-xs-12">
								<HistoricalLatency monitors={this.visibleMonitors()} />
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
	keys: React.PropTypes.array.isRequired
};

module.exports = Dashboard;
