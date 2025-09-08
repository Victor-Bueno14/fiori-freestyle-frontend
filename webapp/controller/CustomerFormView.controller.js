sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.CustomerFormView", {
        //Métodos do framework[->]
        onInit() {

            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
             oRouter.getRoute("RouteCustomerNew").attachMatched(this._onRouteMatchNew,this);
             oRouter.getRoute("RouteCustomerEdit").attachMatched(this._onRouteMatchEdit,this);

        },
        //Métodos do framework[<-]

        onView1() {

            let route = sap.ui.core.UIComponent.getRouterFor(this);

            route.navTo("RouteView1");

        },

        onNavBack() {

            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {

                window.history.go(-1);

            } else {

                let route = sap.ui.core.UIComponent.getRouterFor(this);

                route.navTo("RouteView1");

            }
        },

        _onRouteMatchNew (oEvent) {

            alert("Modo criação do Cliente!");

        },

        _onRouteMatchEdit (oEvent) {

            let that = this;
            let oArgs = oEvent.getParameter("arguments");
            let sCustomerId = oArgs.CustomerId;

            alert("Modo modificação do cliente " + sCustomerId);

        }
    });
});