sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("zov.controller.DeleteOvView", {
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

            const oI18n = oView.getModel("i18n").getResourceBundle();

            const iOrdemId = oView.byId("ordemIdDelete")

            if (iOrdemId.getValue() === "") {
                iOrdemId.setValueState("Error");

                iOrdemId.setValueStateText(oI18n.getText("requiredField"));

                MessageBox.alert(oI18n.getText("emptySalesOrder"));

                return;
            };

            this.read(iOrdemId.getValue());
        },

        onClean: function () {
            const oView = this.getView();
            const iClientId = oView.byId("clienteIdDelete").getValue();

            if (iClientId != "") {
                oView.byId("dataCriacaoDelete").setValue("");
                oView.byId("criadoPorDelete").setValue("");
                oView.byId("clienteIdDelete").setValue("");
                oView.byId("totalItensDelete").setValue("");
                oView.byId("totalFreteDelete").setValue("");
                oView.byId("totalOrdemDelete").setValue("");
                oView.byId("statusOrdemDelete").setValue("");
            }
        },

        onDelete: function () {
            const iOrdemId = this.getView().byId("ordemIdDelete").getValue();

            const oI18n = this.getView().getModel("i18n").getResourceBundle();

            if (iOrdemId === "") {
                MessageBox.alert(oI18n.getText("emptySalesOrder"));

                return
            }; 
            
            this.delete(iOrdemId);

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

                    oView.byId("dataCriacaoDelete").setValue(sDate);
                    oView.byId("criadoPorDelete").setValue(oData2.CriadoPor);
                    oView.byId("clienteIdDelete").setValue(oData2.ClienteId);
                    oView.byId("totalItensDelete").setValue(oData2.TotalItens);
                    oView.byId("totalFreteDelete").setValue(oData2.TotalFrete);
                    oView.byId("totalOrdemDelete").setValue(oData2.TotalOrdem);
                    oView.byId("statusOrdemDelete").setValue(oData2.Status);

                    that.readItems(iOrdemId);

                    MessageToast.show(oI18n.getText("readingSuccess"));
                },
                error: function (oError) {
                    oView.setBusy(false);

                    const oObj = JSON.parse(oError.responseText);

                    MessageToast.show(oObj.error.message.value)
                }
            })
        },

        readItems: function (iOrdemId) {
            const oView = this.getView();

            const oModel = this.getOwnerComponent().getModel();

            const oTModel = oView.getModel("table");

            oModel.read("/OVCabSet(" + iOrdemId + ")/toOVItem", {
                success: function(oData2) {
                    oTModel.setData(oData2.results);
                }
            })
        },

        delete: function (iOrdemId) {
            const that = this;

            const oView = this.getView();

            const oModel = this.getOwnerComponent().getModel();

            const oTModel = oView.getModel("table");

            const oI18n = oView.getModel("i18n").getResourceBundle();

            oView.setBusy(true);

            oModel.remove("/OVCabSet(" + iOrdemId + ")", {
                success: function (oData2, oResponse) {
                    oView.setBusy(false);

                    MessageToast.show(oI18n.getText("deleteSuccess"));

                    oTModel.setData([]);

                    that.onClean();
                },
                error: function (oError) {
                    oView.setBusy(false);

                    console.log(oError);

                    const oObj = JSON.parse(oError.responseText);

                    MessageToast.show(oObj.error.message.value);
                }
            })
        }
    });
});