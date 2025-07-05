import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

/**
 * @namespace products.controller
 */
export default class App extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.viewModel();
    }

    private viewModel () : void {
        let data = {
            title: "",
            layout: "OneColumn",
            previosLayout: "",
            actionButtonsInfo: {
                midColumn: {
                    fullScreen: false
                }
            }
        }
        let model = new JSONModel(data);
        this.setModel(model, "view");
    }
}