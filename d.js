function solution() {
	const api = {
		context: [],
		contextStack: [],

		root(selector) {
			this.context = Array.from(document.querySelectorAll(selector));
			this.contextStack.push(this.context);
			return this;
		},

		append(tag, attrs = {}) {
			this.context.forEach(el => {
				const newElement = document.createElement(tag);
				for (let key in attrs) {
					if (key === 'content') {
						newElement.textContent = attrs[key];
					} else {
						newElement.setAttribute(key, attrs[key]);
					}
				}
				el.appendChild(newElement);
			});
			return this;
		},

		appendMany(count, tag, attrs) {
			this.context.forEach(el => {
				for (let i = 0; i < count; i++) {
					const newElement = document.createElement(tag);
					const attributes = typeof attrs === 'function' ? attrs(i) : attrs;
					for (let key in attributes) {
						if (key === 'content') {
							newElement.textContent = attributes[key];
						} else {
							newElement.setAttribute(key, attributes[key]);
						}
					}
					el.appendChild(newElement);
				}
			});
			return this;
		},

		css(property, value) {
			if (typeof property === 'string') {
				this.context.forEach(el => {
					el.style[property] = value;
				});
			} else if (typeof property === 'object') {
				this.context.forEach(el => {
					for (let key in property) {
						el.style[key] = property[key];
					}
				});
			}
			return this;
		},

		children(selector) {
			this.context = this.context.flatMap(el =>
				selector ? Array.from(el.children).filter(child => child.matches(selector)) : Array.from(el.children)
			);
			this.contextStack.push(this.context);
			return this;
		},

		select(selector) {
			this.context = this.context.flatMap(el => Array.from(el.querySelectorAll(selector)));
			this.contextStack.push(this.context);
			return this;
		},

		previousContext(steps = 1) {
			if (steps > 0 && this.contextStack.length > steps) {
				this.contextStack = this.contextStack.slice(0, -steps);
				this.context = this.contextStack[this.contextStack.length - 1];
			}
			return this;
		},

		remove(selector) {
			this.context.forEach(el => {
				if (selector) {
					const toRemove = el.querySelectorAll(selector);
					toRemove.forEach(child => child.remove());
				} else {
					el.remove();
				}
			});
			return this;
		},

		commit() {
			// Блокируем дальнейшие вызовы
			return null; // или undefined
		}
	};

	return api;
}
