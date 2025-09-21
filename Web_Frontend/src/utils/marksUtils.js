export const calculateNormalDistribution = (percentages) => {
  if (!percentages || percentages.length === 0) return { data: [], mean: 0 };

  const mean = percentages.reduce((a, b) => a + b, 0) / percentages.length;
  const variance =
    percentages.reduce((a, b) => a + (b - mean) ** 2, 0) / percentages.length;
  const stdDev = Math.sqrt(variance);

  const normalPDF = (x, mean, stdDev) =>
    (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mean) / stdDev) ** 2);

  const data = Array.from({ length: 51 }, (_, i) => {
    const x = i * 2;
    return { x, y: normalPDF(x, mean, stdDev) };
  });

  return { data, mean };
};


export const transformAndSortMarks = (students, sortConfig) => {
  const base = students.map((s, idx) => ({
    name: s.name ?? "Unknown",
    roll: s.roll ?? idx + 1,
    marks: s.marks ?? 0,
    total: s.total ?? 1, // avoid divide by zero
    percentage: s.total ? (s.marks / s.total) * 100 : 0,
  }));

  const ranked = base
    .sort((a, b) => b.marks - a.marks)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  return ranked.sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === "roll") {
      return sortConfig.direction === "asc"
        ? a.roll - b.roll
        : b.roll - a.roll;
    } else if (sortConfig.key === "rank") {
      return sortConfig.direction === "asc"
        ? a.rank - b.rank
        : b.rank - a.rank;
    }
    return 0;
  });
};
