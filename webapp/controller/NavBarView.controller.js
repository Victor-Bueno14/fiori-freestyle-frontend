sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("zov.controller.NavBarView", {
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
        }
    });
});