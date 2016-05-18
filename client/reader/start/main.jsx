// External dependencies
import React from 'react';
import debugModule from 'debug';
import { connect } from 'react-redux';

// Internal dependencies
import Main from 'components/main';
import Button from 'components/button';
import StartCard from './card';

const debug = debugModule( 'calypso:reader:start' ); //eslint-disable-line no-unused-vars

const Start = React.createClass( {
	render() {
		return (
			<Main className="reader-start">
				<header className="reader-start__intro">
					<h1>{ this.translate( 'Welcome to the Reader' ) }</h1>
					<p>{ this.translate( "Discover great stories and read your favorite sites' posts all in one place. Every time there are new updates to the sites you follow, you'll be the first to know!" ) }
				</p>
				</header>

				<div className="reader-start__cards">
					<StartCard />
					<StartCard />
					<StartCard />
					<StartCard />
					<StartCard />
				</div>

				<div className="reader-start-footer">
					<div className="reader-start-footer__action main">
						<span>Follow one or more sites to get started</span>
						<Button disabled>{ this.translate( "OK, I'm all set!" ) }</Button>
					</div>
				</div>
			</Main>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			recommendations: {}
		};
	}
)( Start );
