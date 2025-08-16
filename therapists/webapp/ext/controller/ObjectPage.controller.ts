import ControllerExtension from 'sap/ui/core/mvc/ControllerExtension';
import ExtensionAPI from 'sap/fe/templates/ObjectPage/ExtensionAPI';
import JSONModel from 'sap/ui/model/json/JSONModel';
import View from 'sap/ui/core/mvc/View';
import Dialog from 'sap/m/Dialog';
import Fragment from 'sap/ui/core/Fragment';
import { DatePicker$ChangeEvent } from 'sap/m/DatePicker';
import { ComboBox$ChangeEvent } from 'sap/m/ComboBox';
import ListItem from 'sap/ui/core/ListItem';
import Context from 'sap/ui/model/odata/v4/Context';
import SinglePlanningCalendar, { SinglePlanningCalendar$AppointmentDropEvent, SinglePlanningCalendar$AppointmentSelectEvent } from 'sap/m/SinglePlanningCalendar';
import ODataListBinding from 'sap/ui/model/odata/v4/ODataListBinding';
import DateFormat from 'sap/ui/core/format/DateFormat';

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
			typeAppointment_ID: string,
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
			typeAppointment_ID: "",
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

	public onChangeDate (event : DatePicker$ChangeEvent) : void {
		let sDate = event.getParameter("value") as string;

		//@ts-ignore
		let form = (this.base.getView() as View).getModel("form") as JSONModel;

		form.setProperty("/endDate", sDate);
		form.setProperty("/startDate", sDate);
		form.setProperty("/endDate2", sDate);
	}

	public async onChangeBlock (event: ComboBox$ChangeEvent) : Promise<void> {
		let item = event.getSource().getSelectedItem() as ListItem;
		let bindingContext = item.getBindingContext() as Context;
		let sBeginTime = await bindingContext.requestProperty("beginTime");
		let sEndTime = await bindingContext.requestProperty("endTime");
		//@ts-ignore
		let form = (this.base.getView() as View).getModel("form") as JSONModel;
		form.setProperty("/beginTime", sBeginTime);
		form.setProperty("/endTime", sEndTime);
		form.setProperty("/startDate", form.getProperty("/startDate")+"T"+sBeginTime);
		form.setProperty("/endDate2", form.getProperty("/endDate")+"T"+sEndTime)
	}


	public async onSavePress () : Promise<void> {
		//@ts-ignore
		let form = (this.base.getView() as View).getModel("form") as JSONModel;
		let body = form.getData();
		let planningCalendar = this.base.getExtensionAPI().byId("fe::CustomSubSection::PlanningCalendar--calendar") as SinglePlanningCalendar;
		let bindList = planningCalendar.getBinding("appointments") as ODataListBinding;

		await bindList.create(body).created();
		this.reset();
	}

	private reset () : void {
		this.formModel();
		this.onClosePress();
	}

	public async onNavToAppointments (event : SinglePlanningCalendar$AppointmentSelectEvent) : Promise<void> {
		//@ts-ignore
		let ui = (this.base.getView() as View).getModel("ui") as JSONModel;
		let isEditable = ui.getProperty("/isEditable") as boolean;
		let appointment = event.getParameter("appointment");
		let context = appointment?.getBindingContext() as Context;
		let sTherapistID = await context.requestProperty("therapist_ID");
		let sAppointmentID = await context.requestProperty("ID");

		this.base.getExtensionAPI().getRouting().navigateToRoute("TherapistsSet_toAppointmentsObjectPage", {
			key: sTherapistID,
			boolean: !isEditable,
			toAppointmentsKey: sAppointmentID,
			boolean2: !isEditable
		});
	}

	public async onAppointmentDrop (event : SinglePlanningCalendar$AppointmentDropEvent) : Promise<void> {
		let oStarDate = event.getParameter("startDate") as Date,
			sStartDate = DateFormat.getDateInstance({pattern: 'yyyy-MM-dd'}).format(oStarDate),
			sEndDate = sStartDate,
			oAppointment = event.getParameter("appointment"),
			context = oAppointment?.getBindingContext() as Context,
			sBeginTime = await context.requestProperty("beginTime"),
			sEndTime = await context.requestProperty("endTime");
			
			await context.setProperty("beginDate", sStartDate);
			await context.setProperty("endDate", sEndDate);
			await context.setProperty("startDate", sStartDate.concat("T").concat(sBeginTime));
			await context.setProperty("endDate2", sEndDate.concat("T").concat(sEndTime));
	}
}