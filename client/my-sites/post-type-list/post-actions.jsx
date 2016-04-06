/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getPost } from 'state/posts/selectors';
import { deletePost } from 'state/posts/actions';
import localize from 'lib/mixins/i18n/localize';
import Button from 'components/button';
import Gridicon from 'components/gridicon';

function PostTypeListPostActions( { translate, trash, post } ) {
	let actions;
	if ( post ) {
		actions = [
			<Button key="trash" onClick={ () => trash( post.site_ID, post.ID ) } borderless>
				<Gridicon icon="trash" />
				<span className="screen-reader-text">
					{ translate( 'Trash' ) }
				</span>
			</Button>,
			<Button key="view" href={ post.URL } target="_blank" borderless>
				<Gridicon icon="external" />
				<span className="screen-reader-text">
					{ translate( 'View' ) }
				</span>
			</Button>
		];
	}

	return (
		<div className="post-type-list__post-actions">
			{ actions }
		</div>
	);
}

PostTypeListPostActions.propTypes = {
	globalId: PropTypes.string,
	translate: PropTypes.func,
	trash: PropTypes.func,
	post: PropTypes.object
};

export default connect(
	( state, ownProps ) => {
		return {
			post: getPost( state, ownProps.globalId )
		};
	},
	{
		trash: deletePost
	}
)( localize( PostTypeListPostActions ) );
