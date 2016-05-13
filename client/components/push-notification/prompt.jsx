/**
 * External dependencies
 */
var React = require( 'react' ),
	debug = require( 'debug' )( 'calypso:push-notification-prompt' );

/**
 * Internal dependencies
 */
var Notice = require( 'components/notice' ),
	observe = require( 'lib/mixins/data-observe' );

module.exports = React.createClass( {
	displayName: 'PushNotificationPrompt',

	mixins: [ observe( 'pushNotifications', 'user' ) ],

	getInitialState: function() {
		return {
			dismissed: false,
			subscribed: false
		};
	},

	subscribe: function() {
		this.props.pushNotifications.subscribe( ( state ) => {
			if ( 'subscribed' === state ) {
				this.setState( { subscribed: true } );
			}
		} );
	},

	dismissNotice: function() {
		this.setState( { dismissed: true } );
	},

	pushUnsubscribedNotice: function() {
		var noticeText = (
			<div>
				<p>
					<strong>{ this.translate( 'Get notifications on your desktop' ) }</strong>
				</p>
				<p>
					{ this.translate( 'See your likes, comments, and more instantly—even when you don\'t have WordPress.com open in your browser.' ) }
				</p>
				<p>
					{ this.translate(
						'{{enableButton}}Enable Browser Notifications{{/enableButton}}', {
							components: {
								enableButton: <button className="button push-notification__prompt-enable" onClick={ this.subscribe } />
							} }
					) }
				</p>
			</div>
		);

		return <Notice text={ noticeText } icon="bell" onDismissClick={ this.dismissNotice } />;
	},

	render: function() {
		var pushNotifications = this.props.pushNotifications,
			user = this.props.user.get();

		if ( ! user || ! user.email_verified || this.state.dismissed || this.state.subscribed ) {
			return null;
		}

		switch ( pushNotifications.state ) {
			case 'unknown':
			case 'subscribed':
			case 'denied':
				return null;
			case 'unsubscribed':
				return this.pushUnsubscribedNotice();
		}

		return null;
	}
} );
