module.exports = {
	collectCoverage: true,
	coverageDirectory: "coverage",
	testEnvironment: "node",
	timeout: 30000,
	testTimeoutMillis: 30000,
	transform: {
		"^.+\\.mjs$": "babel-jest",
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"], // Include only TypeScript extensions if you're using them.
};
