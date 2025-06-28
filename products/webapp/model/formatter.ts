import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import BaseController from "products/controller/BaseController";
import Table from "sap/m/Table";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";


/**
 * @namespace products.model
 */

export default {
    titleFormatter : function (this : Controller) {

        const resourceModel = (this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel;
        const resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;
        // const baseController = new BaseController("");
        // const resourceBundle2 = baseController.getResourceBundle();
        const binding = (this.byId("table") as Table).getBinding("items") as ODataListBinding;

        if (!binding) {
            return resourceBundle.getText("headerProduct",[0]);
        }

        const sNewTitle = resourceBundle.getText("headerProduct",[binding.getLength()]);

        binding.attachChange(()=>{
            let viewModel = this.getView()?.getModel("view") as JSONModel;
            viewModel.setProperty("/title", resourceBundle.getText("headerProduct",[binding.getLength()]));
        });

        return sNewTitle;

    }
}