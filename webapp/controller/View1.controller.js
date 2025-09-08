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

        onNewCustomer() {

            let route = sap.ui.core.UIComponent.getRouterFor(this);

            route.navTo("RouteCustomerNew");

        },

        onEditCustomer() {

            let route = sap.ui.core.UIComponent.getRouterFor(this);

            route.navTo("RouteCustomerEdit",{CustomerId:1});

        }
    });
});