sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        //Métodos do framework[->]
        onInit() {

            let oView = this.getView();

            //Model padrão da View
            // let oModel = new sap.ui.model.json.JSONModel();

            // oModel.setData({"usuario": {"nome": "Victor"}});
            // oView.setModel(oModel);

            //Model com o nome "dados"
            let oModel2 = new sap.ui.model.json.JSONModel();
            oModel2.setData({"usuario": {"nome":"Mavih"}});
            oView.setModel(oModel2, "dados");

        },
        //Métodos do framework[<-]
        onTestModels() {
            
            //Model padrão da View
            // let sText = this.getView().getModel().getData().usuario.nome;
            // console.log("Texto com o Model padrão - " + sText);
            
            //Model com o nome "dados"
            let sText = this.getView().getModel("dados").getData().usuario.nome;
            console.log("Texto com o Model 'dados' - " + sText);

            //Model i18n
            let oI18n = this.getView().getModel("i18n").getResourceBundle();
            sText = oI18n.getText("title");

            console.log("Texto com a chave 'title' - " + sText);

            //Model com o nome "usuarios"
            let aUsers = this.getView().getModel("usuarios").getData();
            sText = aUsers[0].nome;

            console.log("Texto com o Model 'usuarios' - " + sText);

            //Model do serviço oData.
            let oModel = this.getOwnerComponent().getModel();
            oModel.read("/OVCabSet", {
                success: function(oData, oResponse) {
                    console.log("Dados retornados do Serviço");
                    console.log(oData);
                    console.log(oResponse);
                },
                error: function(oError){
                    console.log(oError)
                }
            });
        }
    });
});