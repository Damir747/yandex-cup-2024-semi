const makePreparation = (artefactAgesHistogram, periodDuration) => {
	const artefactsCount = artefactAgesHistogram.reduce((sum, count) => sum + count, 0);
	const allArtefactAgeDuration = artefactAgesHistogram.reduce(
		(sum, count, age) => sum + count * age,
		0
	);

	return {
		artefactsCount,
		allArtefactAgeDuration,
		maxDuration: periodDuration,
	};
};

const seekPeriodIndicies = (analyseArtefact, startIndex, options) => {
	const artefactsCount = options.artefactsCount;
	const maxDuration = options.maxDuration;

	// Массив для хранения результатов анализа
	const results = new Array(artefactsCount);
	for (let i = 0; i < artefactsCount; i++) {
		results[i] = analyseArtefact(i);
	}

	let endIndex = startIndex;
	let { start: startAge } = results[startIndex];
	let actualDuration = 0;

	while (endIndex < artefactsCount) {
		const { start, end } = results[endIndex];
		actualDuration = end - startAge;

		if (actualDuration > maxDuration) {
			break; // Ранний выход из цикла
		}
		endIndex++;
	}

	endIndex--; // Возвращаемся на один шаг назад, чтобы соответствовать длительности
	actualDuration = results[endIndex].end - startAge;

	return [startIndex, endIndex, actualDuration];
};

module.exports = {
	makePreparation,
	seekPeriodIndicies
};
