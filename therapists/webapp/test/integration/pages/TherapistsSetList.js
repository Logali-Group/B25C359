sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'therapists',
            componentId: 'TherapistsSetList',
            contextPath: '/TherapistsSet'
        },
        CustomPageDefinitions
    );
});