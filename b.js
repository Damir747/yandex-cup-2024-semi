const makePreparation = (artefactAgesHistogram, periodDuration) => {
	// Подсчитываем общее количество артефактов и их возраст
	const artefactsCount = artefactAgesHistogram.reduce((sum, count) => sum + count, 0);
	return {
		artefactsCount,
		maxDuration: periodDuration,
	};
};

const seekPeriodIndicies = (analyseArtefact, startIndex, options) => {
	const artefactsCount = options.artefactsCount;
	const maxDuration = options.maxDuration;

	// Массив для хранения результатов анализа
	const results = [];
	let endIndex = startIndex;

	// Получаем начальный возраст для первого артефакта
	if (startIndex < artefactsCount) {
		const firstArtefact = analyseArtefact(startIndex);
		let startAge = firstArtefact.start;

		let actualDuration = 0;

		// Обрабатываем артефакты, пока не достигнем конца
		while (endIndex < artefactsCount) {
			const currentArtefact = analyseArtefact(endIndex);
			actualDuration = currentArtefact.end - startAge;

			if (actualDuration > maxDuration) {
				break; // Выходим, если превысили максимальную длительность
			}
			endIndex++;
		}

		endIndex--; // Возвращаемся на один шаг назад, чтобы соответствовать длительности
		actualDuration = analyseArtefact(endIndex).end - startAge;

		return [startIndex, endIndex, actualDuration];
	}

	return [startIndex, startIndex, 0]; // Если нет артефактов
};

module.exports = {
	makePreparation,
	seekPeriodIndicies
};
