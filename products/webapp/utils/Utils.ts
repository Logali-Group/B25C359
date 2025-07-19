import Component from "products/Component";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageBox from "sap/m/MessageBox";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
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

        return new Promise( async (resolve, reject) => {
            MessageBox.confirm(resourceBundle.getText("question") || 'no text defined', {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: async function (sAction : string) : Promise<void | string> {
                    if (sAction === MessageBox.Action.OK) {
                        switch (action) {
                            case 'update':  await that._update(controller, bindingContext, model); break;
                            case 'delete':  await that._delete(controller, bindingContext); break;
                        }
                        resolve();
                    } else {
                        reject();
                    }
                }
            });
        });

    }


    private refresh (controller : Controller) : void {
        const model = (controller.getOwnerComponent() as Component).getModel("products");
        model?.refresh();
    }

    private async _create (controller : Controller) : Promise<string> {
        const model = (controller.getOwnerComponent() as Component).getModel("products") as ODataModel;
        const bindList = model.bindList("/ProductsSet") as ODataListBinding;
        const context = bindList.create() as Context;
        await context.created();
        const id = context.getProperty("ID");
        return id;
    }

    private async _update (controller: Controller, bindingContext? : Context, model?: JSONModel) : Promise<void> {

        const view = controller.getView() as View;
        view.setBusy(true);

        return new Promise(async (resolve, reject)=>{
            try {
                await bindingContext?.setProperty("product", model?.getProperty("/product"));
                await bindingContext?.setProperty("productName", model?.getProperty("/productName"));
                await bindingContext?.setProperty("description", model?.getProperty("/description"));
                await bindingContext?.setProperty("supplier_ID", model?.getProperty("/supplier_ID"));
                await bindingContext?.setProperty("category_ID", model?.getProperty("/category_ID"));
                await bindingContext?.setProperty("subCategory_ID", model?.getProperty("/subCategory_ID"));
                await bindingContext?.setProperty("stock_code", model?.getProperty("/stock_code"));
                await bindingContext?.setProperty("rating", model?.getProperty("/rating"));
                await bindingContext?.setProperty("price", model?.getProperty("/price"));
                await bindingContext?.setProperty("currency", model?.getProperty("/currency"));
                this.refresh(controller);
                view.setBusy(false);
                resolve();
            } catch (error) {
                view.setBusy(false);
                reject();
            }
        });

    }

    private async _delete (controller : Controller, bindingContext? : Context) : Promise<void> {

        const view = controller.getView() as View;
        view.setBusy(true);

        return new Promise(async (resolve,reject) => {
            try {
                 view.setBusy(false);
                 await bindingContext?.delete();
                 this.refresh(controller);
                 resolve();
            } catch (error) {
                view.setBusy(false);
                reject();
            }
        });
    }

}