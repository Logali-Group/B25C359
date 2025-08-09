import ControllerExtension from 'sap/ui/core/mvc/ControllerExtension';
import ExtensionAPI from 'sap/fe/templates/ObjectPage/ExtensionAPI';
import JSONModel from 'sap/ui/model/json/JSONModel';
import View from 'sap/ui/core/mvc/View';
import Dialog from 'sap/m/Dialog';
import Fragment from 'sap/ui/core/Fragment';

/**
 * @namespace therapists.ext.controller
 * @controller
 */
export default class ObjectPage extends ControllerExtension<ExtensionAPI> {

	dialog : Dialog;

	static overrides = {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf therapists.ext.controller.ObjectPage
		 */
		onInit(this: ObjectPage) {
			// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
			const model = this.base.getExtensionAPI().getModel();
			this.formModel();
		}
	}

	private formModel() : void {
		let data : {
			patient_ID: string,
			title: string,
			description : string,
			beginDate: Date | null,
			endDate: Date | null,
			startDate: string,
			endDate2: string,
			block_ID: string,
			beginTime: string,
			endTime: string
		} = {
			patient_ID: "",
			title: "",
			description :"",
			beginDate: null,
			endDate: null,
			startDate: "",
			endDate2: "",
			block_ID: "",
			beginTime: "",
			endTime: ""
		};
		const model = new JSONModel(data);
		// @ts-ignore
		this.base.getView().setModel(model, "form");
	}

	public async onOpenPress () : Promise<void> {
		//@ts-ignore
		const view = this.base.getView() as View;

		this.dialog??= await Fragment.load({
			id: view.getId(),
			name: "therapists.ext.fragment.Form",
			controller: this
		}) as Dialog;

		view.addDependent(this.dialog);

		this.dialog.bindElement({
			path: '/',
			model: ''
		});

		this.dialog.open();

	}

	public onClosePress () : void {
		this.dialog.close();
	}
}