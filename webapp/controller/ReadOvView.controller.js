sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("zov.controller.ReadOvView", {
        //Métodos do framework[->]
        onInit: function() {
            const oTModel = new sap.ui.model.json.JSONModel();

            oTModel.setData([]);

            this.getView().setModel(oTModel, "table");
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
        
        onSearch: function () {
            const oView = this.getView();

            const iOrdemId = oView.byId("ordemIdRead")

            if (iOrdemId.getValue() === "") {
                const oI18n = oView.getModel("i18n").getResourceBundle();

                iOrdemId.setValueState("Error");

                iOrdemId.setValueStateText(oI18n.getText("requiredField"));

                MessageBox.alert(oI18n.getText("emptySalesOrder"));

                return;
            };

            this.read(iOrdemId.getValue());

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

        read: function (iOrdemId) {
            const that = this;
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();
            const oI18n = oView.getModel("i18n").getResourceBundle();

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

                    that.readItems(iOrdemId);

                    MessageToast.show(oI18n.getText("readingSuccess"));
                },
                error: function (oError) {
                    oView.setBusy(false);
                        const oObj = JSON.parse(oError.responseText);

                        MessageToast.show(oObj.error.message.value);
                }
            })
        },

        readItems: function (iOrdemId) {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();
            const oTModel = oView.getModel("table");
            
            oModel.read("/OVCabSet(" + iOrdemId + ")/toOVItem", {
                success: function (oData2) {
                    oTModel.setData(oData2.results);
                },
            });
        }
    });
});