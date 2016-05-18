/**
 * External dependencies
 */
import find from 'lodash/find';
import React from 'react';

/**
 * Internal dependencies
 */
import CustomDomainPurchaseDetail from './custom-domain-purchase-detail';
import i18n from 'lib/mixins/i18n';
import { isPersonal } from 'lib/products-values';
import PurchaseDetail from 'components/purchase-detail';

const PersonalPlanDetails = ( { selectedSite, sitePlans } ) => {
	const plan = find( sitePlans.data, isPersonal );

	return (
		<div>
			{ plan.hasDomainCredit && <CustomDomainPurchaseDetail selectedSite={ selectedSite } /> }

			<PurchaseDetail
				icon="speaker"
				title={ i18n.translate( 'No Ads' ) }
				description={
					i18n.translate(
						'Personal plan automatically removes all Ads from your site. ' +
						'Now your visitors can enjoy your great content without distractions!'
					)
				}
			/>
		</div>
	);
};

PersonalPlanDetails.propTypes = {
	selectedSite: React.PropTypes.oneOfType( [
		React.PropTypes.bool,
		React.PropTypes.object
	] ).isRequired,
	sitePlans: React.PropTypes.object.isRequired
};

export default PersonalPlanDetails;
