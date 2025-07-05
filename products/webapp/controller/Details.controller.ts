import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Button from "sap/m/Button";
import VBox from "sap/m/VBox";
import FlexBox from "sap/m/FlexBox";
import Context from "sap/ui/model/odata/v4/Context";

/**
 * @namespace products.controller
 */

export default class Details extends BaseController {

    formFragments : VBox[] = [];

    public onInit ( ) : void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onBindingContext.bind(this))
    }

    private onBindingContext (event : Route$PatternMatchedEvent) : void {

        const arg = event.getParameter("arguments") as any;
        const id = arg.id;
        const view = this.getView() as View;
        
        view.bindElement({
            path: `/ProductsSet(${id})`,
            model: 'products'
        });
    }

    public onClosePress () : void {
        const model = this.getModel("view") as JSONModel;
        model.setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
        model.setProperty("/layout","OneColumn");
        this.getRouter().navTo("RouteMaster");
    }

    public toggleFullScreen () : void {
        const model = this.getModel("view") as JSONModel;
        const bFullScreen =  model.getProperty("/actionButtonsInfo/midColumn/fullScreen");
        model.setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);

        if (!bFullScreen) {
            model.setProperty("/previosLayout", model.getProperty("/layout")); 
            model.setProperty("/layout","MidColumnFullScreen");
        } else {
            model.setProperty("/layout", model.getProperty("/previosLayout"))
        }
    }

    public handleEditPress () : void {
        this.toggleButtonAndView(true);
    }

    public handleDeletePress () : void {

    }

    public handleSavePress () : void {
        this.toggleButtonAndView(false);
    }

    public handleCancelPress () : void {
        this.toggleButtonAndView(false);
    }

    public toggleButtonAndView (bEdit : boolean) : void {
        (this.byId("edit") as Button).setVisible(!bEdit);
        (this.byId("save") as Button).setVisible(bEdit);
        (this.byId("cancel") as Button).setVisible(bEdit);

        this.showFormFragment(bEdit? "Change" : "Display");
    } 

    private async showFormFragment (sFramentName : string) : Promise<void> {
        const fragmentContainer = this.byId("fragmentContainer") as FlexBox;
        fragmentContainer.removeAllItems();

        let vBox = await this.getFormFragment(sFramentName);
        const bindingContext = (this.getView() as View).getBindingContext("products") as Context;
        const id = bindingContext.getProperty("ID");

        vBox.bindElement({
            path: `/ProductsSet(${id})`,
            model: 'products'
        });

        fragmentContainer.addItem(vBox);
    }

    private async getFormFragment (sFragmentName : string) : Promise<VBox> {
        const index = (sFragmentName === 'Display')? 0 : 1;
        const view = this.getView();
        let pFormFragment = this.formFragments[index];

        if (!pFormFragment) {
            pFormFragment = await <Promise<VBox>> this.loadFragment({
                id: view?.getId(),
                name: `products.fragment.${sFragmentName}`
            });
            this.formFragments[index] = pFormFragment;
        }

        return pFormFragment;
    }
}