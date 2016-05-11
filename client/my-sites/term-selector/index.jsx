/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import unescapeString from 'lodash/unescape';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import camelCase from 'lodash/camelCase';
import sortBy from 'lodash/sortBy';
import includes from 'lodash/includes';

/**
 * Internal dependencies
 */
import NoResults from './no-results';
import analytics from 'lib/analytics';
import Search from './search';

/**
* Module Constants
*/
const SCROLL_THROTTLE_TIME_MS = 400;
const SEARCH_DEBOUNCE_TIME_MS = 500;

function sortBranch( items ) {
	return sortBy( items, function( item ) {
		return item.name.toLowerCase();
	} );
}

class TermSelector extends Component {
	constructor( props ) {
		super( props );

		this.checkScrollPosition = throttle( function() {
			const node = ReactDom.findDOMNode( this );

			if ( node.scrollTop + node.clientHeight >= node.scrollHeight ) {
				this.maybeFetchNextPage();
			}
		}, SCROLL_THROTTLE_TIME_MS );

		this.state = {
			searchTerm: null,
			selectedIds: this.getSelectedIds()
		};
	}

	getSelectedIds( selected ) {
		const selectedObjects = selected || this.props.selected;
		return selectedObjects.map( function( item ) {
			if ( ! item.ID ) {
				return item;
			}

			return item.ID;
		} );
	}

	componentWillMount() {
		this.debouncedSearch = debounce( function() {
			this.props.onSearch( this.state.searchTerm );
		}.bind( this ), SEARCH_DEBOUNCE_TIME_MS );
	}

	componentWillReceiveProps( nextProps ) {
		const nextSelectedIds = this.getSelectedIds( nextProps.selected );

		if ( nextProps.categories &&
				this.props.categories &&
				nextSelectedIds.length === ( this.state.selectedIds.length + 1 ) &&
				nextProps.categories.length === ( this.props.categories.length + 1 ) ) {
			ReactDom.findDOMNode( this.refs.wrapper ).scrollTop = 0;
		}

		if ( ! isEqual( nextSelectedIds, this.state.selectedIds ) ) {
			this.setState( { selectedIds: nextSelectedIds } );
		}
	}

	hasNoSearchResults() {
		return ! this.props.categoriesFetchingNextPage &&
			( this.props.categories && ! this.props.categories.length ) &&
			this.state.searchTerm;
	}

	// this logic is redundant to similar checks in lib/terms/actions, but I would like to capture ga events here
	maybeFetchNextPage() {
		if ( this.props.categoriesHasNextPage ) {
			analytics.ga.recordEvent( this.props.analyticsPrefix, 'Fetched More Categories' );
			this.props.categoriesFetchNextPage();
		}
	}

	renderItem( item ) {
		const { multiple, analyticsPrefix, defaultCategoryId, onChange } = this.props;
		const { selectedIds } = this.state;
		const itemId = item.ID;
		const name = unescapeString( item.name ) || this.translate( 'Untitled' );
		const checked = includes( selectedIds, itemId );
		const inputType = multiple ? 'checkbox' : 'radio';
		const domId = camelCase( analyticsPrefix ) + '-option-' + itemId;
		let disabled;

		if ( multiple && checked && defaultCategoryId &&
				( 1 === selectedIds.length ) &&
				( defaultCategoryId === itemId ) ) {
			disabled = true;
		}

		const input = (
			<input id={ domId } type={ inputType } name="terms"
				value={ itemId }
				onChange={ onChange.bind( null, item ) }
				disabled={ disabled }
				checked={ checked } />
		);

		return (
			<li key={ 'category-' + itemId }>
				<label>{ input } { name }</label>
				{ item.items ? this.renderHierarchy( item.items, true ) : null }
			</li>
		);
	}

	onSearch( event ) {
		let newSearch = event.target.value;

		if ( this.state.searchTerm && ! newSearch.length ) {
			this.props.onSearch( null );
		}

		if ( newSearch !== this.state.searchTerm ) {
			analytics.ga.recordEvent( this.props.analyticsPrefix, 'Performed Category Search' );
			this.setState( { searchTerm: event.target.value } );
			this.debouncedSearch();
		}
	}

	renderHierarchy( items, isRecursive ) {
		const depth = isRecursive ? '' : 'depth-0';

		items = sortBranch( items );

		return (
			<ul className={ depth }>
				{ items.map( this.renderItem, this ) }
				{
					this.props.categoriesFetchingNextPage && ! isRecursive
					? this.renderPlaceholderItem()
					: null
				}
			</ul>
		);
	}

	renderPlaceholderItem() {
		const inputType = this.props.multiple ? 'checkbox' : 'radio';

		return (
			<li>
				<input className="placeholder-text" type={ inputType } name="terms" disabled={ true } />
				<label><span className="placeholder-text">Loading list of options...</span></label>
			</li>
		);
	}

	renderPlaceholder() {
		return ( <ul>{ this.renderPlaceholderItem() }</ul> );
	}

	render() {
		const { children, categories, className, categoriesFound, searchThreshold, categoriesFetchingNextPage } = this.props;
		const numberCategories = categoriesFound || 0;
		const showSearch = ( numberCategories > searchThreshold ) || this.state.searchTerm;

		const classes = classNames(
			'category-selector',
			className, {
				'is-loading': categoriesFetchingNextPage,
				'is-compact': ! showSearch && ! categoriesFetchingNextPage
			}
		);

		return (
			<div onScroll={ this.checkScrollPosition } className={ classes } ref="wrapper">
				{ children }
				{ showSearch && ( <Search searchTerm={ this.state.searchTerm } onSearch={ this.onSearch } /> ) }
				{ this.hasNoSearchResults() && ( <NoResults createLink={ this.props.createLink } /> ) }
				<form>
					{ categories ? this.renderHierarchy( categories ) : this.renderPlaceholder() }
				</form>
			</div>
		);
	}
}

TermSelector.propTypes = {
	categories: PropTypes.array,
	categoriesFound: PropTypes.number,
	categoriesHasNextPage: PropTypes.bool,
	categoriesFetchingNextPage: PropTypes.bool,
	categoriesFetchNextPage: PropTypes.func,
	multiple: PropTypes.bool,
	className: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	selected: PropTypes.array,
	createLink: PropTypes.string,
	analyticsPrefix: PropTypes.string,
	searchThreshold: PropTypes.number,
	defaultCategoryId: PropTypes.number
};

TermSelector.defaultProps = {
	analyticsPrefix: 'Category Selector',
	searchThreshold: 8,
	selected: [],
	defaultCategoryId: null
};

export default connect(
	( state, ownProps ) => {
		return {};
	},
	{

	}
)( TermSelector );
