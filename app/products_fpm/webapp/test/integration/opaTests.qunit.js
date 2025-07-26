sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'productsfpm/test/integration/FirstJourney',
		'productsfpm/test/integration/pages/ProductsMain'
    ],
    function(JourneyRunner, opaJourney, ProductsMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('productsfpm') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheProductsMain: ProductsMain
                }
            },
            opaJourney.run
        );
    }
);