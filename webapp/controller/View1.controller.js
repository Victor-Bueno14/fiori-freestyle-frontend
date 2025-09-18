sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        //Métodos do framework[->]
        onInit: function() {
        },
        //Métodos do framework[<-]
        onNavBack: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("RouteView1");
            }
        },

        onHome: function () {

            this.getRouter().navTo("RouteView1")

        },

        onCreateOv: function() {

            this.getRouter().navTo("RouteCreateOv");

        },

        onCreateDeepOv: function() {

            this.getRouter().navTo("RouteCreateDeepOv");

        },

        onReadOv: function() {

            this.getRouter().navTo("RouteReadOv");

        },

        onEditOv: function () {

            this.getRouter().navTo("RouteEditOv");

        },

        onDeleteOv: function () {

            this.getRouter().navTo("RouteDeleteOv");

        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        formatDateBr: function (sValue) {
            if (!sValue){
                return ""; //se sValue for null, undefined ou "", retorna vazio;
            } else {
                const oDate = new Date(sValue);

                return oDate.toLocaleDateString("pt-BR");
            };
        }
    });
});