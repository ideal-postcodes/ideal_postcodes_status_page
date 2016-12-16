/* Status Page Configuration
 *
 * Add uptime robot probe keys and incident history
 */

/*
 * Uptime Robot
 *
 * An array of probe objects:
 * - probe.name : (string) name of probe to appear on page
 * - probe.key : (string) uptime robot public key for that probe
 */ 

const uptimeRobotProbeKeys = [
	{ 
		name: "Ideal Postcodes Website", 
		key: "m777011319-50e867b3e0d731334b2516ad"
	}, 
	{ 
		name: "Ideal Postcodes Feed", 
		key: "m777011323-da2edb69ab86d8d0547f9d6f"
	}, 
	{ 
		name: "Ideal Postcodes API", 
		key: "m777011318-9d09d66bb432697a9d2df4c6"
	},
	{ 
		name: "Postcodes.io", 
		key: "m777011321-048e6a4cbfe089689bd986ae"
	}
];

/*
 * Incident Log History
 *
 * Update your incident history here by adding an entry to the incident history
 * - Key: "YYYY-MM-D[D]" the year-month-date of the incident to report
 * - Entry: HTML markup detailing the incident details
 */ 

const incidentHistory = {
	"2010-11-9": `
		<h4>Alert</h4>
		<p>Something happened!</p>
	`,
	"2010-11-10": `
		<h4>Alert</h4>
		<p>Something happened again!</p>
	`
};

module.exports = {
	incidentHistory: incidentHistory,
	keys: uptimeRobotProbeKeys
};
