sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.ReadOvView", {
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
                this.getRouter().navTo("RouteReadOv");
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

        onSearch: function () {
            const oView = this.getView();

            const iOrdemId = oView.byId("ordemIdRead").getValue();

            if (iOrdemId === "") {
                MessageToast.show("Insira uma Ordem de Venda");
            } else {
                this.read(iOrdemId);
            }

        },

        onClean: function () {
            const oView = this.getView();

            oView.byId("dataCriacaoRead").setValue("");
            oView.byId("criadoPorRead").setValue("");
            oView.byId("clienteIdRead").setValue("");
            oView.byId("totalItensRead").setValue("");
            oView.byId("totalFreteRead").setValue("");
            oView.byId("totalOrdemRead").setValue("");
            oView.byId("statusOrdemRead").setValue("");
        },

        getRouter: function () {

            return sap.ui.core.UIComponent.getRouterFor(this);

        },

        read: function (iOrdemId) {
            const that = this;
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            oView.setBusy(true);

            oModel.read("/OVCabSet(" + iOrdemId + ")", {
                success: function (oData2) {
                    oView.setBusy(false);

                    let oDate = new Date(oData2.DataCriacao);

                    let sDate = oDate.toLocaleString("pt-BR");

                    oView.byId("dataCriacaoRead").setValue(sDate);
                    oView.byId("criadoPorRead").setValue(oData2.CriadoPor);
                    oView.byId("clienteIdRead").setValue(oData2.ClienteId);
                    oView.byId("totalItensRead").setValue(oData2.TotalItens);
                    oView.byId("totalFreteRead").setValue(oData2.TotalFrete);
                    oView.byId("totalOrdemRead").setValue(oData2.TotalOrdem);
                    oView.byId("statusOrdemRead").setValue(oData2.Status);


                    MessageToast.show("Leitura Realizada com Sucesso");
                },
                error: function (oError) {
                    oView.setBusy(false);

                    if(oError.statusCode == 404) {
                        MessageToast.show("Ordem de Venda Não Encontrada");

                        that.onClean();
                    } else {
                        const oObj = JSON.parse(oError.responseText);

                        MessageToast.show(oObj.error.message.value);
                    };
                }
            })
        }
    });
});