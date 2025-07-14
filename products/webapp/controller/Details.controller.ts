import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Button from "sap/m/Button";
import VBox from "sap/m/VBox";
import FlexBox from "sap/m/FlexBox";
import Context from "sap/ui/model/odata/v4/Context";
import Utils from "products/utils/Utils";
import SimpleFormValidator from "products/utils/Validator";
import Control from "sap/ui/core/Control";
import MessageBox from "sap/m/MessageBox";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace products.controller
 */

export default class Details extends BaseController {

    formFragments : VBox[] = [];

    public onInit ( ) : void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onBindingContext.bind(this));

        this.formModel();
    }

    private onBindingContext (event : Route$PatternMatchedEvent) : void {

        const arg = event.getParameter("arguments") as any;
        const id = arg.id;
        const view = this.getView() as View;
        const viewModel = this.getModel("view") as JSONModel;
        let sAction = viewModel.getProperty("/action");

        if (id && viewModel.getProperty("/layout") === 'OneColumn') {
            viewModel.setProperty("/layout","TwoColumnsMidExpanded");
        }
        
        view.bindElement({
            path: `/ProductsSet(${id})`,
            model: 'products',
            parameters: {
                $select: 'ID,product,productName,description,supplier_ID,category_ID,subCategory_ID,stock_code,rating,price,currency'
            },
            events: {
                dataRequested: () => {
                    view.setBusy(true);
                },
                dataReceived: () => {
                    view.setBusy(false);
                    if (sAction === 'create') {
                        this.toggleButtonAndView(true);
                    } else {
                        this.showFormFragment('Display');
                    }
                } 
            }
        });
    }

    private formModel () {
        let data = {
            product: "",
            productName: "",
            description: "",
            supplier_ID: "",
            category_ID: "",
            subCategory_ID: "",
            stock_code: "",
            rating: "",
            price: null,
            currency: ""
        };
        let model = new JSONModel(data);
        this.setModel(model, "form");
    }

    private validate () : boolean {
        const simpleFormValidator = new SimpleFormValidator();
        const oVBox = this.formFragments[1] as VBox;
        const aggregations  = oVBox.getAggregation("items") as Control[];
        const simpleForm = aggregations[0] as SimpleForm;
        return simpleFormValidator.validate(simpleForm);
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
        const formModel = this.getModel("form") as JSONModel;
        const bindingContext = this.getView()?.getBindingContext("products") as Context;
        console.log(bindingContext.getObject());
        const utils = new Utils();
        const data = utils.copy(bindingContext);
        console.log(data);
        formModel.setData(data);
        this.toggleButtonAndView(true);
    }

    public handleDeletePress () : void {

    }

    public handleSavePress () : void {

        const resourceBundle = this.getResourceBundle();

        if (!this.validate()) {
            MessageBox.error(resourceBundle.getText("vilidateError") || '');
        } else {
            //MessageToast.show("Editado");
            this.toggleButtonAndView(false);
        }
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