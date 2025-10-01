sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("zov.controller.DeleteOvView", {
        //Métodos do framework[->]
        onInit: function() {
        },
        //Métodos do framework[<-]

        onSearch: function () {
            const oView = this.getView();

            const iOrdemId = oView.byId("ordemIdDelete")

            if (iOrdemId.getValue() === "") {
                iOrdemId.setValueState("Error");

                iOrdemId.setValueStateText("Campo Obrigatório");

                MessageBox.alert("Insira uma Ordem de Venda");

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

            if (iOrdemId === "") {
                MessageToast.show("Insira uma Ordem de Venda");
            } else {
                this.delete(iOrdemId);
            }

        },

        read: function (iOrdemId) {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

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

                    MessageToast.show("Leitura realizada com sucesso");
                },
                error: function (oError) {
                    oView.setBusy(false);

                    if (oError.statusCode == 404) {
                        MessageToast.show("Ordem Não Encontrada");
                    } else {
                        const oObj = JSON.parse(oError.responseText);

                        MessageToast.show(oObj.error.message.value)
                    }
                }
            })
        },

        delete: function (iOrdemId) {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            oView.setBusy(true);

            oModel.remove("/OVCabSet(" + iOrdemId + ")", {
                success: function (oData2, oResponse) {
                    oView.setBusy(false);

                    MessageToast.show("Ordem Deletada com Sucesso");
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