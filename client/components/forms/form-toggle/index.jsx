/**
 * External dependencies
 */
var React = require( 'react' ),
	classNames = require( 'classnames' );

module.exports = React.createClass( {

	displayName: 'FormToggle',

	propTypes: {
		onChange: React.PropTypes.func,
		checked: React.PropTypes.bool,
		disabled: React.PropTypes.bool,
		id: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			checked: false,
			disabled: false
		};
	},
	_onKeyDown: function( event ) {
		if ( ! this.props.disabled ) {
			if ( event.key === 'Enter' || event.key === ' ' ) {
				event.preventDefault();
				this.props.onChange();
			}
		}
		if ( this.props.onKeyDown ) {
			this.props.onKeyDown( event );
		}
	},

	render: function() {
		var toggleClasses = classNames( {
			'form-toggle': true,
			'is-toggling': this.props.toggling
		} );

		return (
			<span>
				<input
					className={ classNames( this.props.className, toggleClasses ) }
					type="checkbox"
					checked={ this.props.checked }
					readOnly={ true }
					disabled={ this.props.disabled }
					/>
				<label
					className="form-toggle__label"
					disabled={ this.props.disabled }
					onClick={ this.props.onChange }
					onKeyDown={ this._onKeyDown }
					role="checkbox"
					aria-checked={ this.props.checked }
					aria-label={ this.props[ 'aria-label' ] }
					tabIndex={ this.props.disabled ? -1 : 0 }>
					<span className="form-toggle__switch" />
					{ this.props.children }
				</label>
			</span>
		);
	}
} );
