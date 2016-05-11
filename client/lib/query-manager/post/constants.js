export const DEFAULT_POST_QUERY = {
	context: 'display',
	order: 'DESC',
	order_by: 'date',
	type: 'post',
	status: 'publish',
	sticky: 'include',
	search: ''
};

export const IGNORED_QUERY_ARGS = [
	'http_envelope',
	'pretty',
	'number',
	'offset',
	'page'
];
