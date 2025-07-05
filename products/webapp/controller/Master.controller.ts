import Input from "sap/m/Input";
import BaseController from "./BaseController";
import { FilterBar$SearchEvent, FilterBar$ClearEvent } from "sap/ui/comp/filterbar/FilterBar";
import Control from "sap/ui/core/Control";
import ComboBox from "sap/m/ComboBox";
import RatingIndicator from "sap/m/RatingIndicator";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import RangeSlider from "sap/m/RangeSlider";
import Event from "sap/ui/base/Event";
import ColumnListItem from "sap/m/ColumnListItem";
import Context from "sap/ui/model/odata/v4/Context";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace products.controller
 */
export default class Master extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        //this.setModel()
    }

    public onSearchPress (event : FilterBar$SearchEvent) : void {
        const controls = event.getParameter("selectionSet") as Control[];
        const product = controls[0] as Input;
        const supplier = controls[1] as ComboBox;
        const category = controls[2] as ComboBox;
        const stock = controls[3] as ComboBox;
        const rating = controls[4] as RatingIndicator;
        const price = controls[5] as RangeSlider;
        
        let filters = [];
        let sProduct = product.getValue() as string;
        let sSupplier = supplier.getSelectedKey() as string;
        let sCategory = category.getSelectedKey() as string;
        let sStock = stock.getSelectedKey() as string;
        let sRating = rating.getValue() as float;
        let fMin = (price.getValue() as float) === 0? 1.00 : (price.getValue() as float);
        let fMax = price.getValue2() as float;

        if (sProduct) {
            filters.push(
                new Filter({
                    filters: [
                        new Filter("product", FilterOperator.Contains, sProduct),
                        new Filter("productName", FilterOperator.Contains, sProduct)
                    ],
                    and: false
                })
            );
        }

        if (sSupplier) {
            filters.push(new Filter("supplier_ID", FilterOperator.EQ, sSupplier));
        }

        if (sCategory) {
            filters.push(new Filter("category_ID", FilterOperator.EQ, sCategory));
        }

        if (sStock) {
            filters.push(new Filter("stock_code", FilterOperator.EQ, sStock));
        }

        if (sRating) {
            filters.push(new Filter("rating", FilterOperator.EQ,sRating));
        }

        if (fMin && fMax) {
            filters.push(new Filter("price", FilterOperator.BT, fMin, fMax))
        }

        this.applyFilters(filters);
    }

    private applyFilters (filters: Filter[]) : void {
        let table = this.byId("table") as Table;
        let binding = table.getBinding("items") as ListBinding;
        binding.filter(filters);
    }

    public onClearPress (event : FilterBar$ClearEvent) : void {
        const controls = event.getParameter("selectionSet") as Control[];
        const product = controls[0] as Input;
        const supplier = controls[1] as ComboBox;
        const category = controls[2] as ComboBox;
        const stock = controls[3] as ComboBox;
        const rating = controls[4] as RatingIndicator;
        const price = controls[5] as RangeSlider;

        product.setValue("");
        supplier.setSelectedKey("");
        category.setSelectedKey("");
        stock.setSelectedKey("");
        rating.setValue(0);
        price.setValue(0,{});
        price.setValue2(100);

        this.applyFilters([]);
    }

    public onNavToDetails (event : Event) : void {

        const item = (event.getSource() as ColumnListItem);
        const bindingContext = item.getBindingContext("products") as Context;
        const id = bindingContext.getProperty("ID");

        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout","TwoColumnsMidExpanded");

        const router = this.getRouter();
        router.navTo("RouteDetails", {
            id: id
        });
    }
}