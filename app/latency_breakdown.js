const _ = require("lodash");
const React = require("react");
const PropTypes = require("prop-types");
const Chart = require("chart.js");

class StackedBarChart extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const ctx = this.node.getContext("2d");
		new Chart(ctx, {type: "horizontalBar", data: this.props.data, options: this.props.options || {}});
	}

	render() {
		return <canvas height="100" ref={node => this.node = node} />;
	}
}

class LatencyBreakdown extends React.Component {
	constructor(props) {
		super(props);
		this.hosts = ["gra", "fra", "bhs", "mia"];
		this.timingCategories = [
			"redirect",
			"namelookup",
			"connection",
			"handshake",
			"response"
		];
		this.timingDictionary = {
			redirect: { 
				label: "Redirect"
			},
			namelookup: { 
				label: "DNS Lookup",
				backgroundColor: "rgba(5,50,109,0.3)"
			},
			connection: { 
				label: "Connection",
				backgroundColor: "rgba(0,166,90,0.5)"
			},
			handshake: { 
				label: "SSL Handshake",
				backgroundColor: "rgba(5,50,109,0.7)"
			},
			response: { 
				label: "Server Response",
				backgroundColor: "rgba(0,166,90,1)"
			}
		};
	}
	
	isErrored(probe) {
		return !!probe.updownMetrics.error
	}
	
	isUnitialised (probe) {
		return probe.updownMetrics === undefined
	}
	
	errorMessage(probe) {
		return (
			<div className="box-body" key={probe.name}>
				<p>
					An error occurred when retrieving this data &nbsp;
					<button className="btn btn-xs btn-info" onClick={() => this.props.refresh(probe)}>
						<i className="fa fa-refresh"></i> Try again
					</button>
				</p>
			</div>
		);
	}
	
	chart (probe) {
		const monitor = probe.updownMetrics;
		const zones = this.hosts.map(host => monitor[host]);
		const responseData = {
			labels: zones.map(zone => zone.host.country),
			datasets: this.timingCategories.map(cat => {
				return {
					data: zones.map(zone => zone.timings[cat]),
					label: this.timingDictionary[cat].label,
					backgroundColor: this.timingDictionary[cat].backgroundColor
				};
			})
		};
		const options = {
			animation: {
				duration: 0
			},
			tooltips: {
				enabled: true,
				position: "nearest",
				callbacks: {
					title: () => {}
				}
			},
			title: {
				display: true,
				position: "top",
				text: `${probe.name}, Latency Breakdown (ms)`
			},
			legend: {
				display: false,
				position: "right"
			},
			scales: {
				yAxes: [{
					stacked: true,
					categoryPercentage: 1,
					barPercentage: 0.3,
					ticks: { 
						beginAtZero: true,
						suggestedMax: 8
					},
					gridLines: {
						display: false
					}
				}],
				xAxes: [{ 
					stacked: true
				}]
			}
		};
		return (
			<div className="box-body" key={probe.name}>
				<StackedBarChart data={responseData}
					options={options} />
			</div>
		);
	}
	
	renderSingleChart (probe) {
		if (this.isUnitialised(probe)) {
			return <div className="box-body" key={probe.name}>Loading...</div>
		}
		else if (this.isErrored(probe)) {
			return this.errorMessage(probe);
		}
		else {
			return this.chart(probe);
		}
	}
	
	renderCharts() {
		return _.toArray(this.props.probes)
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(probe => this.renderSingleChart(probe));
	}

	render() {
		return (
			<div className="box box-primary">
				<div className="box-header with-border">
					<h3 className="box-title">Breakdown of End-to-End Latency</h3>
					<p>Latency by connection phase for last 24 hours for European and US probes</p>
					<div className="box-tools pull-right">
						<button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
					</div>
				</div>
				{this.renderCharts()}
				<div className="box-footer clearfix"></div>
			</div>
		);
	}
}

StackedBarChart.propTypes = {
	data: PropTypes.object.isRequired,
	options: PropTypes.object.isRequired
};

LatencyBreakdown.propTypes = {
	refresh: PropTypes.func.isRequired,
	probes: PropTypes.object.isRequired
};

module.exports = LatencyBreakdown;
