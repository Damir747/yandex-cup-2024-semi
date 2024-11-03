function solution() {
	class BuilderApi {
		constructor() {
			this.context = [];
			this.history = []; // Хранит историю контекстов для previousContext
		}

		root(selector) {
			this.context = Array.from(document.querySelectorAll(selector));
			this.history.push(this.context);
			return this;
		}

		append(tag, attrs = {}) {
			const newElements = [];
			this.context.forEach(el => {
				const newEl = document.createElement(tag);
				for (const [key, value] of Object.entries(attrs)) {
					if (key === 'content') {
						newEl.textContent = value;
					} else {
						newEl.setAttribute(key, value);
					}
				}
				el.appendChild(newEl);
				newElements.push(newEl);
			});
			this.context = newElements; // Обновляем контекст на созданные элементы
			return this;
		}

		appendMany(count, tag, attrs) {
			const newElements = [];
			this.context.forEach(el => {
				for (let i = 0; i < count; i++) {
					const newAttrs = typeof attrs === 'function' ? attrs(i) : attrs;
					const newEl = document.createElement(tag);
					for (const [key, value] of Object.entries(newAttrs)) {
						if (key === 'content') {
							newEl.textContent = value;
						} else {
							newEl.setAttribute(key, value);
						}
					}
					el.appendChild(newEl);
					newElements.push(newEl);
				}
			});
			this.context = newElements; // Обновляем контекст на созданные элементы
			return this;
		}

		css(styles) {
			this.context.forEach(el => {
				for (const [key, value] of Object.entries(styles)) {
					el.style[key] = value;
				}
			});
			return this;
		}

		children(selector) {
			this.context = this.context.flatMap(el => Array.from(el.children));
			if (selector) {
				this.context = this.context.filter(el => el.matches(selector));
			}
			return this;
		}

		select(selector) {
			this.context = this.context.flatMap(el => Array.from(el.querySelectorAll(selector)));
			return this;
		}

		previousContext(steps = 1) {
			if (steps > 0 && steps <= this.history.length - 1) {
				this.context = this.history[this.history.length - 1 - steps];
			} else if (steps >= this.history.length) {
				this.context = this.history[0]; // Установить на самый первый контекст
			}
			return this;
		}

		remove(selector) {
			this.context.forEach(el => {
				const elementsToRemove = selector ? el.querySelectorAll(selector) : el.children;
				elementsToRemove.forEach(child => child.remove());
			});
			return this;
		}

		commit() {
			this.context = []; // Сбросить контекст после выполнения
			return this;
		}
	}

	return new BuilderApi(); // Возвращаем экземпляр класса
}
