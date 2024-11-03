export function findShortestPath(firstUrl, lastUrl, maxDepth, fetchSync) {
	if (firstUrl === lastUrl) return [firstUrl];
	if (maxDepth < 1) return null;

	const queue = [[firstUrl, [firstUrl], 0]];
	const visited = new Set([firstUrl]);

	while (queue.length > 0) {
		const [currentUrl, path, depth] = queue.shift();

		if (depth >= maxDepth) continue;

		// Получаем HTML-контент страницы
		const htmlContent = fetchSync(currentUrl);
		if (!htmlContent) continue;

		// Извлекаем все ссылки <a href="..."> с помощью регулярного выражения
		const links = [...htmlContent.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>/gi)].map(match => match[1]);

		for (const link of links) {
			if (!visited.has(link)) {
				const newPath = [...path, link];

				// Если нашли целевой URL
				if (link === lastUrl) {
					return newPath;
				}

				// Добавляем в очередь и отмечаем как посещённый
				queue.push([link, newPath, depth + 1]);
				visited.add(link);
			}
		}
	}

	// Если путь не найден
	return null;
}

// Пример использования
const test1 = findShortestPath("a.com", "c.com", 2, fetchSync);
const test2 = findShortestPath("a.com", "c.com", 1, fetchSync);

console.log(test1); // Ожидается ["a.com", "b.com", "c.com"]
console.log(test2); // Ожидается null
