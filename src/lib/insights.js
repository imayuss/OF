/**
 * Watchlist "AI Application Insight" — pure computation, rendered as JSX by <Watchlist/>.
 * (Previously built as an HTML string and injected with innerHTML.)
 */
const DOMAIN_ADVICE = {
  ai: { tools: 'PyTorch, TensorFlow, Hugging Face, or scikit-learn', action: 'contribute to model training pipelines or evaluation utilities' },
  data: { tools: 'Pandas, Apache Spark, DuckDB, or dbt', action: 'look for data pipeline, ETL, or visualisation issues' },
  science: { tools: 'NumPy, SciPy, Astropy, or ROOT', action: 'explore numerical computation or simulation-related tickets' },
  security: { tools: 'Metasploit, Wireshark, OpenSSL, or OWASP tooling', action: 'hunt for documentation or testing improvements in security repos' },
  infra: { tools: 'Kubernetes, Terraform, Prometheus, or Ansible', action: 'target CI/CD configuration, observability, or deployment issues' },
  web: { tools: 'React, Vue, Svelte, or Node.js ecosystem libraries', action: 'focus on accessibility fixes, UI components, or API improvements' },
  programming: { tools: 'LLVM, GCC, rustc, or language toolchain packages', action: 'dive into compiler warnings, test coverage, or RFC implementations' },
  os: { tools: 'Linux kernel toolchain, QEMU, or POSIX libraries', action: 'start with documentation, porting, or driver-level good-first issues' },
  dev: { tools: 'LSP plugins, tree-sitter grammars, or CLI tooling', action: 'pick up linter rules, editor extensions, or test-suite tasks' },
  media: { tools: 'FFmpeg, GStreamer, VLC plugin SDK, or libav', action: 'explore codec, subtitle, or format compatibility tickets' },
  other: { tools: "the project's primary language ecosystem", action: 'read the CONTRIBUTING guide and tackle labelled good-first issues' },
};

const CAT_LABELS = {
  ai: 'AI / ML', data: 'Data Science', science: 'Scientific Computing',
  security: 'Security', infra: 'Infrastructure', web: 'Web Development',
  programming: 'Programming Languages', os: 'OS / Systems', dev: 'Dev Tools',
  media: 'Media / Multimedia', other: 'Open Source',
};

export function computeWatchlistInsight(bookmarks) {
  if (!bookmarks.length) return null;

  const catCount = {};
  bookmarks.forEach((o) => { catCount[o.cat] = (catCount[o.cat] || 0) + 1; });
  const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'other';

  const tagCount = {};
  bookmarks.flatMap((o) => o.tags || []).forEach((t) => {
    const key = t.toLowerCase().trim();
    tagCount[key] = (tagCount[key] || 0) + 1;
  });
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);

  const compCount = { hot: 0, moderate: 0, chill: 0 };
  bookmarks.forEach((o) => { if (compCount[o.competition] !== undefined) compCount[o.competition]++; });
  const highComp = compCount.hot >= bookmarks.length * 0.5;
  const lowComp = compCount.chill >= bookmarks.length * 0.5;

  return {
    count: bookmarks.length,
    topTags,
    advice: DOMAIN_ADVICE[topCat] || DOMAIN_ADVICE.other,
    catLabel: CAT_LABELS[topCat] || 'Open Source',
    strategy: highComp ? 'high' : lowComp ? 'low' : 'balanced',
  };
}
