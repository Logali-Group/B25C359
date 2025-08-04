import Controller from "sap/fe/core/PageController";
import Button, { Button$PressEvent } from "sap/m/Button";
import EventBus from "sap/ui/core/EventBus";
import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v4/Context";

/**
 * @namespace com.logaligroup.legalguardians.ext.view
 */
export default class Details extends Controller {

    eventBus : EventBus;

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf com.logaligroup.legalguardians.ext.view.Details
     */
    public onInit(): void {
        super.onInit(); // needs to be called to properly initialize the page controller
        this.eventBus = this.getAppComponent().getEventBus();
    }

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf com.logaligroup.legalguardians.ext.view.Details
     */
    // public  onBeforeRendering(): void {
    //
    //  }

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf com.logaligroup.legalguardians.ext.view.Details
     */
    // public  onAfterRendering(): void {
    //
    //  }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf com.logaligroup.legalguardians.ext.view.Details
     */
    // public onExit(): void {
    //
    //  }

    public async onModelContextChange () : Promise<void> {
        
        const context = this.getView()?.getBindingContext() as Context;
        const isActiveEntity = await context.requestProperty("IsActiveEntity");
        await context.setProperty("HasDraftEntity", true);

        /**
         * IsActiveEntity = true --> Significa que el objeto es solo de lectura (T.P)
         * IsActiveEntity = false --> Significa que el objecto está en modo edición (C.T.P - Draft)
         */

        if (isActiveEntity !== undefined) {
            const ui = this.getView()?.getModel("ui") as JSONModel;
            ui.setProperty("/isEditable", !isActiveEntity);
        }
       
    }

    public refreshTable () : void {
        this.eventBus.publish("legal_guardians_refresh_table","refreshTable");
    }


    public async onEditPress () : Promise<void> {
        const context = this.getView()?.getBindingContext() as Context;
        await this.getExtensionAPI().getEditFlow().editDocument(context);
        this.refreshTable();
    }

    public async onDeletePress () : Promise<void> {
        const context = this.getView()?.getBindingContext() as Context;
        await this.getExtensionAPI().getEditFlow().deleteDocument(context);
        this.refreshTable();
    }

    public async onCancelPress (event : Button$PressEvent) : Promise<void> {
        const context = this.getView()?.getBindingContext() as Context;
        const button = event.getSource() as Button;
        console.log("Estoy a punto de cancelar");
        await this.getExtensionAPI().getEditFlow().cancelDocument(context, {
            control: button
        });
        this.refreshTable();
        console.log("Termine");
    }
}