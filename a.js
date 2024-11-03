const uniqArrayItemGenerator = (array, path = "") => {
	// Для отслеживания уникальных значений и возвращенных индексов
	const uniqueValues = new Map();
	let index = 0;

	// Функция для безопасного извлечения значения по пути
	const getValueByPath = (item, path) => {
		const parts = path.split(/\.|\[|\]/).filter(Boolean);
		let value = item;

		try {
			for (let part of parts) {
				// Если часть - функция, вызываем её
				if (part.endsWith("()")) {
					const funcName = part.slice(0, -2);
					value = value[funcName]();
				} else if (!isNaN(part)) {
					// Если часть - число, то это индекс
					value = value[Number(part)];
				} else {
					// Иначе - свойство объекта
					value = value[part];
				}
			}
		} catch (e) {
			value = undefined;
		}
		return value;
	};

	return {
		next: () => {
			while (index < array.length) {
				const item = array[index];
				const value = path ? getValueByPath(item, path) : item;

				// Проверяем уникальность значения
				if (!uniqueValues.has(value)) {
					uniqueValues.set(value, index);
					return { done: false, value: index++ };
				}
				index++;
			}
			// Когда все уникальные значения найдены
			return { done: true, value: [...uniqueValues.values()] };
		}
	};
};

module.exports = uniqArrayItemGenerator;

const deepArray = [
	{ row: { value: 'test' } },
	{ row: { value: 'Test' } },
	{ row: { value: 'test' } },
	{
		row: {
			value: function () {
				return '12345';
			},
		},
	},
	{ row: { value: 'Test' } },
	{ row: { value: 'test 1' } },
	{
		row: {
			value: function () {
				return [1, 2, 3, 4, 5];
			},
		},
	},
	{
		row: {
			value: function () {
				return '12345';
			},
		},
	},
	{ row: { value: [1, 2, 3, 4, 5] } },
];

const { next } = uniqArrayItemGenerator(deepArray, "row.value()[2]");
console.log(next()); // { done: false, value: 0 }
console.log(next()); // { done: false, value: 3 }
console.log(next()); // { done: false, value: 6 }
console.log(next()); // { done: true, value: [0, 3, 6] }
