sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'productsxmlannotations/test/integration/FirstJourney',
		'productsxmlannotations/test/integration/pages/ProductsList',
		'productsxmlannotations/test/integration/pages/ProductsObjectPage'
    ],
    function(JourneyRunner, opaJourney, ProductsList, ProductsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('productsxmlannotations') + '/index.html'
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