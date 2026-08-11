const { spawnSync } = require("node:child_process");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCommand, ["audit", "--json"], {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});

let report;
try {
  report = JSON.parse(result.stdout || "{}");
} catch (error) {
  console.error("Could not parse npm audit JSON output.");
  console.error(result.stdout || result.stderr || error.message);
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities || {};
const findings = Object.entries(vulnerabilities)
  .filter(([, data]) => ["high", "critical"].includes(data.severity))
  .map(([name, data]) => ({
    name,
    severity: data.severity,
    direct: Boolean(data.isDirect),
    range: data.range,
    fixAvailable: data.fixAvailable,
    via: (data.via || []).map((entry) => typeof entry === "string" ? entry : {
      source: entry.source,
      title: entry.title,
      url: entry.url,
      range: entry.range,
      severity: entry.severity,
    }),
  }));

if (findings.length) {
  console.error("High/critical npm audit findings:");
  console.error(JSON.stringify(findings, null, 2));

  if (findings.every((finding) => finding.fixAvailable)) {
    const fix = spawnSync(npmCommand, ["audit", "fix", "--package-lock-only", "--ignore-scripts"], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    if (!fix.error) {
      const diff = spawnSync("git", ["diff", "--", "package-lock.json"], {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
      });
      if (diff.stdout.trim()) {
        console.error("Registry-generated package-lock remediation:\n");
        console.error(diff.stdout.trim());
      }
    }
  }

  process.exit(1);
}

const metadata = report.metadata?.vulnerabilities || {};
console.log(`✓ npm audit: ${metadata.high || 0} high, ${metadata.critical || 0} critical vulnerabilities`);
