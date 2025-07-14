import Component from "products/Component";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageBox from "sap/m/MessageBox";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v4/Context";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace products.utils
 */


export default class Utils {

    public copy (bindingContext : Context) : object {
        return {
            product:            bindingContext.getProperty("product"),
            productName:        bindingContext.getProperty("productName"),
            description:        bindingContext.getProperty("description"),
            supplier_ID:        bindingContext.getProperty("supplier_ID"),
            category_ID:        bindingContext.getProperty("category_ID"),
            subCategory_ID:     bindingContext.getProperty("subCategory_ID"),
            stock_code:         bindingContext.getProperty("stock_code"),
            rating:             bindingContext.getProperty("rating"),
            price:              bindingContext.getProperty("price"),
            currency:           bindingContext.getProperty("currency")
        }
    }


    public async crud (controller : Controller, action: string, bindingContext? : Context, model? : JSONModel) : Promise<void | string> {
        
        const resourceModel = (controller.getOwnerComponent() as Component).getModel("i18n") as ResourceModel;
        const resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;
        const that = this;

        if (action === 'create') {
            return await that._create(controller);
        }

        MessageBox.confirm(resourceBundle.getText("question") || 'no text defined', {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: async function (sAction : string) : Promise<void | string> {
                if (sAction === MessageBox.Action.OK) {
                    switch (action) {
                        case 'update': return await that._update(controller, bindingContext, model);
                        case 'delete': return await that._delete(controller);
                    }
                }
            }
        });



    }


    private async _create (controller : Controller) : Promise<string> {
        return "";
    }

    private async _update (controller: Controller, bindingContext? : Context, model?: JSONModel) : Promise<void> {

    }

    private async _delete (controller : Controller, bindingContext? : Context) : Promise<void> {

    }

}