sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
], (Controller, formatter) => {
    "use strict";

    return Controller.extend("zov.controller.View2", {
        formatter: formatter,

        //Métodos do framework[->]
        onInit: function() {
            const oDModel = new sap.ui.model.json.JSONModel();

            oDModel.setData({
                DataCriacao: new Date(),
                Preco: "1500.23",
                Moeda: "BRL",
                Status: "N",
                CPF: "13112904940"
            });

            this.getView().setModel(oDModel, "dados");
        },
        onChange: function(oEvent) {
            const oInput = oEvent.getSource();
            let sValue = oInput.getValue();

            //Removendo o que não é número.
            sValue = sValue.replace(/[^\d]/g, '');

            if(sValue == "") {
                oInput.setValue(sValue);

                return;
            }

            //Removendo zero a esqueda.
            sValue = sValue.replace(/^0+/, '');

            const iLength = sValue.length;

            if (iLength == 1) {
                sValue = "0,0" + sValue;
            } else if (iLength == 2) {
                sValue = "0," + sValue;
            } else if (iLength > 2) {
                sValue = sValue.slice(0, length - 2) + "." + sValue.slice(-2);
                sValue = formatter.formatPrice(sValue);
            } else {
                sValue = "";
            };

            oInput.setValue(sValue);
        }
        //Métodos do framework[<-]
    });
});