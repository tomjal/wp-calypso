/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';

export default class TermSelectorSearch extends PureComponent {
	constructor( props ) {
		super( props );
	}

	render() {
		const { onSearch, searchTerm } = this.props;

		return (
			<div className="term-selector__search">
				<Gridicon icon="search" size={ 18 } />
				<input type="search"
					placeholder={ this.translate( 'Search…', { textOnly: true } ) }
					value={ searchTerm }
					onChange={ onSearch } />
			</div>
		);
	}
}

TermSelectorSearch.propTypes = {
	searchTerm: PropTypes.string,
	onSearch: PropTypes.func
};

TermSelectorSearch.defaultProps = {
	onSearch: () => {}
};
