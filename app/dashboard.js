const _ = require("lodash");
const $ = require("jquery");
const React = require("react");
const PropTypes = require("prop-types");
const Incidents = require("./incidents");
const CurrentStatus = require("./current_status");
const LatencyBreakdown = require("./latency_breakdown");
const DailyUpdateChart = require("./daily_update_chart");
const HistoricalLatency = require("./historical_latency");
const HistoricalAvailability = require("./historical_availability");
const Header = require("./header");
const Footer = require("./footer");
const Sidebar = require("./sidebar");
const unhandledError = "Internal Server Error";
const yesterday = () => new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.uptimeRobotUrl = "https://api.uptimerobot.com/v2/getMonitors";
		this.updownUrl = "https://updown.io/api/checks";
		this.pafUpdateUrl = "https://meta.ideal-postcodes.co.uk/paf/updates";
		this.timeToTimeout = 10000,
		this.state = {
			pafData: {},
			focus: null,
			probes: props.probes.reduce((acc, probe) => {
				acc[probe.name] = probe;
				return acc;
			}, {})
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
		this.refreshData();
	}

	setFocus(name) {
		this.setState({ focus: name });
	}

	refreshData() {
		this.updatePafData();
		_.toArray(this.state.probes).forEach(probe => {
			this.updateUptimeRobotData(probe);
			this.updateUpdownProbe(probe);
			this.updateUpdownMetrics(probe);
		});
	}
	
	retrievePafData(callback) {
		$.get({
			url : this.pafUpdateUrl, 
			timeout: this.timeToTimeout
		})
			.done(data => callback(null, data))
			.fail((_, __, errorThrown) => callback(errorThrown || unhandledError, null));
	}
	
	updatePafData() {
		this.retrievePafData((error, data) => {
			if (error) {
				this.setState({
					pafData: {
						error: error
					}
				}); 
				return;
			}
			this.setState({ pafData: data });
		});
	}
	
	retrieveUptimeRobotData(probe, callback) {
		const uptimeRobotKey = probe.uptimeRobotKey;
		if (!uptimeRobotKey) return callback(null, null);
		return $.post({
			url: this.uptimeRobotUrl, 
			data: {
				api_key: probe.uptimeRobotKey,
				response_times: 1,
				response_times_average: 30,
				custom_uptime_ratios: "1-7-30-180-365"
			},
			timeout: this.timeToTimeout
		})
			.done(data => callback(null, data))
			.fail((_, __, errorThrown) => callback(errorThrown || unhandledError, null));
	}
	
	updateUptimeRobotData(probe) {
		this.retrieveUptimeRobotData(probe, (error, data) => {
			if (error) {
				this.setState({
					probes: {
						probe: {
							error: error
						}
					}
				});
				return;
			}
			if (!data) return;
			const probes = this.state.probes;
			probes[probe.name].uptimeRobotMonitor = data.monitors[0];
			this.setState({ probes: probes });
		});
	}
	
	retrieveUpdownProbe(probe, callback) {
		const updownKey = probe.updownKey;
		const updownToken = probe.updownToken;
		if (!updownKey || !updownToken) return callback(null, null);
		return $.get({
			url: `${this.updownUrl}/${updownToken}`,
			data: {
				"api-key": updownKey,
				"group": "host"
			},
			timeout: this.timeToTimeout
		})
			.done(data => callback(null, data))
			.fail((_, __, errorThrown) => callback(errorThrown || unhandledError), null);
	}
	
	updateUpdownProbe(probe) {
		this.retrieveUpdownProbe(probe, (error, data) => {
			const probes = this.state.probes;
			if (error) {
				this.state({
					probes: {
						probe: {
							error: error
						}
					}
				});
			}
			probes[probe.name].updownMonitor = data;
			this.setState({ probes: probes });
		});
	}

	retrieveUpdownMetrics(probe, callback) {
		const updownKey = probe.updownKey;
		const updownToken = probe.updownToken;
		if (!updownKey || !updownToken) return callback(null, null);
		return $.get({
			url: `${this.updownUrl}/${updownToken}/metrics`,
			data: {
				"api-key": updownKey,
				from: yesterday().toUTCString(), 
				to: (new Date()).toUTCString(),
				"group": "host"
			},
			timeout: this.timeToTimeout
		})
			.done(data => callback(null, data))
			.fail((_, __, errorThrown) => callback(errorThrown || unhandledError, null));
	}
	

	updateUpdownMetrics(probe) {
		this.retrieveUpdownMetrics(probe, (error, data) => {
			if (error) {
				this.state({
					probes: {
						probe: {
							error: error
						}
					}
				});
			}
			const probes = this.state.probes;
			if (!data) return;
			probes[probe.name].updownMetrics = data;
			this.setState({ probes: probes });
		});
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
											<DailyUpdateChart pafData={this.state.pafData} updatePafData={this.updatePafData.bind(this)}/>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<LatencyBreakdown probes={visibleProbes} refreshUpdownMetrics={this.updateUpdownMetrics.bind(this)}/>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<HistoricalLatency probes={visibleProbes} refreshUptimeData={this.updateUptimeRobotData.bind(this)}/>
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
}

Dashboard.propTypes = {
	probes: PropTypes.array.isRequired
};

module.exports = Dashboard;
