import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from '../../../../common/translators/reactTranslator';
import { popupStore } from '../../stores/PopupStore';
// import { Icon } from '../../../common/components/ui/Icon';

import './footer.pcss';

export const Footer = observer(() => {
    const store = useContext(popupStore);
    let footerContent = (
        <>
            <div className="footer__text">
                <div className="footer__text__title">
                    {reactTranslator.getMessage('popup_adguard_footer_title')}
                </div>
                <div className="footer__text__text">
                    {reactTranslator.getMessage('popup_adguard_footer_text')}
                </div>
            </div>
        </>
    );

    if (store.isEdgeBrowser) {
        const currentYear = new Date().getFullYear();
        const footerText = `© 2009-${currentYear} PremiumAdBlock`;
        footerContent = <div className="footer__text">{footerText}</div>;
    }

    return (
        <div className="footer">{footerContent}</div>
    );
});
