sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'therapists/test/integration/FirstJourney',
		'therapists/test/integration/pages/TherapistsSetList',
		'therapists/test/integration/pages/TherapistsSetObjectPage'
    ],
    function(JourneyRunner, opaJourney, TherapistsSetList, TherapistsSetObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('therapists') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheTherapistsSetList: TherapistsSetList,
					onTheTherapistsSetObjectPage: TherapistsSetObjectPage
                }
            },
            opaJourney.run
        );
    }
);