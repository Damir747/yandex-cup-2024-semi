type OldMap = Array<string | OldMap>;

type ConvertMap<T extends OldMap> =
	T extends [infer First, ...infer Rest]
	? First extends OldMap
	? { [K in First[number]as K extends OldMap ? never : K]: ConvertMap<Extract<First[number], OldMap>> } & ConvertMap<Rest>
	: { [K in First]: unknown } & ConvertMap<Rest>
	: {};

// Пример использования:
// type NewMap = ConvertMap<[['a', ['q'], [[]]], 'f', ['coins']]>;
