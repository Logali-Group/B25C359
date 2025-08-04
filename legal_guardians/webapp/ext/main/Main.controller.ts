import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/fe/core/PageController";
import Table from "sap/fe/macros/table/Table";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import EventBus from "sap/ui/core/EventBus";
import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v4/Context";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace com.logaligroup.legalguardians.ext.main
 */
export default class Main extends Controller {

    eventBus : EventBus;

    table : Table;

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    public onInit(): void {
        super.onInit(); // needs to be called to properly initialize the page controller
        this.eventBus = this.getAppComponent().getEventBus();
        this.eventBus.subscribe("legal_guardians_refresh_table","refreshTable",this.refreshTable.bind(this));
        this.view();
        this.table = this.byId("Table") as Table;

        const router = this.getAppComponent().getRouter();
        router.getRoute("LegalGuardiansSetMain")?.attachPatternMatched(this.onIsEditable.bind(this))
    }

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    // public  onBeforeRendering(): void {
    //
    //  }

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    // public  onAfterRendering(): void {
    //
    //  }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf com.logaligroup.legalguardians.ext.main.Main
     */
    // public onExit(): void {
    //
    //  }

    private async onIsEditable () : Promise<void> {
        const ui = this.getView()?.getModel("ui") as JSONModel;
        ui.setProperty("/isEditable", false);
    }


    public view () : void {
        let data = {
            isActive : false
        }
        this.getView()?.setModel(new JSONModel(data),"view");
    }


    public refreshTable () : void {
        (this.byId("Table") as Table).refresh();
    }


    public async onCreatePress () : Promise<void> {
        await this.getExtensionAPI().getEditFlow().createDocument("/LegalGuardiansSet", {
            creationMode: "NewPage",
            data: {
                ID: ""
            }
        });
        this.refreshTable();
    }

    public onSelectionChange () : void {
        const view = this.getView()?.getModel("view") as JSONModel;
        const table = this.byId("Table") as Table;
        const contexts = table.getSelectedContexts() as Context[];

        if (contexts.length >= 1) {
            view.setProperty("/isActive", true);
        } else {
            view.setProperty("/isActive", false);
        }
    }


    public async onDeletePress () : Promise<void> {
        const table = this.table;
        const contexts = table.getSelectedContexts() as Context[];
        const resourceBundle = (this.getView()?.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
        const question = (contexts.length >1? resourceBundle.getText("questionBatchDelete") : resourceBundle.getText("questionDelete")) as string;
        const message = (contexts.length >1? resourceBundle.getText("messageBatchDelete") : resourceBundle.getText("messageDelete")) as string;
        const sDelete = resourceBundle.getText("delete");

        MessageBox.warning(question, {
            title: sDelete,
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: async (sAction : string) => {
                if (sAction === "OK") {
                    await this.batchDelete(contexts);
                    this.refreshTable();
                    MessageToast.show(message);
                }
            }
        });
    }

    private async batchDelete (aContext : Context[]) :Promise<void> {
        for (let index in aContext) {
            let context = aContext[index] as Context;
            await context.delete();
        }
    }
}