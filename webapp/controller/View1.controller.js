sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        //Métodos do framework[->]
        onInit() {

            let oModel1 = new sap.ui.model.json.JSONModel();
            let oModel2 = new sap.ui.model.json.JSONModel();
            let oModel3 = new sap.ui.model.json.JSONModel();

            oModel1.setData({"usuario": {"nome": "Victor"}});
            oModel1.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel1,"oneway");

            oModel2.setData({"usuario": {"nome": "Mavih"}});
            oModel2.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oModel2,"twoway");
            
            oModel3.setData({"usuario": {"nome": "Messi"}});
            oModel3.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
            this.getView().setModel(oModel3,"onetime");

        },
        //Métodos do framework[<-]

        onTestOneWay() {

            let oModel = this.getView().getModel("oneway");
            let oData = oModel.getData();

            oData.usuario.nome = "Victor Bueno";

            oModel.setData(oData);

        },

        onTestTwoWay() {

            let oModel = this.getView().getModel("twoway");
            let oData = oModel.getData();

            oData.usuario.nome = "Mavih Dutra";

            oModel.setData(oData);

        },

        onTestOneTime() {

            let oModel = this.getView().getModel("onetime");
            let oData = oModel.getData();

            oData.usuario.nome = "Lionel Messi";

            oModel.setData(oData);

        }
    });
});