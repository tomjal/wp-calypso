/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { CURRENT_USER_ID_SET } from 'state/action-types';
import { createReducer } from 'state/utils';
import { idSchema } from './schema';

/**
 * Tracks the current user ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const id = createReducer( null, {
	[CURRENT_USER_ID_SET]: ( state, action ) => action.userId
}, idSchema );

export default combineReducers( {
	id
} );
