import Component from "products/Component";
import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import Model from "sap/ui/model/Model";
import View from "sap/ui/core/mvc/View";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace products.controller
 */

export default class BaseController extends Controller {

    public getRouter () : Router {
        return (this.getOwnerComponent() as Component).getRouter();
    }

    public getModel (name : string) : Model {
        return (this.getView() as View)?.getModel(name) as Model;
    }

    public setModel (model : Model, name : string) : View | undefined {
        return this.getView()?.setModel(model, name);
    }

    public getResourceBundle() : ResourceBundle {
        let oi18n = (this.getOwnerComponent() as Component)?.getModel("i18n") as ResourceModel;
        return oi18n.getResourceBundle() as ResourceBundle;
    }

}