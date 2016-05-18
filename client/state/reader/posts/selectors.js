/**
 * Returns a single post.
 *
 * @param  {Object}  state  Global state tree
 * @param  {String}  postGlobalId Post global ID
 * @return {Object} Post
 */
export function getPost( state, postGlobalId ) {
	return state.reader.posts.items[ postGlobalId ];
}
