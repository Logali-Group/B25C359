sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'productscapcdsannotations/test/integration/FirstJourney',
		'productscapcdsannotations/test/integration/pages/ProductsList',
		'productscapcdsannotations/test/integration/pages/ProductsObjectPage'
    ],
    function(JourneyRunner, opaJourney, ProductsList, ProductsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('productscapcdsannotations') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheProductsList: ProductsList,
					onTheProductsObjectPage: ProductsObjectPage
                }
            },
            opaJourney.run
        );
    }
);