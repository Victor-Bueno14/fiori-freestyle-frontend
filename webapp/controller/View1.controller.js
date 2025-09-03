sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        //Métodos do framework[->]
        onInit() {

            let oView = this.getView();
            let oModel = new sap.ui.model.json.JSONModel();

            oModel.setData({
                "usuario": {
                    "nome": "Victor",
                    "mensagens": 3
                }
            });

            oView.setModel(oModel);

        },
        //Métodos do framework[<-]
        onPress() {

            let oI18n = this.getView().getModel('i18n').getResourceBundle();
            let oModel = this.getView().getModel();
            let oData = oModel.getData();

            let sText = oI18n.getText("message", [oData.usuario.nome, oData.usuario.mensagens]);
            MessageToast.show(sText);

        }
    });
});