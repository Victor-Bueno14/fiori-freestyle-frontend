sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        //Métodos do framework[->]
        onInit() {
        },
        //Métodos do framework[<-]
        onCalcular() {
            const oView = this.getView();
            const fB1 = parseFloat(oView.byId("b1").getValue());
            const fB2 = parseFloat(oView.byId("b2").getValue());
            const fB3 = parseFloat(oView.byId("b3").getValue());
            const fB4 = parseFloat(oView.byId("b4").getValue());
            let fResultado = 0;

            fResultado = (fB1 + fB2 + fB3 + fB4) / 4;

            oView.byId("resultado").setValue(fResultado);

            //Sem declarar a depedência.
            //sap.m.MessageToast.show("Resultado: " + fResultado);

            //Declarando a depedência. 
            MessageToast.show("Resultado: " + fResultado);
        }
    });
});